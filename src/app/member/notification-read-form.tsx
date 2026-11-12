'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { markMemberNotificationReadAction, type NotificationActionState } from '@/app/admin/notifications/actions'

const initialState: NotificationActionState = { status: 'idle', message: '' }

export function NotificationReadForm({ notificationId }: { notificationId: string }) {
  const [state, formAction, isPending] = useActionState(markMemberNotificationReadAction, initialState)

  return (
    <form action={formAction}>
      <input type="hidden" name="notificationId" value={notificationId} />
      <Button type="submit" size="sm" variant="outline" disabled={isPending}>
        {isPending ? 'Updating…' : 'Mark as read'}
      </Button>
      {state.message && <p className={state.status === 'success' ? 'mt-2 text-xs text-[#00FF87]' : 'mt-2 text-xs text-red-400'} role="status">{state.message}</p>}
    </form>
  )
}
