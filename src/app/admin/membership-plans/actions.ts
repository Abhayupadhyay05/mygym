'use server'

import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth/authorization'
import { membershipPlanInputSchema } from '@/lib/validations/membership'

export type MembershipPlanActionState = {
  status: 'idle' | 'error' | 'success'
  message: string
}

function getText(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

export async function saveMembershipPlanAction(
  _previousState: MembershipPlanActionState,
  formData: FormData,
): Promise<MembershipPlanActionState> {
  const { supabase, user } = await requireRole(['OWNER', 'RECEPTIONIST'])
  const parsed = membershipPlanInputSchema.safeParse({
    id: getText(formData, 'id'),
    name: getText(formData, 'name'),
    description: getText(formData, 'description'),
    durationUnit: getText(formData, 'durationUnit'),
    durationValue: getText(formData, 'durationValue'),
    price: getText(formData, 'price'),
    isActive: getText(formData, 'isActive') || 'true',
  })

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? 'Check the plan details and try again.',
    }
  }

  const { id, ...plan } = parsed.data
  const values = {
    name: plan.name,
    description: plan.description || null,
    duration_days: plan.durationUnit === 'DAYS' ? plan.durationValue : null,
    duration_months: plan.durationUnit === 'MONTHS' ? plan.durationValue : null,
    price: plan.price,
    is_active: plan.isActive === 'true',
  }

  const result = id
    ? await supabase.from('membership_plans').update(values).eq('id', id).select('id').single()
    : await supabase.from('membership_plans')
      .insert({ ...values, created_by: user.id })
      .select('id')
      .single()

  if (result.error || !result.data) {
    return {
      status: 'error',
      message: 'The plan could not be saved. Check your access and try again.',
    }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/membership-plans')
  revalidatePath('/admin/memberships')
  return { status: 'success', message: id ? 'Membership plan updated.' : 'Membership plan created.' }
}
