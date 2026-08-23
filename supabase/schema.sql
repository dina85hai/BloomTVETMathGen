-- Run once in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text default '',
  institution text default '',
  programme text default '',
  updated_at timestamptz default now()
);

create table if not exists public.question_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  mode text not null,
  subtopic_code text not null,
  bloom_level text not null check (bloom_level in ('C1','C2','C3','C4')),
  difficulty text not null check (difficulty in ('Easy','Medium','Hard')),
  language text not null,
  tvet_field_id text,
  question_json jsonb not null,
  created_at timestamptz default now()
);

create table if not exists public.saved_questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  subtopic_code text not null,
  bloom_level text not null check (bloom_level in ('C1','C2','C3','C4')),
  difficulty text not null check (difficulty in ('Easy','Medium','Hard')),
  tvet_field_id text,
  question_json jsonb not null,
  created_at timestamptz default now(),
  unique(user_id, question_id)
);

create table if not exists public.teacher_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  relevance_score int check (relevance_score between 1 and 5),
  bloom_accuracy int check (bloom_accuracy between 1 and 5),
  difficulty_accuracy int check (difficulty_accuracy between 1 and 5),
  misconception_effectiveness int check (misconception_effectiveness between 1 and 5),
  exam_appropriateness int check (exam_appropriateness between 1 and 5),
  price_rm79 boolean default false,
  price_rm149 boolean default false,
  price_rm249 boolean default false,
  beta_access boolean default false,
  missing_feature text default '',
  comment text default '',
  created_at timestamptz default now()
);


-- Safe upgrades for an existing project created with an earlier schema.
alter table public.teacher_feedback add column if not exists exam_appropriateness int check (exam_appropriateness between 1 and 5);
alter table public.teacher_feedback add column if not exists price_rm79 boolean default false;
alter table public.teacher_feedback add column if not exists price_rm149 boolean default false;
alter table public.teacher_feedback add column if not exists price_rm249 boolean default false;
alter table public.teacher_feedback add column if not exists beta_access boolean default false;
alter table public.teacher_feedback add column if not exists missing_feature text default '';

create table if not exists public.student_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  student_code text not null,
  score numeric not null check (score >= 0),
  max_score numeric not null check (max_score > 0),
  misconception_ids jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.subscription_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  customer_email text,
  stripe_customer_id text,
  stripe_subscription_id text not null unique,
  tier text not null,
  status text not null,
  current_period_end timestamptz,
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.question_history enable row level security;
alter table public.saved_questions enable row level security;
alter table public.teacher_feedback enable row level security;
alter table public.student_results enable row level security;
alter table public.subscription_entitlements enable row level security;

do $$
declare t text;
begin
  foreach t in array array['profiles','question_history','saved_questions','teacher_feedback','student_results'] loop
    execute format('drop policy if exists "own rows select" on public.%I', t);
    execute format('drop policy if exists "own rows insert" on public.%I', t);
    execute format('drop policy if exists "own rows update" on public.%I', t);
    execute format('drop policy if exists "own rows delete" on public.%I', t);
    execute format('create policy "own rows select" on public.%I for select to authenticated using ((select auth.uid()) = user_id)', t);
    execute format('create policy "own rows insert" on public.%I for insert to authenticated with check ((select auth.uid()) = user_id)', t);
    execute format('create policy "own rows update" on public.%I for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)', t);
    execute format('create policy "own rows delete" on public.%I for delete to authenticated using ((select auth.uid()) = user_id)', t);
  end loop;
end $$;

drop policy if exists "own subscriptions select" on public.subscription_entitlements;
create policy "own subscriptions select"
  on public.subscription_entitlements
  for select
  to authenticated
  using ((select auth.uid()) = user_id);
