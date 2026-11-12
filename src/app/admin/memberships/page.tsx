import type { Metadata } from 'next'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { requireRole } from '@/lib/auth/authorization'
import { membershipListItemSchema, membershipPlanSchema } from '@/lib/validations/membership'
import { AssignMembershipForm } from './assign-membership-form'

export const metadata: Metadata = { title: 'Memberships' }
export const instant = false

export type MembershipPlan = {
  id: string
  name: string
  price: number
  durationLabel: string
}

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })
const dateFormatter = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'UTC' })

function formatDuration(plan: { duration_days: number | null; duration_months: number | null }) {
  if (plan.duration_months) {
    return `${plan.duration_months} ${plan.duration_months === 1 ? 'month' : 'months'}`
  }
  return `${plan.duration_days} ${plan.duration_days === 1 ? 'day' : 'days'}`
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00Z`))
}

function statusStyle(status: string) {
  if (status === 'ACTIVE') return 'text-[#00FF87]'
  if (status === 'PENDING') return 'text-amber-300'
  return 'text-muted-foreground'
}

export default async function MembershipsPage() {
  const { supabase } = await requireRole(['OWNER', 'RECEPTIONIST'])
  const [plansResult, membershipsResult] = await Promise.all([
    supabase
      .from('membership_plans')
      .select('id, name, description, duration_days, duration_months, price, is_active')
      .eq('is_active', true)
      .order('name')
      .range(0, 99),
    supabase
      .from('memberships')
      .select('id, status, starts_on, ends_on, amount, created_at, member:members!inner(member_number, full_name), plan:membership_plans!inner(name)')
      .order('created_at', { ascending: false })
      .range(0, 49),
  ])

  if (plansResult.error || membershipsResult.error) {
    throw new Error('Unable to load membership information.')
  }

  const parsedPlans = membershipPlanSchema.array().safeParse(plansResult.data)
  const parsedMemberships = membershipListItemSchema.array().safeParse(membershipsResult.data)
  if (!parsedPlans.success || !parsedMemberships.success) {
    throw new Error('Membership information returned an unexpected response.')
  }

  const availablePlans: MembershipPlan[] = parsedPlans.data.map((plan) => ({
    id: plan.id,
    name: plan.name,
    price: plan.price,
    durationLabel: formatDuration(plan),
  }))

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#00FF87]">Membership management</p>
          <h1 className="mt-2 text-3xl font-bold">Memberships</h1>
          <p className="mt-2 text-muted-foreground">Assign plans and review recent membership periods.</p>
        </div>
        <Link className={buttonVariants({ variant: 'outline' })} href="/admin/membership-plans">Manage plans</Link>
      </div>

      <section className="max-w-2xl rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-7" aria-labelledby="assign-membership">
        <h2 id="assign-membership" className="text-lg font-semibold">Assign a membership</h2>
        <p className="mt-1 mb-5 text-sm text-muted-foreground">Choose an active member and plan to create a pending membership.</p>
        {availablePlans.length === 0 && (
          <p className="mb-4 text-sm text-amber-300">
            No active plans are available. <Link className="underline" href="/admin/membership-plans/new">Create a plan</Link> first.
          </p>
        )}
        <AssignMembershipForm plans={availablePlans} />
      </section>

      <section className="space-y-4" aria-labelledby="recent-memberships">
        <div>
          <h2 id="recent-memberships" className="text-xl font-semibold">Recent memberships</h2>
          <p className="mt-1 text-sm text-muted-foreground">Showing the 50 most recently assigned memberships.</p>
        </div>
        {parsedMemberships.data.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-muted-foreground">
            No memberships have been assigned yet.
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto rounded-xl border border-white/10 md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/[0.03] text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium">Member</th>
                    <th scope="col" className="px-4 py-3 font-medium">Plan</th>
                    <th scope="col" className="px-4 py-3 font-medium">Period</th>
                    <th scope="col" className="px-4 py-3 font-medium">Amount</th>
                    <th scope="col" className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {parsedMemberships.data.map((membership) => (
                    <tr key={membership.id}>
                      <td className="px-4 py-3">
                        <p className="font-medium">{membership.member.full_name}</p>
                        <p className="text-xs text-muted-foreground">{membership.member.member_number}</p>
                      </td>
                      <td className="px-4 py-3">{membership.plan.name}</td>
                      <td className="px-4 py-3">{formatDate(membership.starts_on)} – {formatDate(membership.ends_on)}</td>
                      <td className="px-4 py-3">{currency.format(membership.amount)}</td>
                      <td className={`px-4 py-3 text-xs font-medium ${statusStyle(membership.status)}`}>{membership.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="grid gap-3 md:hidden">
              {parsedMemberships.data.map((membership) => (
                <li key={membership.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">{membership.member.full_name}</p>
                      <p className="text-xs text-muted-foreground">{membership.member.member_number}</p>
                    </div>
                    <span className={`text-xs font-medium ${statusStyle(membership.status)}`}>{membership.status}</span>
                  </div>
                  <p className="mt-3 text-sm">{membership.plan.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDate(membership.starts_on)} – {formatDate(membership.ends_on)}</p>
                  <p className="mt-2 text-sm font-medium">{currency.format(membership.amount)}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  )
}
