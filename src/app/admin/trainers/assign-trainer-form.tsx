'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { assignTrainerAction, type TrainerActionState } from './actions'

type TrainerOption = { id: string; display_name: string }

const initialState: TrainerActionState = { status: 'idle', message: '' }

export function AssignTrainerForm({ trainers }: { trainers: TrainerOption[] }) {
  const [state, formAction, isPending] = useActionState(assignTrainerAction, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="trainerId">Trainer</Label>
        <select id="trainerId" name="trainerId" required defaultValue="" className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground">
          <option value="" disabled>Select a trainer</option>
          {trainers.map((trainer) => <option key={trainer.id} value={trainer.id}>{trainer.display_name}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="memberNumber">Member number</Label>
        <Input id="memberNumber" name="memberNumber" maxLength={50} autoComplete="off" required />
      </div>
      {state.message && (
        <p className={state.status === 'success' ? 'text-sm text-[#00FF87]' : 'text-sm text-red-400'} role="status">{state.message}</p>
      )}
      <Button type="submit" disabled={isPending || trainers.length === 0}>{isPending ? 'Assigning…' : 'Assign trainer'}</Button>
    </form>
  )
}
