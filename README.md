# Premium Fitness Gym Management System

Next.js App Router application for the public gym website and authenticated admin, trainer, and member portals.

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` if the local env file does not exist.
3. Add a Supabase project URL and public anon/publishable key to `.env.local`.
4. Run `npm run dev`.

`.env.local` is ignored by Git. Never commit service-role, payment, email, or WhatsApp credentials. The Supabase service-role client is server-only and is used only for protected Razorpay order registration and verified payment settlement/webhook processing; it is never used in browser code.

## Supabase setup

1. Create a Supabase project and put its project URL and anon/publishable key in `.env.local` as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. In the Supabase dashboard, open **SQL Editor**, paste the complete contents of `supabase/migrations/202611120001_initial_schema.sql`, and run it once against the new, non-production project. This migration has not yet been applied or tested against a database.
3. In **Authentication → URL Configuration**, add `http://localhost:3000/auth/callback` as a redirect URL. Enable email/password. Google OAuth and phone OTP need their provider credentials/settings in Supabase Auth.
4. Run `npm run dev`, open `http://localhost:3000/register`, and create the owner account.
5. In SQL Editor, replace the UUID below with the ID of that exact Auth user and run the statement. Confirm that one row returns with the expected name and `OWNER` role:

   ```sql
   update public.profiles
   set role = 'OWNER'
   where id = 'AUTH_USER_UUID'::uuid
     and role = 'MEMBER'
   returning id, full_name, role;
   ```

6. Sign in at `/login`. The owner can link an existing active `MEMBER` Auth account to an unlinked active gym-member record from the member details screen. An owner-only database function enforces the link; ordinary staff cannot change `members.profile_id`.

New Auth users receive a `profiles` row with the `MEMBER` role. Do not create a self-service owner-registration flow. The member portal reads only the linked member's profile and payment history; paid records have a printable receipt. Verify RLS and role boundaries against staging before using real member data.

## Gym content

Public gym name, tagline, description, address, phone, email, hours, WhatsApp number, and social links are grouped in `src/lib/constants.ts`. These values are samples and need owner approval before launch. Trainer cards, testimonials, facilities, photos, and public plan details also contain sample content; replace or approve them rather than treating them as real claims. Admin membership plans are managed from the Plans screen.

## Razorpay payments

The member portal can create Razorpay orders server-side, verify checkout signatures and captured payment details, and activate memberships through an atomic database function. The `/api/webhooks/razorpay` endpoint verifies webhook signatures and deduplicates captured-payment events.

Set `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`. Configure the Razorpay webhook URL as `https://<your-app-host>/api/webhooks/razorpay` and subscribe to `payment.captured`. Do not enable online payments until the migration is applied and the webhook is configured in a test/staging project. When these variables are missing, the member portal shows that online payment is unavailable; manual staff payments remain available.

Resend and WhatsApp credentials are present in the environment template, but those delivery integrations are not implemented. Email/password, Google, and phone authentication depend on Supabase Auth provider configuration; authentication and database behavior have not yet been live-tested against a Supabase project.

## Validation

- `npm run lint`
- `npm test`
- `npx tsc --noEmit`
- `npm run build`

Live authentication, RLS policies, database functions, Razorpay orders, and webhooks require a configured Supabase project and must be tested in staging before production use. No migration has been applied and no production deployment has been performed.
