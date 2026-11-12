'use server'

import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth/authorization'
import { manualPaymentInputSchema } from '@/lib/validations/payment'

export type ManualPaymentActionState = {
  status: 'idle' | 'error' | 'success'
  message: string
  paymentId?: string
}

function getText(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

export async function recordManualPaymentAction(
  _previousState: ManualPaymentActionState,
  formData: FormData,
): Promise<ManualPaymentActionState> {
  const { supabase } = await requireRole(['OWNER', 'RECEPTIONIST'])
  const parsed = manualPaymentInputSchema.safeParse({
    membershipId: getText(formData, 'membershipId'),
    method: getText(formData, 'method'),
    idempotencyKey: getText(formData, 'idempotencyKey'),
  })

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? 'Check the payment details and try again.',
    }
  }

  const { data: paymentId, error } = await supabase.rpc('record_manual_payment', {
    target_membership_id: parsed.data.membershipId,
    p_method: parsed.data.method,
    p_idempotency_key: parsed.data.idempotencyKey,
  })

  if (error || !paymentId) {
    return {
      status: 'error',
      message: error?.code === 'P0002'
        ? 'This membership is no longer awaiting payment. Refresh the page.'
        : error?.code === '55000'
          ? 'An online payment is still pending. Wait for its result before recording a manual payment.'
        : error?.code === '23505'
          ? 'A payment has already been recorded or this request conflicts with another payment.'
          : error?.code === '22023'
            ? 'The payment details were rejected. Refresh the page and try again.'
            : 'Unable to record this payment. Please try again.',
    }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/memberships')
  revalidatePath('/admin/payments')
  revalidatePath(`/admin/payments/${paymentId}/receipt`)
  return {
    status: 'success',
    message: 'Payment recorded and membership activated.',
    paymentId,
  }
}
