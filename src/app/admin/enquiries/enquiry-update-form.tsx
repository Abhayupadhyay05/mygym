'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateEnquiryAction, type EnquiryActionState } from './actions'

type Enquiry = {
  id: string
  status: 'NEW' | 'CONTACTED' | 'FOLLOW_UP' | 'CONVERTED' | 'CLOSED'
  follow_up_at: string | null
  assigned_to: string | null
}

const initialState: EnquiryActionState = { status: 'idle', message: '' }

function localDateTimeValue(value: string | null) {
  if (!value) return ''
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(value))
  const dateParts = Object.fromEntries(parts.map(({ type, value: partValue }) => [type, partValue]))
  return `${dateParts.year}-${dateParts.month}-${dateParts.day}T${dateParts.hour}:${dateParts.minute}`
}

export function EnquiryUpdateForm({ enquiry, currentUserId }: { enquiry: Enquiry; currentUserId: string }) {
  const [state, formAction, isPending] = useActionState(updateEnquiryAction, initialState)
  const assignedTo = enquiry.assigned_to === currentUserId
    ? 'true'
    : enquiry.assigned_to
      ? 'keep'
      : 'false'

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="id" value={enquiry.id} />
      <div className="space-y-2">
        <Label htmlFor={`status-${enquiry.id}`}>Status</Label>
        <select id={`status-${enquiry.id}`} name="status" defaultValue={enquiry.status} className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground" disabled={enquiry.status === 'CONVERTED'}>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="FOLLOW_UP">Follow-up</option>
          <option value="CONVERTED">Converted</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`followUpAt-${enquiry.id}`}>Follow-up (India time)</Label>
        <Input id={`followUpAt-${enquiry.id}`} name="followUpAt" type="datetime-local" defaultValue={localDateTimeValue(enquiry.follow_up_at)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`assignedTo-${enquiry.id}`}>Assignment</Label>
        <select id={`assignedTo-${enquiry.id}`} name="assignedTo" defaultValue={assignedTo} className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground">
          <option value="false">Unassigned</option>
          <option value="true">Assign to me</option>
          {enquiry.assigned_to && enquiry.assigned_to !== currentUserId && (
            <option value="keep">Keep current assignee</option>
          )}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`memberNumber-${enquiry.id}`}>Member number (required to convert)</Label>
        <Input id={`memberNumber-${enquiry.id}`} name="memberNumber" maxLength={50} autoComplete="off" disabled={enquiry.status === 'CONVERTED'} />
      </div>
      <div className="sm:col-span-2">
        {state.message && (
          <p className={state.status === 'success' ? 'mb-2 text-sm text-[#00FF87]' : 'mb-2 text-sm text-red-400'} role="status">{state.message}</p>
        )}
        <Button type="submit" size="sm" variant="outline" disabled={isPending || enquiry.status === 'CONVERTED'}>
          {isPending ? 'Updating…' : 'Save updates'}
        </Button>
      </div>
    </form>
  )
}
