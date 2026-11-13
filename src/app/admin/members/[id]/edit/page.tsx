import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MemberForm } from '../../member-form'
import { AccountLinkForm } from '../../account-link-form'
import { requireRole } from '@/lib/auth/authorization'
import { memberDetailsSchema } from '@/lib/validations/member'

export const metadata: Metadata = { title: 'Member Details' }
export const instant = false

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    notFound()
  }

  const { supabase, role } = await requireRole(['OWNER', 'RECEPTIONIST'])
  const { data, error } = await supabase
    .from('members')
    .select('id, profile_id, member_number, full_name, email, phone, status, date_of_birth, emergency_contact_name, emergency_contact_phone, address, notes')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw new Error('Unable to load this member record.')
  }
  if (!data) {
    notFound()
  }
  const parsedMember = memberDetailsSchema.safeParse(data)
  if (!parsedMember.success) {
    throw new Error('This member record returned an unexpected response.')
  }

  let linkableProfiles: { id: string; full_name: string; phone: string | null }[] = []
  if (role === 'OWNER' && !parsedMember.data.profile_id) {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, phone')
      .eq('role', 'MEMBER')
      .eq('is_active', true)
      .order('full_name')
      .range(0, 199)
    if (profilesError) {
      throw new Error('Unable to load eligible member accounts.')
    }
    linkableProfiles = profiles
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/admin/members" className="text-sm text-muted-foreground hover:text-foreground">← Back to members</Link>
        <h1 className="mt-3 text-3xl font-bold">Member details</h1>
        <p className="mt-2 text-muted-foreground">Update contact information or deactivate the member record.</p>
      </div>
      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
        <MemberForm member={parsedMember.data} />
      </section>
      {role === 'OWNER' && (
        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-7" aria-labelledby="account-link-heading">
          <h2 id="account-link-heading" className="text-lg font-semibold">Member account</h2>
          {parsedMember.data.profile_id ? (
            <p className="mt-2 text-sm text-muted-foreground">
              This member is linked to an Auth profile (ID …{parsedMember.data.profile_id.slice(-6)}). Account links cannot be changed here.
            </p>
          ) : linkableProfiles.length > 0 ? (
            <div className="mt-4">
              <AccountLinkForm memberId={parsedMember.data.id} profiles={linkableProfiles} />
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              No active accounts with the MEMBER role are available to link. Create the account and set its role through the trusted Supabase operator workflow first.
            </p>
          )}
        </section>
      )}
    </div>
  )
}
