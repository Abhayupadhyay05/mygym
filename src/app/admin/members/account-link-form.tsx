'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  linkMemberAccountAction,
  type AccountLinkActionState,
} from './account-link-actions'

type ProfileOption = { id: string; full_name: string; phone: string | null }

const initialState: AccountLinkActionState = { status: 'idle', message: '' }

export function AccountLinkForm({
  memberId,
  profiles,
}: {
  memberId: string
  profiles: ProfileOption[]
}) {
  const [state, formAction, isPending] = useActionState(linkMemberAccountAction, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="memberId" value={memberId} />
      <div className="space-y-2">
        <Label htmlFor="profileId">Existing MEMBER account</Label>
        <select id="profileId" name="profileId" required defaultValue="" className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground">
          <option value="" disabled>Select an account</option>
          {profiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.full_name} · {profile.phone ?? 'No phone'} · ID …{profile.id.slice(-6)}
            </option>
          ))}
        </select>
      </div>
      <p className="text-sm text-muted-foreground">
        Linking is one-way in this screen and does not create accounts or change roles. Verify the account identity before continuing.
      </p>
      {state.message && (
        <p className={state.status === 'success' ? 'text-sm text-[#00FF87]' : 'text-sm text-red-400'} role="status">{state.message}</p>
      )}
      <Button type="submit" disabled={isPending || profiles.length === 0}>
        {isPending ? 'Linking…' : 'Link member account'}
      </Button>
    </form>
  )
}
