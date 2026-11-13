# Premium Fitness Gym Management System

A Next.js App Router application for the gym's public website and authenticated admin, trainer, and member portals. The application uses Supabase Auth and PostgreSQL, with Razorpay checkout support for online membership payments.

## Project status

- The owner reports that the initial Supabase migration was applied and all 12 tables exist. This repository has not independently verified the live database, RLS behavior, or provider configuration. Check the target project before applying any migration.
- Authentication, role boundaries, and payment flows are implemented locally, but require staging verification before use with real users or payments.
- Google OAuth, SMS delivery, email delivery, and WhatsApp delivery depend on external provider configuration; email and WhatsApp message delivery are not implemented.
- Public gym contact information, trainer profiles, testimonials, facilities, photos, and plan details include sample content. Confirm these claims with the gym owner before launch.
- No production deployment is documented.

## Requirements

- Node.js compatible with Next.js 16.4.5
- npm
- A Supabase project for authentication and database-backed features

## Local development

1. Install the locked dependencies from the repository root:

   ```bash
   npm ci
   ```

2. Create `.env.local` beside `package.json`. There is currently no `.env.example` file tracked on GitHub, so add only the variable names needed for the features you configure:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   ```

   For online payments, also configure:

   ```dotenv
   NEXT_PUBLIC_RAZORPAY_KEY_ID=
   RAZORPAY_KEY_SECRET=
   RAZORPAY_WEBHOOK_SECRET=
   SUPABASE_SERVICE_ROLE_KEY=
   ```

   The Razorpay key ID is public; the other payment values, especially the Supabase service-role key, must remain server-side. Do not commit `.env.local`, post credentials in chat, or expose them in browser code.

3. Start the development server:

   ```bash
   npm run dev
   ```

   Open `http://localhost:3000`.

The public Supabase URL and anon/publishable key are required for sign-in and database-backed pages. Razorpay settings are optional; online payments remain unavailable until the server credentials, database setup, and test webhook are configured.

## Supabase and authentication

The initial schema and RLS policies are in [`supabase/migrations/202611120001_initial_schema.sql`](./supabase/migrations/202611120001_initial_schema.sql). The owner reports this migration has already been applied to the configured project. Do not reapply it blindly; confirm the target database state first. Verify RLS, functions, roles, and access boundaries against a non-production project before using real member data.

Configure `http://localhost:3000/auth/callback` in Supabase Auth URL Configuration for local OAuth and password-recovery callbacks. Enable the required email/password provider; Google OAuth and phone OTP also require their respective provider settings.

New self-service Auth accounts receive the `MEMBER` role. The first `OWNER` account must be established through a trusted operator workflow; do not add a self-service owner-registration flow. `OWNER`, `RECEPTIONIST`, `TRAINER`, and `MEMBER` authorization is checked server-side, with database RLS enforcing data access.

## Implemented areas

- Public gym pages, registration, login, and password recovery
- Admin dashboard, member records, plans, memberships, payments, attendance, trainers, enquiries, notifications, reports, and settings
- Member portal for linked member profiles and activity
- Trainer portal with assigned-member summaries
- Staff-recorded payments and Razorpay order, signature, and webhook verification

Online payments use server-created Razorpay orders and verified payment settlement. Configure the webhook endpoint as `https://<your-app-host>/api/webhooks/razorpay` and subscribe to `payment.captured` in a test/staging project first. Never store card or CVV data.

Resend and WhatsApp message delivery are not implemented. Their credentials are not required for local development.

## Checks

```bash
npx tsc --noEmit
npm run lint
npm test
npm run build
```

The repository has unit tests using Vitest. No GitHub Actions workflow is currently tracked, so these checks must be run locally unless CI is added.
