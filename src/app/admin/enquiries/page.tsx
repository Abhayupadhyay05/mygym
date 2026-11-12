import type { Metadata } from 'next'
import { requireRole } from '@/lib/auth/authorization'
import { enquirySchema } from '@/lib/validations/enquiry'
import { EnquiryForm } from './enquiry-form'
import { EnquiryUpdateForm } from './enquiry-update-form'

export const metadata: Metadata = { title: 'Enquiries' }
export const instant = false

const dateTimeFormatter = new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Kolkata',
})

function statusStyle(status: string) {
  if (status === 'NEW') return 'text-[#00FF87]'
  if (status === 'FOLLOW_UP') return 'text-amber-300'
  return 'text-muted-foreground'
}

export default async function EnquiriesPage() {
  const { supabase, user } = await requireRole(['OWNER', 'RECEPTIONIST'])
  const { data, error } = await supabase
    .from('enquiries')
    .select('id, full_name, email, phone, message, status, follow_up_at, converted_member_id, assigned_to, created_at, converted_member:members(member_number, full_name)')
    .order('created_at', { ascending: false })
    .range(0, 49)

  if (error) {
    throw new Error('Unable to load enquiries.')
  }
  const enquiries = enquirySchema.array().safeParse(data)
  if (!enquiries.success) {
    throw new Error('Enquiries returned an unexpected response.')
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#00FF87]">Gym operations</p>
        <h1 className="mt-2 text-3xl font-bold">Enquiries</h1>
        <p className="mt-2 text-muted-foreground">Track walk-ins, calls, and prospective members. Showing the 50 newest records.</p>
      </div>

      <section className="max-w-3xl rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-7" aria-labelledby="add-enquiry">
        <h2 id="add-enquiry" className="mb-5 text-lg font-semibold">Add an enquiry</h2>
        <EnquiryForm />
      </section>

      <section className="space-y-4" aria-labelledby="enquiry-list">
        <h2 id="enquiry-list" className="text-xl font-semibold">Recent enquiries</h2>
        {enquiries.data.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-muted-foreground">
            No enquiries have been recorded yet.
          </div>
        ) : (
          <ul className="space-y-4">
            {enquiries.data.map((enquiry) => (
              <li key={enquiry.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{enquiry.full_name}</h3>
                      <span className={`text-xs font-medium ${statusStyle(enquiry.status)}`}>{enquiry.status.replaceAll('_', ' ')}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      <a className="underline underline-offset-2" href={`tel:${enquiry.phone}`}>{enquiry.phone}</a>
                      {enquiry.email && <> · <a className="underline underline-offset-2" href={`mailto:${enquiry.email}`}>{enquiry.email}</a></>}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">Received {dateTimeFormatter.format(new Date(enquiry.created_at))}</p>
                    {enquiry.follow_up_at && (
                      <p className="mt-1 text-xs text-muted-foreground">Follow-up {dateTimeFormatter.format(new Date(enquiry.follow_up_at))}</p>
                    )}
                    {enquiry.assigned_to && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {enquiry.assigned_to === user.id ? 'Assigned to you' : 'Assigned to another staff member'}
                      </p>
                    )}
                    {enquiry.converted_member && (
                      <p className="mt-1 text-xs text-[#00FF87]">
                        Linked to {enquiry.converted_member.full_name} ({enquiry.converted_member.member_number})
                      </p>
                    )}
                  </div>
                </div>
                {enquiry.message && <p className="my-4 whitespace-pre-wrap text-sm text-muted-foreground">{enquiry.message}</p>}
                <div className="mt-4 border-t border-white/10 pt-4">
                  <EnquiryUpdateForm
                    enquiry={{
                      id: enquiry.id,
                      status: enquiry.status,
                      follow_up_at: enquiry.follow_up_at,
                      assigned_to: enquiry.assigned_to,
                    }}
                    currentUserId={user.id}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
