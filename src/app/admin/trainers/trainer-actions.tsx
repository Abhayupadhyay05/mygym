'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import {
  endTrainerAssignmentAction,
  setTrainerActiveAction,
  type TrainerActionState,
} from './actions'

const initialState: TrainerActionState = { status: 'idle', message: '' }

export function TrainerStatusForm({ trainerId, isActive }: { trainerId: string; isActive: boolean }) {
  const [state, formAction, isPending] = useActionState(setTrainerActiveAction, initialState)

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="trainerId" value={trainerId} />
      <input type="hidden" name="active" value={String(!isActive)} />
      <Button type="submit" size="sm" variant="outline" disabled={isPending}>
        {isPending ? 'Updating…' : isActive ? 'Archive trainer' : 'Activate trainer'}
      </Button>
      {state.message && <p className={state.status === 'success' ? 'text-xs text-[#00FF87]' : 'text-xs text-red-400'} role="status">{state.message}</p>}
    </form>
  )
}

export function EndTrainerAssignmentForm({ assignmentId }: { assignmentId: string }) {
  const [state, formAction, isPending] = useActionState(endTrainerAssignmentAction, initialState)

  return (
    <form action={formAction} className="text-right">
      <input type="hidden" name="assignmentId" value={assignmentId} />
      <Button type="submit" size="sm" variant="outline" disabled={isPending}>
        {isPending ? 'Ending…' : 'End assignment'}
      </Button>
      {state.message && <p className={state.status === 'success' ? 'mt-1 text-xs text-[#00FF87]' : 'mt-1 text-xs text-red-400'} role="status">{state.message}</p>}
    </form>
  )
}
