'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { saveMemberAction, type MemberActionState } from './actions'

type MemberFormValues = {
  id?: string
  member_number?: string
  full_name?: string
  email?: string | null
  phone?: string
  date_of_birth?: string | null
  emergency_contact_name?: string | null
  emergency_contact_phone?: string | null
  address?: string | null
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  notes?: string | null
}

const initialState: MemberActionState = { status: 'idle', message: '' }

export function MemberForm({ member }: { member?: MemberFormValues }) {
  const [state, formAction, isPending] = useActionState(saveMemberAction, initialState)

  return (
    <form action={formAction} className="space-y-6">
      {member?.id && <input type="hidden" name="id" value={member.id} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="memberNumber">Member number</Label>
          <Input id="memberNumber" name="memberNumber" defaultValue={member?.member_number} required maxLength={50} autoComplete="off" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" name="fullName" defaultValue={member?.full_name} required maxLength={160} autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" defaultValue={member?.phone} required minLength={8} maxLength={32} autoComplete="tel" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email (optional)</Label>
          <Input id="email" name="email" type="email" defaultValue={member?.email ?? ''} maxLength={254} autoComplete="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of birth (optional)</Label>
          <Input id="dateOfBirth" name="dateOfBirth" type="date" defaultValue={member?.date_of_birth ?? ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Member status</Label>
          <select id="status" name="status" defaultValue={member?.status ?? 'ACTIVE'} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground">
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergencyContactName">Emergency contact name (optional)</Label>
          <Input id="emergencyContactName" name="emergencyContactName" defaultValue={member?.emergency_contact_name ?? ''} maxLength={160} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergencyContactPhone">Emergency contact phone (optional)</Label>
          <Input id="emergencyContactPhone" name="emergencyContactPhone" type="tel" defaultValue={member?.emergency_contact_phone ?? ''} maxLength={32} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">Address (optional)</Label>
          <Textarea id="address" name="address" defaultValue={member?.address ?? ''} maxLength={500} rows={3} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="notes">Staff notes (optional)</Label>
          <Textarea id="notes" name="notes" defaultValue={member?.notes ?? ''} maxLength={2000} rows={4} />
        </div>
      </div>

      {state.message && (
        <p className={state.status === 'success' ? 'text-sm text-[#00FF87]' : 'text-sm text-red-400'} role="status">
          {state.message}
          {state.status === 'success' && state.memberId && (
            <> <Link className="underline" href={`/admin/members/${state.memberId}/edit`}>Open member record</Link></>
          )}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isPending}>{isPending ? 'Saving…' : 'Save member'}</Button>
        <Link className={buttonVariants({ variant: 'outline' })} href="/admin/members">Cancel</Link>
      </div>
    </form>
  )
}
