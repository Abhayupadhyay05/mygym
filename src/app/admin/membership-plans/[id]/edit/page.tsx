import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MembershipPlanForm } from '../../plan-form'
import { requireRole } from '@/lib/auth/authorization'
import { membershipPlanSchema } from '@/lib/validations/membership'

export const metadata: Metadata = { title: 'Edit Membership Plan' }

export default async function EditMembershipPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    notFound()
  }

  const { supabase } = await requireRole(['OWNER', 'RECEPTIONIST'])
  const { data, error } = await supabase
    .from('membership_plans')
    .select('id, name, description, duration_days, duration_months, price, is_active')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw new Error('Unable to load this membership plan.')
  }
  if (!data) {
    notFound()
  }
  const parsedPlan = membershipPlanSchema.safeParse(data)
  if (!parsedPlan.success) {
    throw new Error('This membership plan returned an unexpected response.')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/admin/membership-plans" className="text-sm text-muted-foreground hover:text-foreground">← Back to plans</Link>
        <h1 className="mt-3 text-3xl font-bold">Edit membership plan</h1>
      </div>
      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
        <MembershipPlanForm plan={parsedPlan.data} />
      </section>
    </div>
  )
}
