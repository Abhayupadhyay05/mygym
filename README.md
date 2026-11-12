# Premium Fitness Gym Management System

Next.js App Router application for the public gym website and authenticated admin, trainer, and member portals.

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` if the local env file does not exist.
3. Add a Supabase project URL and public anon/publishable key to `.env.local`.
4. Run `npm run dev`.

`.env.local` is ignored by Git. Never commit service-role, payment, email, or WhatsApp credentials. The Supabase service-role client is server-only and is used only for protected Razorpay order registration and verified payment settlement/webhook processing; it is never used in browser code.

## Supabase setup

The initial schema and RLS migration is `supabase/migrations/202611120001_initial_schema.sql`. Review it and apply it to a non-production project before testing the portals. The migration has not yet been applied to a database.

Configure Supabase Auth redirect URLs to include `http://localhost:3000/auth/callback`. Enable email/password. Google OAuth requires provider credentials in Supabase Auth; phone OTP requires a configured SMS provider. These provider credentials are not stored in browser code.

New Auth users receive a `profiles` row with the `MEMBER` role. After creating the first owner account, a trusted operator must promote its verified profile to `OWNER` from the Supabase SQL editor using the confirmed Auth user UUID. Do not expose a self-service owner-registration flow.

An owner can link an existing active `MEMBER` Auth account to an unlinked gym member record from the member details screen. The member portal reads the linked member's own profile and payment history; paid records have a printable receipt. Database RLS and server-side role checks must be verified against staging before these flows are used with real members.

## Razorpay payments

The member portal can create Razorpay orders server-side, verify checkout signatures and captured payment details, and activate memberships through an atomic database function. The `/api/webhooks/razorpay` endpoint verifies webhook signatures and deduplicates captured-payment events.

Set `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`. Configure the Razorpay webhook URL as `https://<your-app-host>/api/webhooks/razorpay` and subscribe to `payment.captured`. Do not enable online payments until the migration is applied and the webhook is configured in a test/staging project. When these variables are missing, the member portal shows that online payment is unavailable; manual staff payments remain available.

Resend and WhatsApp credentials are present in the environment template, but those delivery integrations are not implemented. Email/password, Google, and phone authentication depend on Supabase Auth provider configuration; they have not been live-tested because no Supabase project credentials are configured.

## Validation

- `npm run lint`
- `npm test`
- `npx tsc --noEmit`
- `npm run build`

Live authentication, RLS policies, database functions, Razorpay orders, and webhooks require a configured Supabase project and must be tested in staging before production use. No migration has been applied and no production deployment has been performed.
