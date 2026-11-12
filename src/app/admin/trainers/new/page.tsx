import type { Metadata } from 'next'
import Link from 'next/link'
import { TrainerForm } from '../trainer-form'

export const metadata: Metadata = { title: 'Add Trainer' }

export default function NewTrainerPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/admin/trainers" className="text-sm text-muted-foreground hover:text-foreground">← Back to trainers</Link>
        <h1 className="mt-3 text-3xl font-bold">Add trainer</h1>
      </div>
      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
        <TrainerForm />
      </section>
    </div>
  )
}
