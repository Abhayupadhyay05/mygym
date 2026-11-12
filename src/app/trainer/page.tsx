import { requireRole } from '@/lib/auth/authorization'
import { trainerMemberSummarySchema } from '@/lib/validations/member-dashboard'

export default async function TrainerDashboardPage() {
  const { supabase } = await requireRole(['TRAINER'])
  const { data, error } = await supabase.rpc('get_assigned_member_summaries')
  if (error) {
    throw new Error('Unable to load assigned members. Confirm the database migration has been applied.')
  }

  const result = trainerMemberSummarySchema.array().safeParse(data)
  if (!result.success) {
    throw new Error('The assigned-member list returned an unexpected format.')
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#00FF87]">Trainer portal</p>
        <h1 className="mt-2 text-3xl font-bold">Assigned members</h1>
        <p className="mt-2 text-muted-foreground">Only members currently assigned to your trainer account are shown.</p>
      </div>
      <section aria-label="Assigned members" className="overflow-hidden rounded-xl border border-white/10">
        {result.data.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No active member assignments are available.</p>
        ) : (
          <ul className="divide-y divide-white/10">
            {result.data.map((member) => (
              <li key={member.member_id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <span className="font-medium">{member.full_name}</span>
                <span className="text-sm text-muted-foreground">Member #{member.member_number}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
