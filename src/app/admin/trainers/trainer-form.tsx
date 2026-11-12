'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { saveTrainerAction, type TrainerActionState } from './actions'

type TrainerValues = {
  id?: string
  display_name?: string
  bio?: string | null
  specialties?: string[]
}

const initialState: TrainerActionState = { status: 'idle', message: '' }

export function TrainerForm({ trainer }: { trainer?: TrainerValues }) {
  const [state, formAction, isPending] = useActionState(saveTrainerAction, initialState)

  return (
    <form action={formAction} className="space-y-5">
      {trainer?.id && <input type="hidden" name="id" value={trainer.id} />}
      <div className="space-y-2">
        <Label htmlFor="displayName">Trainer name</Label>
        <Input id="displayName" name="displayName" defaultValue={trainer?.display_name} maxLength={160} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio (optional)</Label>
        <Textarea id="bio" name="bio" defaultValue={trainer?.bio ?? ''} maxLength={2000} rows={4} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="specialties">Specialties (comma-separated)</Label>
        <Input id="specialties" name="specialties" defaultValue={trainer?.specialties?.join(', ')} maxLength={1000} />
      </div>
      <p className="text-sm text-muted-foreground">
        Trainer portal access requires a separately created Supabase account, the TRAINER role, and a trusted profile link. Provisioning and linking are not available in this form.
      </p>
      {state.message && (
        <p className={state.status === 'success' ? 'text-sm text-[#00FF87]' : 'text-sm text-red-400'} role="status">{state.message}</p>
      )}
      <Button type="submit" disabled={isPending}>{isPending ? 'Saving…' : 'Save trainer'}</Button>
    </form>
  )
}
