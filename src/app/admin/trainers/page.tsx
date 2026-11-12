import type { Metadata } from 'next'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { requireRole } from '@/lib/auth/authorization'
import { trainerAssignmentSchema, trainerSchema } from '@/lib/validations/trainer'
import { AssignTrainerForm } from './assign-trainer-form'
import { EndTrainerAssignmentForm, TrainerStatusForm } from './trainer-actions'

export const metadata: Metadata = { title: 'Trainers' }
export const instant = false

export default async function TrainersPage() {
  const { supabase } = await requireRole(['OWNER', 'RECEPTIONIST'])
  const [trainersResult, assignmentsResult] = await Promise.all([
    supabase
      .from('trainers')
      .select('id, display_name, bio, specialties, is_active')
      .order('display_name')
      .range(0, 99),
    supabase
      .from('trainer_assignments')
      .select('id, assigned_at, trainer:trainers!inner(id, display_name), member:members!inner(id, member_number, full_name)')
      .is('ended_at', null)
      .order('assigned_at', { ascending: false })
      .range(0, 49),
  ])

  if (trainersResult.error || assignmentsResult.error) {
    throw new Error('Unable to load trainer information.')
  }
  const trainers = trainerSchema.array().safeParse(trainersResult.data)
  const assignments = trainerAssignmentSchema.array().safeParse(assignmentsResult.data)
  if (!trainers.success || !assignments.success) {
    throw new Error('Trainer information returned an unexpected response.')
  }

  const activeTrainers = trainers.data.filter((trainer) => trainer.is_active)

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#00FF87]">Gym operations</p>
          <h1 className="mt-2 text-3xl font-bold">Trainers</h1>
          <p className="mt-2 text-muted-foreground">Manage trainer profiles and member assignments.</p>
        </div>
        <Link className={buttonVariants()} href="/admin/trainers/new">Add trainer</Link>
      </div>

      <section className="space-y-4" aria-labelledby="trainer-list">
        <h2 id="trainer-list" className="text-xl font-semibold">Trainer roster</h2>
        {trainers.data.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-sm text-muted-foreground">No trainer profiles yet.</div>
        ) : (
          <ul className="grid gap-3 lg:grid-cols-2">
            {trainers.data.map((trainer) => (
              <li key={trainer.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{trainer.display_name}</h3>
                      <span className={trainer.is_active ? 'text-xs text-[#00FF87]' : 'text-xs text-muted-foreground'}>
                        {trainer.is_active ? 'Active' : 'Archived'}
                      </span>
                    </div>
                    {trainer.specialties.length > 0 && (
                      <p className="mt-2 text-sm text-muted-foreground">{trainer.specialties.join(', ')}</p>
                    )}
                    {trainer.bio && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{trainer.bio}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      className={buttonVariants({ variant: 'outline', size: 'sm' })}
                      href={`/admin/trainers/${trainer.id}/edit`}
                    >
                      Edit
                    </Link>
                    <TrainerStatusForm trainerId={trainer.id} isActive={trainer.is_active} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)]">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Active assignments</h2>
            <p className="mt-1 text-sm text-muted-foreground">Showing up to 50 current trainer/member pairs.</p>
          </div>
          {assignments.data.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-sm text-muted-foreground">No active trainer assignments.</div>
          ) : (
            <ul className="divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10">
              {assignments.data.map((assignment) => (
                <li key={assignment.id} className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] p-4">
                  <div>
                    <p className="font-medium">{assignment.member.full_name} <span className="text-xs text-muted-foreground">({assignment.member.member_number})</span></p>
                    <p className="mt-1 text-sm text-muted-foreground">{assignment.trainer.display_name}</p>
                  </div>
                  <EndTrainerAssignmentForm assignmentId={assignment.id} />
                </li>
              ))}
            </ul>
          )}
        </div>
        <section className="h-fit rounded-xl border border-white/10 bg-white/[0.03] p-5" aria-labelledby="assign-trainer">
          <h2 id="assign-trainer" className="text-lg font-semibold">Assign a trainer</h2>
          <p className="mb-5 mt-1 text-sm text-muted-foreground">Assign an active trainer to an active member.</p>
          {activeTrainers.length === 0 && <p className="mb-4 text-sm text-amber-300">Add or activate a trainer before assigning members.</p>}
          <AssignTrainerForm trainers={activeTrainers.map(({ id, display_name }) => ({ id, display_name }))} />
        </section>
      </section>
    </div>
  )
}
