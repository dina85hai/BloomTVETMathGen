# Stripe Checkout Setup

The Pricing page supports three project tiers: RM79, RM149 and RM249.

Set these server-side variables in `.env.local` or the deployment environment:

- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_STARTER`
- `STRIPE_PRICE_PRO`
- `STRIPE_PRICE_INSTITUTIONAL`
- `NEXT_PUBLIC_APP_URL`

The app creates Stripe-hosted Checkout Sessions. No card data is processed by this application.

The app includes:

- `app/api/create-checkout-session/route.ts`
- `app/api/stripe-webhook/route.ts`
- `subscription_entitlements` in `supabase/schema.sql`

Set these environment values:

```env
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_STARTER=
STRIPE_PRICE_PRO=
STRIPE_PRICE_INSTITUTIONAL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
```

In Stripe, register the webhook endpoint:

```text
https://your-domain.example/api/stripe-webhook
```

Send these events:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

The webhook verifies Stripe's signature before writing subscription status to Supabase. Paid entitlements should only be enforced from stored webhook-confirmed subscription status, not from the checkout success redirect alone.
