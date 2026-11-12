'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { saveMembershipPlanAction, type MembershipPlanActionState } from './actions'

type PlanValues = {
  id?: string
  name?: string
  description?: string | null
  duration_days?: number | null
  duration_months?: number | null
  price?: number | string
  is_active?: boolean
}

const initialState: MembershipPlanActionState = { status: 'idle', message: '' }

export function MembershipPlanForm({ plan }: { plan?: PlanValues }) {
  const [state, formAction, isPending] = useActionState(saveMembershipPlanAction, initialState)
  const durationUnit = plan?.duration_months ? 'MONTHS' : 'DAYS'
  const durationValue = plan?.duration_months ?? plan?.duration_days ?? ''

  return (
    <form action={formAction} className="space-y-5">
      {plan?.id && <input type="hidden" name="id" value={plan.id} />}
      <div className="space-y-2">
        <Label htmlFor="name">Plan name</Label>
        <Input id="name" name="name" defaultValue={plan?.name} maxLength={120} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea id="description" name="description" defaultValue={plan?.description ?? ''} rows={3} maxLength={2000} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="durationValue">Duration</Label>
          <Input id="durationValue" name="durationValue" type="number" defaultValue={durationValue} min={1} max={7300} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="durationUnit">Duration unit</Label>
          <select id="durationUnit" name="durationUnit" defaultValue={durationUnit} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground">
            <option value="MONTHS">Calendar months</option>
            <option value="DAYS">Days (custom duration)</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Price (INR)</Label>
        <Input id="price" name="price" type="number" inputMode="decimal" step="0.01" min="0.01" max="9999999999.99" defaultValue={plan?.price} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="isActive">Availability</Label>
        <select id="isActive" name="isActive" defaultValue={plan?.is_active === false ? 'false' : 'true'} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground">
          <option value="true">Available for sale</option>
          <option value="false">Archived (not available for new memberships)</option>
        </select>
      </div>
      {state.message && (
        <p className={state.status === 'success' ? 'text-sm text-[#00FF87]' : 'text-sm text-red-400'} role="status">{state.message}</p>
      )}
      <Button type="submit" disabled={isPending}>{isPending ? 'Saving…' : 'Save plan'}</Button>
    </form>
  )
}
