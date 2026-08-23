# Supabase Setup

The app can already run in built-in question bank mode without any AI key. For Supabase features such as profile, cloud question history, saved questions, teacher feedback and student results, create a Supabase project and copy these values into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Then open `supabase/schema.sql` inside the project, copy all its SQL, paste it into the Supabase SQL Editor, and run it once.

1. Create a Supabase project.
2. Open the SQL Editor and run `supabase/schema.sql` once.
3. In `.env.local`, add the two public values above.
4. Restart `npm run dev`.
5. Open **PROFILE**, create/sign in to an account, then save a teacher profile.
6. Generated questions, saves, teacher feedback and student results will sync to Supabase. The dashboard will read the user's actual cloud records.

The SQL enables Row Level Security. Users can access only rows whose `user_id` matches `auth.uid()`.
