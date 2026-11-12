import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireRole } from '@/lib/auth/authorization'
import { trainerSchema } from '@/lib/validations/trainer'
import { TrainerForm } from '../../trainer-form'

export const metadata: Metadata = { title: 'Edit Trainer' }

export default async function EditTrainerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    notFound()
  }

  const { supabase } = await requireRole(['OWNER', 'RECEPTIONIST'])
  const { data, error } = await supabase
    .from('trainers')
    .select('id, display_name, bio, specialties, is_active')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw new Error('Unable to load this trainer.')
  }
  if (!data) {
    notFound()
  }
  const trainer = trainerSchema.safeParse(data)
  if (!trainer.success) {
    throw new Error('This trainer profile returned an unexpected response.')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/admin/trainers" className="text-sm text-muted-foreground hover:text-foreground">← Back to trainers</Link>
        <h1 className="mt-3 text-3xl font-bold">Edit trainer</h1>
      </div>
      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
        <TrainerForm trainer={trainer.data} />
      </section>
    </div>
  )
}
