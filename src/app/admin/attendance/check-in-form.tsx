'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { recordAttendanceAction, type AttendanceActionState } from './actions'

const initialState: AttendanceActionState = { status: 'idle', message: '' }

export function AttendanceCheckInForm() {
  const [state, formAction, isPending] = useActionState(recordAttendanceAction, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="w-full space-y-2 sm:max-w-sm">
        <Label htmlFor="memberNumber">Member number</Label>
        <Input id="memberNumber" name="memberNumber" maxLength={50} autoComplete="off" required />
      </div>
      <Button type="submit" disabled={isPending}>{isPending ? 'Checking in…' : 'Record check-in'}</Button>
      {state.message && (
        <p className={state.status === 'success' ? 'text-sm text-[#00FF87]' : 'text-sm text-red-400'} role="status">{state.message}</p>
      )}
    </form>
  )
}
