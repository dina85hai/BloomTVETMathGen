export async function POST(request: Request) {
  try {
    const appId = process.env.MATHPIX_APP_ID;
    const appKey = process.env.MATHPIX_APP_KEY;
    if (!appId || !appKey) {
      return Response.json({
        error: 'Equation OCR is not configured. Add MATHPIX_APP_ID and MATHPIX_APP_KEY to .env.local, then restart npm run dev.'
      }, { status: 503 });
    }

    const body = await request.json();
    const src = String(body.src || '');
    if (!src.startsWith('data:image/')) {
      return Response.json({ error: 'Upload an image file as a data URL.' }, { status: 400 });
    }
    if (src.length > 2_700_000) {
      return Response.json({ error: 'Image is too large for OCR. Crop the equation or compress the image first.' }, { status: 413 });
    }

    const response = await fetch('https://api.mathpix.com/v3/text', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        app_id: appId,
        app_key: appKey
      },
      body: JSON.stringify({
        src,
        ocr: ['math', 'text'],
        formats: ['text', 'latex_styled', 'mathml'],
        format_options: {
          math_inline_delimiters: ['\\(', '\\)'],
          math_display_delimiters: ['\\[', '\\]']
        },
        rm_spaces: true,
        enable_tables_fallback: true
      }),
      cache: 'no-store'
    });

    const data = await response.json();
    if (!response.ok) {
      return Response.json({ error: data?.error || data?.message || `Mathpix API error (${response.status})` }, { status: response.status });
    }

    return Response.json({
      text: data.text || '',
      latex: data.latex_styled || data.latex || '',
      mathml: data.mathml || '',
      confidence: data.confidence || data.latex_confidence || null,
      raw: data
    });
  } catch (error: any) {
    return Response.json({ error: error?.message || 'Equation OCR failed.' }, { status: 500 });
  }
}
