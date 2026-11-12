'use client'

import Link from 'next/link'
import { useActionState, useRef } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { recordManualPaymentAction, type ManualPaymentActionState } from './actions'

const initialState: ManualPaymentActionState = { status: 'idle', message: '' }

export function ManualPaymentForm({ membershipId }: { membershipId: string }) {
  const [state, formAction, isPending] = useActionState(recordManualPaymentAction, initialState)
  const idempotencyKeyRef = useRef<HTMLInputElement>(null)

  return (
    <form
      action={formAction}
      className="flex flex-wrap items-end gap-3"
      onSubmit={() => {
        if (idempotencyKeyRef.current && !idempotencyKeyRef.current.value) {
          idempotencyKeyRef.current.value = crypto.randomUUID()
        }
      }}
    >
      <input type="hidden" name="membershipId" value={membershipId} />
      <input ref={idempotencyKeyRef} type="hidden" name="idempotencyKey" />
      <div className="min-w-36 space-y-2">
        <Label htmlFor={`method-${membershipId}`}>Payment method</Label>
        <select id={`method-${membershipId}`} name="method" defaultValue="CASH" className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground">
          <option value="CASH">Cash</option>
          <option value="UPI">UPI</option>
          <option value="OTHER">Other manual</option>
        </select>
      </div>
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? 'Recording…' : 'Record payment'}
      </Button>
      {state.status === 'success' && state.paymentId && (
        <Link className={buttonVariants({ variant: 'outline', size: 'sm' })} href={`/admin/payments/${state.paymentId}/receipt`}>
          View receipt
        </Link>
      )}
      {state.message && (
        <p className={state.status === 'success' ? 'w-full text-sm text-[#00FF87]' : 'w-full text-sm text-red-400'} role="status">{state.message}</p>
      )}
    </form>
  )
}
