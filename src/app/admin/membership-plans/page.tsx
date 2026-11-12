import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { requireRole } from '@/lib/auth/authorization'
import { membershipPlanSchema } from '@/lib/validations/membership'

export const metadata: Metadata = { title: 'Membership Plans' }

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })

function durationLabel(plan: { duration_days: number | null; duration_months: number | null }) {
  if (plan.duration_months) {
    return `${plan.duration_months} ${plan.duration_months === 1 ? 'month' : 'months'}`
  }
  return `${plan.duration_days} ${plan.duration_days === 1 ? 'day' : 'days'}`
}

export default async function MembershipPlansPage() {
  const { supabase } = await requireRole(['OWNER', 'RECEPTIONIST'])
  const { data, error } = await supabase
    .from('membership_plans')
    .select('id, name, description, duration_days, duration_months, price, is_active')
    .order('name')
    .range(0, 99)

  if (error) {
    throw new Error('Unable to load membership plans.')
  }
  const parsedPlans = membershipPlanSchema.array().safeParse(data)
  if (!parsedPlans.success) {
    throw new Error('Membership plans returned an unexpected response.')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#00FF87]">Membership management</p>
          <h1 className="mt-2 text-3xl font-bold">Membership plans</h1>
          <p className="mt-2 text-muted-foreground">Manage prices and calendar-based plan durations.</p>
        </div>
        <Button render={<Link href="/admin/membership-plans/new" />}>
          <Plus aria-hidden="true" />
          Add plan
        </Button>
      </div>
      {parsedPlans.data.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <h2 className="font-semibold">No membership plans yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">Create a plan before assigning memberships.</p>
        </div>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Membership plans">
          {parsedPlans.data.map((plan) => (
            <article key={plan.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-semibold">{plan.name}</h2>
                <span className={plan.is_active ? 'text-xs text-[#00FF87]' : 'text-xs text-muted-foreground'}>
                  {plan.is_active ? 'Available' : 'Archived'}
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold">{currency.format(plan.price)}</p>
              <p className="mt-1 text-sm text-muted-foreground">{durationLabel(plan)}</p>
              {plan.description && <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{plan.description}</p>}
              <Button className="mt-5" variant="outline" size="sm" render={<Link href={`/admin/membership-plans/${plan.id}/edit`} />}>
                Edit plan
              </Button>
            </article>
          ))}
        </section>
      )}
    </div>
  )
}
