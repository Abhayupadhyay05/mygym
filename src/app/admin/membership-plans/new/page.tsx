import type { Metadata } from 'next'
import Link from 'next/link'
import { MembershipPlanForm } from '../plan-form'

export const metadata: Metadata = { title: 'Add Membership Plan' }

export default function NewMembershipPlanPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/admin/membership-plans" className="text-sm text-muted-foreground hover:text-foreground">← Back to plans</Link>
        <h1 className="mt-3 text-3xl font-bold">Add membership plan</h1>
      </div>
      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
        <MembershipPlanForm />
      </section>
    </div>
  )
}
