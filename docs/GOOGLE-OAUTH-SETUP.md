# Google OAuth Setup

1. Create/configure the Supabase project and run `supabase/schema.sql`.
2. In Supabase Authentication > Providers, enable Google.
3. Configure the Google OAuth client ID/secret in Supabase.
4. Add the application URL as an allowed redirect URL in Supabase Auth URL configuration.
5. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
6. Restart the Next.js server.
7. Open Profile and choose **Continue with Google**.

Email/password remains available as a fallback authentication method.
