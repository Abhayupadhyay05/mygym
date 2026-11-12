import type { Metadata } from 'next'
import Link from 'next/link'
import { requireRole } from '@/lib/auth/authorization'
import { paymentListItemSchema, pendingMembershipPaymentSchema } from '@/lib/validations/payment'
import { ManualPaymentForm } from './manual-payment-form'

export const metadata: Metadata = { title: 'Payments' }
export const instant = false

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })
const dateFormatter = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'UTC' })

function formatDate(value: string) {
  return dateFormatter.format(new Date(value))
}

export default async function PaymentsPage() {
  const { supabase } = await requireRole(['OWNER', 'RECEPTIONIST'])
  const [pendingResult, paymentsResult] = await Promise.all([
    supabase
      .from('memberships')
      .select('id, amount, starts_on, ends_on, created_at, member:members!inner(member_number, full_name), plan:membership_plans!inner(name)')
      .eq('status', 'PENDING')
      .order('created_at', { ascending: true })
      .range(0, 49),
    supabase
      .from('payments')
      .select('id, amount, currency, method, status, paid_at, created_at, member:members!inner(member_number, full_name), membership:memberships(id, plan:membership_plans(name))')
      .order('created_at', { ascending: false })
      .range(0, 49),
  ])

  if (pendingResult.error || paymentsResult.error) {
    throw new Error('Unable to load payment information.')
  }
  const pendingMemberships = pendingMembershipPaymentSchema.array().safeParse(pendingResult.data)
  const payments = paymentListItemSchema.array().safeParse(paymentsResult.data)
  if (!pendingMemberships.success || !payments.success) {
    throw new Error('Payment information returned an unexpected response.')
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#00FF87]">Payment management</p>
        <h1 className="mt-2 text-3xl font-bold">Payments</h1>
        <p className="mt-2 text-muted-foreground">Record in-person payments or review the recent payment ledger.</p>
      </div>

      <section className="space-y-4" aria-labelledby="pending-payments">
        <div>
          <h2 id="pending-payments" className="text-xl font-semibold">Pending membership payments</h2>
          <p className="mt-1 text-sm text-muted-foreground">Recording a manual payment activates the membership atomically.</p>
        </div>
        {pendingMemberships.data.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-sm text-muted-foreground">
            No membership payments are waiting to be recorded.
          </div>
        ) : (
          <ul className="space-y-3">
            {pendingMemberships.data.map((membership) => (
              <li key={membership.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{membership.member.full_name} <span className="text-xs text-muted-foreground">({membership.member.member_number})</span></p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {membership.plan.name} · {formatDate(membership.starts_on)} – {formatDate(membership.ends_on)}
                    </p>
                  </div>
                  <p className="text-lg font-semibold">{currency.format(membership.amount)}</p>
                </div>
                <ManualPaymentForm membershipId={membership.id} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4" aria-labelledby="recent-payments">
        <div>
          <h2 id="recent-payments" className="text-xl font-semibold">Recent payments</h2>
          <p className="mt-1 text-sm text-muted-foreground">Showing the 50 most recently recorded transactions.</p>
        </div>
        {payments.data.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-sm text-muted-foreground">
            No payments have been recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-white/[0.03] text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Date</th>
                  <th scope="col" className="px-4 py-3 font-medium">Member</th>
                  <th scope="col" className="px-4 py-3 font-medium">Plan</th>
                  <th scope="col" className="px-4 py-3 font-medium">Method</th>
                  <th scope="col" className="px-4 py-3 font-medium">Amount</th>
                  <th scope="col" className="px-4 py-3 font-medium">Status</th>
                  <th scope="col" className="px-4 py-3 font-medium">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {payments.data.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-4 py-3">{formatDate(payment.paid_at ?? payment.created_at)}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{payment.member.full_name}</p>
                      <p className="text-xs text-muted-foreground">{payment.member.member_number}</p>
                    </td>
                    <td className="px-4 py-3">{payment.membership?.plan?.name ?? '—'}</td>
                    <td className="px-4 py-3">{payment.method.replaceAll('_', ' ')}</td>
                    <td className="px-4 py-3">{currency.format(payment.amount)}</td>
                    <td className="px-4 py-3">{payment.status}</td>
                    <td className="px-4 py-3">
                      <Link className="underline underline-offset-4" href={`/admin/payments/${payment.id}/receipt`}>View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
