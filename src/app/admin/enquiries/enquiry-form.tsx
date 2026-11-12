'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createEnquiryAction, type EnquiryActionState } from './actions'

const initialState: EnquiryActionState = { status: 'idle', message: '' }

export function EnquiryForm() {
  const [state, formAction, isPending] = useActionState(createEnquiryAction, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Name</Label>
        <Input id="fullName" name="fullName" maxLength={160} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" maxLength={32} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email (optional)</Label>
          <Input id="email" name="email" type="email" maxLength={254} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Enquiry notes (optional)</Label>
        <Textarea id="message" name="message" maxLength={4000} rows={3} />
      </div>
      {state.message && (
        <p className={state.status === 'success' ? 'text-sm text-[#00FF87]' : 'text-sm text-red-400'} role="status">{state.message}</p>
      )}
      <Button type="submit" disabled={isPending}>{isPending ? 'Saving…' : 'Add enquiry'}</Button>
    </form>
  )
}
