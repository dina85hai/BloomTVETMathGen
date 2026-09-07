const PRICE_ENV: Record<string,string> = {
  starter: 'STRIPE_PRICE_STARTER',
  pro: 'STRIPE_PRICE_PRO',
  institutional: 'STRIPE_PRICE_INSTITUTIONAL'
};

export async function POST(request: Request) {
  try {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) return Response.json({ error:'Stripe is not configured.' }, { status:503 });
    const { tier, email, userId } = await request.json();
    const envName = PRICE_ENV[String(tier)];
    if (!envName) return Response.json({ error:'Unknown pricing tier.' }, { status:400 });
    const price = process.env[envName];
    if (!price) return Response.json({ error:`Missing ${envName}.` }, { status:503 });
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const body = new URLSearchParams();
    body.set('mode','subscription');
    body.set('line_items[0][price]',price);
    body.set('line_items[0][quantity]','1');
    body.set('success_url',`${origin}/?checkout=success`);
    body.set('cancel_url',`${origin}/?checkout=cancelled`);
    body.set('metadata[tier]',String(tier));
    if (email) body.set('customer_email',String(email));
    if (userId) {
      body.set('client_reference_id',String(userId));
      body.set('metadata[user_id]',String(userId));
    }
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method:'POST',
      headers:{ Authorization:`Bearer ${secret}`, 'content-type':'application/x-www-form-urlencoded' },
      body
    });
    const data = await response.json();
    if (!response.ok) return Response.json({ error:data?.error?.message || 'Stripe checkout failed.' }, { status:response.status });
    return Response.json({ url:data.url });
  } catch (error:any) {
    return Response.json({ error:error?.message || 'Stripe checkout failed.' }, { status:500 });
  }
}
