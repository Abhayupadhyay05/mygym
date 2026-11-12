'use server'

import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth/authorization'
import { memberInputSchema } from '@/lib/validations/member'

export type MemberActionState = {
  status: 'idle' | 'error' | 'success'
  message: string
  memberId?: string
}

function getText(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

export async function saveMemberAction(
  _previousState: MemberActionState,
  formData: FormData,
): Promise<MemberActionState> {
  const { supabase, user } = await requireRole(['OWNER', 'RECEPTIONIST'])
  const parsed = memberInputSchema.safeParse({
    id: getText(formData, 'id'),
    memberNumber: getText(formData, 'memberNumber'),
    fullName: getText(formData, 'fullName'),
    email: getText(formData, 'email'),
    phone: getText(formData, 'phone'),
    dateOfBirth: getText(formData, 'dateOfBirth'),
    emergencyContactName: getText(formData, 'emergencyContactName'),
    emergencyContactPhone: getText(formData, 'emergencyContactPhone'),
    address: getText(formData, 'address'),
    status: getText(formData, 'status'),
    notes: getText(formData, 'notes'),
  })

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? 'Check the member details and try again.',
    }
  }

  const { id, ...member } = parsed.data
  const values = {
    member_number: member.memberNumber,
    full_name: member.fullName,
    email: member.email,
    phone: member.phone,
    date_of_birth: member.dateOfBirth,
    emergency_contact_name: member.emergencyContactName || null,
    emergency_contact_phone: member.emergencyContactPhone,
    address: member.address || null,
    status: member.status,
    notes: member.notes || null,
  }

  const result = id
    ? await supabase.from('members').update(values).eq('id', id).select('id').single()
    : await supabase.from('members').insert({ ...values, created_by: user.id }).select('id').single()

  if (result.error || !result.data) {
    return {
      status: 'error',
      message: result.error?.code === '23505'
        ? 'That member number is already in use.'
        : 'The member could not be saved. Check your access and try again.',
    }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/members')
  revalidatePath(`/admin/members/${result.data.id}/edit`)
  return {
    status: 'success',
    message: id ? 'Member details updated.' : 'Member added.',
    memberId: result.data.id,
  }
}
