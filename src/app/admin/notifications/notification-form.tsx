'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createMemberNotificationAction, type NotificationActionState } from './actions'

const initialState: NotificationActionState = { status: 'idle', message: '' }

export function NotificationForm() {
  const [state, formAction, isPending] = useActionState(createMemberNotificationAction, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="memberNumber">Member number</Label>
        <Input id="memberNumber" name="memberNumber" maxLength={50} autoComplete="off" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" maxLength={200} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="body">Message</Label>
        <Textarea id="body" name="body" maxLength={4000} rows={4} required />
      </div>
      <p className="text-sm text-muted-foreground">This creates an in-app notification only. Email and WhatsApp delivery are not configured.</p>
      {state.message && (
        <p className={state.status === 'success' ? 'text-sm text-[#00FF87]' : 'text-sm text-red-400'} role="status">{state.message}</p>
      )}
      <Button type="submit" disabled={isPending}>{isPending ? 'Sending…' : 'Create notification'}</Button>
    </form>
  )
}
