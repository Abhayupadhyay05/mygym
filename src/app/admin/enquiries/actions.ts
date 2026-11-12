'use server'

import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth/authorization'
import { enquiryInputSchema, enquiryUpdateInputSchema } from '@/lib/validations/enquiry'

export type EnquiryActionState = {
  status: 'idle' | 'error' | 'success'
  message: string
}

function getText(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

function toDatabaseTimestamp(value: string) {
  return value ? new Date(`${value}:00+05:30`).toISOString() : null
}

export async function createEnquiryAction(
  _previousState: EnquiryActionState,
  formData: FormData,
): Promise<EnquiryActionState> {
  const { supabase } = await requireRole(['OWNER', 'RECEPTIONIST'])
  const parsed = enquiryInputSchema.safeParse({
    fullName: getText(formData, 'fullName'),
    email: getText(formData, 'email'),
    phone: getText(formData, 'phone'),
    message: getText(formData, 'message'),
  })

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? 'Check the enquiry details and try again.',
    }
  }

  const { error } = await supabase.from('enquiries').insert({
    full_name: parsed.data.fullName,
    email: parsed.data.email || null,
    phone: parsed.data.phone,
    message: parsed.data.message || null,
  })
  if (error) {
    return { status: 'error', message: 'Unable to save this enquiry. Please try again.' }
  }

  revalidatePath('/admin/enquiries')
  return { status: 'success', message: 'Enquiry added.' }
}

export async function updateEnquiryAction(
  _previousState: EnquiryActionState,
  formData: FormData,
): Promise<EnquiryActionState> {
  const { supabase, user } = await requireRole(['OWNER', 'RECEPTIONIST'])
  const parsed = enquiryUpdateInputSchema.safeParse({
    id: getText(formData, 'id'),
    status: getText(formData, 'status'),
    followUpAt: getText(formData, 'followUpAt'),
    assignedTo: getText(formData, 'assignedTo'),
    memberNumber: getText(formData, 'memberNumber'),
  })

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? 'Check the follow-up details and try again.',
    }
  }

  if (parsed.data.followUpAt && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(parsed.data.followUpAt)) {
    return { status: 'error', message: 'Enter a valid follow-up date and time.' }
  }

  const { data: current, error: currentError } = await supabase
    .from('enquiries')
    .select('id, status, converted_member_id, assigned_to')
    .eq('id', parsed.data.id)
    .maybeSingle()
  if (currentError) {
    return { status: 'error', message: 'Unable to load this enquiry. Please refresh and try again.' }
  }
  if (!current) {
    return { status: 'error', message: 'Enquiry not found.' }
  }
  if (current.status === 'CONVERTED') {
    return { status: 'error', message: 'Converted enquiries cannot be edited.' }
  }

  let convertedMemberId: string | null = null
  if (parsed.data.status === 'CONVERTED') {
    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('id')
      .eq('member_number', parsed.data.memberNumber)
      .eq('status', 'ACTIVE')
      .maybeSingle()
    if (memberError) {
      return { status: 'error', message: 'Unable to verify that member. Please try again.' }
    }
    if (!member) {
      return { status: 'error', message: 'No active member was found with that member number.' }
    }
    convertedMemberId = member.id
  }

  const assignedTo = parsed.data.assignedTo === 'true'
    ? user.id
    : parsed.data.assignedTo === 'false'
      ? null
      : current.assigned_to

  const { data: updated, error } = await supabase
    .from('enquiries')
    .update({
      status: parsed.data.status,
      follow_up_at: toDatabaseTimestamp(parsed.data.followUpAt),
      assigned_to: assignedTo,
      converted_member_id: convertedMemberId,
    })
    .eq('id', parsed.data.id)
    .is('converted_member_id', null)
    .select('id')
    .maybeSingle()

  if (error || !updated) {
    return { status: 'error', message: 'Unable to update this enquiry. Refresh and try again.' }
  }

  revalidatePath('/admin/enquiries')
  return { status: 'success', message: 'Enquiry updated.' }
}
