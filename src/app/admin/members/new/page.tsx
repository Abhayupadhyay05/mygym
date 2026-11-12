import type { Metadata } from 'next'
import Link from 'next/link'
import { MemberForm } from '../member-form'

export const metadata: Metadata = { title: 'Add Member' }

export default function NewMemberPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/admin/members" className="text-sm text-muted-foreground hover:text-foreground">← Back to members</Link>
        <h1 className="mt-3 text-3xl font-bold">Add member</h1>
        <p className="mt-2 text-muted-foreground">Enter the member details. A portal account can be linked later.</p>
      </div>
      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
        <MemberForm />
      </section>
    </div>
  )
}
