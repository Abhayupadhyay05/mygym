'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { saveProfileSettingsAction, type ProfileSettingsActionState } from './actions'

const initialState: ProfileSettingsActionState = { status: 'idle', message: '' }

export function ProfileSettingsForm({
  fullName,
  phone,
}: {
  fullName: string
  phone: string | null
}) {
  const [state, formAction, isPending] = useActionState(saveProfileSettingsAction, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Display name</Label>
        <Input id="fullName" name="fullName" defaultValue={fullName} maxLength={160} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" name="phone" type="tel" defaultValue={phone ?? ''} maxLength={32} />
      </div>
      {state.message && (
        <p className={state.status === 'success' ? 'text-sm text-[#00FF87]' : 'text-sm text-red-400'} role="status">{state.message}</p>
      )}
      <Button type="submit" disabled={isPending}>{isPending ? 'Saving…' : 'Save profile'}</Button>
    </form>
  )
}
