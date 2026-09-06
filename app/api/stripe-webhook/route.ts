import { createHmac, timingSafeEqual } from 'node:crypto';

export const runtime = 'nodejs';

type StripeEvent = {
  id: string;
  type: string;
  data: { object: Record<string, any> };
};

function parseStripeSignature(header: string | null) {
  const parts = Object.fromEntries((header || '').split(',').map((part) => {
    const [key, value] = part.split('=');
    return [key, value];
  }));
  return { timestamp: parts.t, signature: parts.v1 };
}

function verifySignature(payload: string, header: string | null, secret: string) {
  const { timestamp, signature } = parseStripeSignature(header);
  if (!timestamp || !signature) return false;
  const expected = createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex');
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(signature);
  return expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer);
}

async function upsertEntitlement(event: StripeEvent) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return;

  const object = event.data.object;
  const subscriptionId = String(object.subscription || object.id || '');
  if (!subscriptionId) return;

  const row = {
    user_id: object.client_reference_id || object.metadata?.user_id || null,
    customer_email: object.customer_details?.email || object.customer_email || object.metadata?.email || null,
    stripe_customer_id: String(object.customer || ''),
    stripe_subscription_id: subscriptionId,
    tier: object.metadata?.tier || 'unknown',
    status: object.status || 'unknown',
    current_period_end: object.current_period_end ? new Date(Number(object.current_period_end) * 1000).toISOString() : null,
    updated_at: new Date().toISOString()
  };

  await fetch(`${supabaseUrl}/rest/v1/subscription_entitlements?on_conflict=stripe_subscription_id`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'content-type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal'
    },
    body: JSON.stringify(row)
  });
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return Response.json({ error: 'Stripe webhook is not configured.' }, { status: 503 });

  const payload = await request.text();
  if (!verifySignature(payload, request.headers.get('stripe-signature'), secret)) {
    return Response.json({ error: 'Invalid Stripe signature.' }, { status: 400 });
  }

  const event = JSON.parse(payload) as StripeEvent;
  if (['checkout.session.completed', 'customer.subscription.updated', 'customer.subscription.deleted'].includes(event.type)) {
    await upsertEntitlement(event);
  }

  return Response.json({ received: true });
}
