# Live AI Setup

The app can already run in built-in question bank mode without any AI key. In that mode you can select the mathematics topic/subtopic, C1–C4 Bloom level, difficulty, TVET field, language, and question count, then generate the subjective questions with visuals, marking schemes, misconception analysis, and research evidence.

If you want Live AI generation, create a file called `.env.local` in the main project folder.

## Google Gemini (Recommended — Free & Fast)

1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Click **"Get API key"** and create an API key.
3. Add to `.env.local`:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

## Anthropic

```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_actual_api_key
ANTHROPIC_MODEL=your_model_id
```

## OpenAI

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_actual_api_key
OPENAI_MODEL=your_model_id
```

Then stop the development server with `Ctrl + C` and restart it:

```bash
npm run dev
```

Restart the app after changing environment variables. The **Live AI** mode will show a check mark when `/api/status` confirms that the selected provider is configured.

The browser never receives the private AI API key.
