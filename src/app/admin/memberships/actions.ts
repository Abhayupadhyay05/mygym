'use server'

import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth/authorization'
import { assignMembershipInputSchema } from '@/lib/validations/membership'

export type AssignMembershipActionState = {
  status: 'idle' | 'error' | 'success'
  message: string
}

function getText(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

export async function assignMembershipAction(
  _previousState: AssignMembershipActionState,
  formData: FormData,
): Promise<AssignMembershipActionState> {
  const { supabase } = await requireRole(['OWNER', 'RECEPTIONIST'])
  const parsed = assignMembershipInputSchema.safeParse({
    memberNumber: getText(formData, 'memberNumber'),
    planId: getText(formData, 'planId'),
  })

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? 'Enter a member number and select a plan.',
    }
  }

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

  const { data: membershipId, error: assignmentError } = await supabase.rpc('assign_membership', {
    target_member_id: member.id,
    target_plan_id: parsed.data.planId,
  })

  if (assignmentError || !membershipId) {
    return {
      status: 'error',
      message: assignmentError?.code === '23505'
        ? 'This member already has a pending membership. Record its payment before assigning another.'
        : assignmentError?.code === 'P0002'
          ? 'The member or active plan could not be found.'
          : 'Unable to assign this plan. Please try again.',
    }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/memberships')
  revalidatePath('/admin/members')
  return { status: 'success', message: 'Membership assigned as pending payment.' }
}
