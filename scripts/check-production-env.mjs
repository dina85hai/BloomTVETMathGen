const groups = [
  {
    name: 'Live AI',
    requiredAny: [
      ['GEMINI_API_KEY'],
      ['ANTHROPIC_API_KEY', 'ANTHROPIC_MODEL'],
      ['OPENAI_API_KEY', 'OPENAI_MODEL']
    ]
  },
  {
    name: 'Supabase Auth/Storage',
    required: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']
  },
  {
    name: 'Stripe Checkout',
    required: ['STRIPE_SECRET_KEY', 'STRIPE_PRICE_STARTER', 'STRIPE_PRICE_PRO', 'STRIPE_PRICE_INSTITUTIONAL']
  },
  {
    name: 'Stripe Webhook Entitlements',
    required: ['STRIPE_WEBHOOK_SECRET', 'SUPABASE_SERVICE_ROLE_KEY']
  },
  {
    name: 'Google Classroom API',
    required: ['GOOGLE_CLASSROOM_ACCESS_TOKEN']
  },
  {
    name: 'Canvas API',
    required: ['CANVAS_BASE_URL', 'CANVAS_ACCESS_TOKEN']
  }
];

function present(key) {
  return Boolean(process.env[key] && process.env[key].trim());
}

let missingGroups = 0;
for (const group of groups) {
  const missing = group.required?.filter((key) => !present(key)) || [];
  const anySatisfied = group.requiredAny?.some((set) => set.every(present));
  const ok = group.requiredAny ? anySatisfied : missing.length === 0;
  if (!ok) missingGroups += 1;
  console.log(`${ok ? 'OK' : 'MISSING'} ${group.name}`);
  if (group.requiredAny && !ok) {
    console.log(`  Provide one complete set: ${group.requiredAny.map((set) => set.join(' + ')).join(' OR ')}`);
  }
  if (missing.length) console.log(`  Missing: ${missing.join(', ')}`);
}

if (missingGroups) {
  console.log(`\n${missingGroups} production integration group(s) still need real account credentials.`);
  process.exitCode = 1;
} else {
  console.log('\nAll production integration environment groups are configured.');
}
