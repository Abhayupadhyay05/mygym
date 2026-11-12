'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { MembershipPlan } from './page'
import { assignMembershipAction, type AssignMembershipActionState } from './actions'

const initialState: AssignMembershipActionState = { status: 'idle', message: '' }

export function AssignMembershipForm({ plans }: { plans: MembershipPlan[] }) {
  const [state, formAction, isPending] = useActionState(assignMembershipAction, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="memberNumber">Member number</Label>
        <Input id="memberNumber" name="memberNumber" maxLength={50} required autoComplete="off" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="planId">Membership plan</Label>
        <select id="planId" name="planId" required defaultValue="" className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground">
          <option value="" disabled>Select a plan</option>
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name} · ₹{plan.price.toLocaleString('en-IN')} · {plan.durationLabel}
            </option>
          ))}
        </select>
      </div>
      <p className="text-sm text-muted-foreground">The membership remains pending until payment is recorded and verified.</p>
      {state.message && (
        <p className={state.status === 'success' ? 'text-sm text-[#00FF87]' : 'text-sm text-red-400'} role="status">{state.message}</p>
      )}
      <Button type="submit" disabled={isPending || plans.length === 0}>
        {isPending ? 'Assigning…' : 'Assign plan'}
      </Button>
    </form>
  )
}
