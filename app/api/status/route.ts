export async function GET() {
  const provider = (process.env.AI_PROVIDER || (process.env.GEMINI_API_KEY ? 'gemini' : 'anthropic')).toLowerCase();
  const aiConfigured = provider === 'gemini'
    ? Boolean(process.env.GEMINI_API_KEY)
    : provider === 'openai'
    ? Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_MODEL)
    : Boolean(process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_MODEL);
  return Response.json({
    ai: {
      configured: aiConfigured,
      provider,
      model: provider === 'gemini'
        ? (process.env.GEMINI_MODEL || 'gemini-1.5-flash')
        : provider === 'openai'
        ? (process.env.OPENAI_MODEL || '')
        : (process.env.ANTHROPIC_MODEL || '')
    },
    supabase: { configured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) },
    stripe: {
      configured: Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_STARTER && process.env.STRIPE_PRICE_PRO && process.env.STRIPE_PRICE_INSTITUTIONAL),
      webhookConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET && process.env.SUPABASE_SERVICE_ROLE_KEY)
    },
    lms: {
      googleClassroomConfigured: Boolean(process.env.GOOGLE_CLASSROOM_ACCESS_TOKEN),
      canvasConfigured: Boolean(process.env.CANVAS_BASE_URL && process.env.CANVAS_ACCESS_TOKEN)
    },
    ocr: { mathpixConfigured: Boolean(process.env.MATHPIX_APP_ID && process.env.MATHPIX_APP_KEY) }
  });
}
