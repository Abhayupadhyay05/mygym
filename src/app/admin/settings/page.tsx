import type { Metadata } from 'next'
import { isSupabaseConfigured } from '@/lib/env'
import {
  isRazorpayConfigured,
  isResendConfigured,
  isServiceRoleConfigured,
  isWhatsAppConfigured,
} from '@/lib/env.server'
import { requireRole } from '@/lib/auth/authorization'
import { ProfileSettingsForm } from './profile-form'

export const metadata: Metadata = { title: 'Settings' }

function ConfigurationStatus({ label, configured, detail }: { label: string; configured: boolean; detail: string }) {
  return (
    <li className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 py-3 last:border-0">
      <div>
        <p className="font-medium">{label}</p>
        <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
      </div>
      <span className={configured ? 'text-sm text-[#00FF87]' : 'text-sm text-amber-300'}>
        {configured ? 'Configured' : 'Not configured'}
      </span>
    </li>
  )
}

export default async function AdminSettingsPage() {
  const { supabase, user } = await requireRole(['OWNER'])
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('full_name, phone')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    throw new Error('Unable to load account settings.')
  }

  const serviceRoleConfigured = isServiceRoleConfigured()
  const configItems = [
    {
      label: 'Supabase application',
      configured: isSupabaseConfigured(),
      detail: 'Public URL and anon key are available to the server and browser.',
    },
    {
      label: 'Razorpay online payments',
      configured: isRazorpayConfigured() && serviceRoleConfigured,
      detail: 'Requires the key ID, key secret, webhook secret, and server-only service-role key.',
    },
    {
      label: 'Resend email delivery',
      configured: isResendConfigured(),
      detail: 'Credentials may be present, but email delivery is not implemented yet.',
    },
    {
      label: 'WhatsApp Business delivery',
      configured: isWhatsAppConfigured(),
      detail: 'Credentials may be present, but WhatsApp delivery is not implemented yet.',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#00FF87]">Owner settings</p>
        <h1 className="mt-2 text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your profile and review server configuration without exposing secret values.</p>
      </div>
      <section className="max-w-2xl rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-7" aria-labelledby="profile-settings">
        <h2 id="profile-settings" className="mb-5 text-lg font-semibold">Owner profile</h2>
        <ProfileSettingsForm fullName={profile.full_name} phone={profile.phone} />
      </section>
      <section className="max-w-3xl rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-7" aria-labelledby="integration-settings">
        <h2 id="integration-settings" className="text-lg font-semibold">Configuration status</h2>
        <p className="mt-1 text-sm text-muted-foreground">Only whether required values are present is shown; secret values are never displayed.</p>
        <ul className="mt-4">
          {configItems.map((item) => <ConfigurationStatus key={item.label} {...item} />)}
        </ul>
      </section>
    </div>
  )
}
