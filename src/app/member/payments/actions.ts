'use server'

import { revalidatePath } from 'next/cache'
import { isRazorpayConfigured, isServiceRoleConfigured, getRazorpayEnv } from '@/lib/env.server'
import { createAdminClient } from '@/lib/supabase/admin'
import { amountInPaise, createRazorpayOrder, fetchRazorpayPayment, mapRazorpayMethod, verifyCheckoutSignature } from '@/lib/payments/razorpay'
import { requireRole } from '@/lib/auth/authorization'
import {
  razorpayCheckoutInputSchema,
  razorpayOrderInputSchema,
  razorpayOrderRegistrationSchema,
} from '@/lib/validations/payment'

export type RazorpayPaymentActionState = {
  status: 'idle' | 'error' | 'success'
  message: string
  paymentId?: string
  orderId?: string
  amountPaise?: number
  keyId?: string
}

function getText(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

export async function createRazorpayOrderAction(
  _previousState: RazorpayPaymentActionState,
  formData: FormData,
): Promise<RazorpayPaymentActionState> {
  const { supabase, user } = await requireRole(['MEMBER'])
  const parsed = razorpayOrderInputSchema.safeParse({
    membershipId: getText(formData, 'membershipId'),
    idempotencyKey: getText(formData, 'idempotencyKey'),
  })
  if (!parsed.success) {
    return { status: 'error', message: 'Invalid membership payment request.' }
  }
  if (!isRazorpayConfigured() || !isServiceRoleConfigured()) {
    return { status: 'error', message: 'Online payments are not configured. Please contact reception.' }
  }

  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('id')
    .eq('profile_id', user.id)
    .eq('status', 'ACTIVE')
    .maybeSingle()
  if (memberError) {
    return { status: 'error', message: 'Unable to load your active member record.' }
  }
  if (!member) {
    return { status: 'error', message: 'An active linked member record is required to pay online.' }
  }

  const { data: membership, error: membershipError } = await supabase
    .from('memberships')
    .select('id, amount')
    .eq('id', parsed.data.membershipId)
    .eq('member_id', member.id)
    .eq('status', 'PENDING')
    .maybeSingle()
  if (membershipError) {
    return { status: 'error', message: 'Unable to load this pending membership.' }
  }
  if (!membership) {
    return { status: 'error', message: 'This membership is not awaiting payment.' }
  }

  const { data: existingPayment, error: existingPaymentError } = await supabase
    .from('payments')
    .select('id, provider, provider_order_id, amount')
    .eq('membership_id', membership.id)
    .eq('status', 'PENDING')
    .maybeSingle()
  if (existingPaymentError) {
    return { status: 'error', message: 'Unable to check for an existing payment order.' }
  }
  if (existingPayment) {
    if (existingPayment.provider !== 'razorpay' || !existingPayment.provider_order_id) {
      return { status: 'error', message: 'Another payment is already pending for this membership.' }
    }
    return {
      status: 'success',
      message: 'Continue with your existing payment order.',
      paymentId: existingPayment.id,
      orderId: existingPayment.provider_order_id,
      amountPaise: amountInPaise(existingPayment.amount),
      keyId: getRazorpayEnv().keyId,
    }
  }

  let amountPaise: number
  try {
    amountPaise = amountInPaise(membership.amount)
  } catch {
    return { status: 'error', message: 'The membership amount is invalid. Contact reception.' }
  }

  const createdOrder = await createRazorpayOrder({
    amountPaise,
    receipt: parsed.data.idempotencyKey,
    membershipId: membership.id,
  })
  if (!createdOrder.success) {
    return { status: 'error', message: createdOrder.message }
  }

  const adminClient = createAdminClient()
  const { data: registrationData, error: registrationError } = await adminClient.rpc('register_razorpay_order', {
    target_member_id: member.id,
    target_membership_id: membership.id,
    target_profile_id: user.id,
    p_idempotency_key: parsed.data.idempotencyKey,
    p_order_id: createdOrder.order.id,
  })

  if (registrationError || !registrationData) {
    if (registrationError?.code === '23505' || registrationError?.code === '55000') {
      const { data: concurrentPayment } = await supabase
        .from('payments')
        .select('id, provider, provider_order_id, amount')
        .eq('membership_id', membership.id)
        .eq('status', 'PENDING')
        .maybeSingle()
      if (concurrentPayment?.provider === 'razorpay' && concurrentPayment.provider_order_id) {
        return {
          status: 'success',
          message: 'Continue with your existing payment order.',
          paymentId: concurrentPayment.id,
          orderId: concurrentPayment.provider_order_id,
          amountPaise: amountInPaise(concurrentPayment.amount),
          keyId: createdOrder.keyId,
        }
      }
    }
    return { status: 'error', message: 'Unable to securely register the payment order. Please retry.' }
  }

  const registration = razorpayOrderRegistrationSchema.array().safeParse(registrationData)
  const registeredOrder = registration.success ? registration.data[0] : undefined
  if (!registeredOrder || amountInPaise(registeredOrder.payment_amount) !== createdOrder.order.amount) {
    return { status: 'error', message: 'The registered payment amount did not match the order.' }
  }

  revalidatePath('/member')
  return {
    status: 'success',
    message: 'Payment order ready.',
    paymentId: registeredOrder.registered_payment_id,
    orderId: registeredOrder.razorpay_order_id,
    amountPaise: createdOrder.order.amount,
    keyId: createdOrder.keyId,
  }
}

export async function verifyRazorpayCheckoutAction(
  _previousState: RazorpayPaymentActionState,
  formData: FormData,
): Promise<RazorpayPaymentActionState> {
  const { supabase } = await requireRole(['MEMBER'])
  const parsed = razorpayCheckoutInputSchema.safeParse({
    orderId: getText(formData, 'orderId'),
    paymentId: getText(formData, 'paymentId'),
    signature: getText(formData, 'signature'),
  })
  if (!parsed.success) {
    return { status: 'error', message: 'Razorpay returned invalid payment details.' }
  }
  if (!isRazorpayConfigured() || !isServiceRoleConfigured()) {
    return { status: 'error', message: 'Payment verification is not configured. Contact reception.' }
  }

  const { data: order, error: orderError } = await supabase
    .from('payments')
    .select('id, amount, provider, provider_order_id, status')
    .eq('provider_order_id', parsed.data.orderId)
    .maybeSingle()
  if (orderError || !order || order.provider !== 'razorpay') {
    return { status: 'error', message: 'This payment order could not be verified for your account.' }
  }
  if (!verifyCheckoutSignature(parsed.data.orderId, parsed.data.paymentId, parsed.data.signature)) {
    return { status: 'error', message: 'Payment signature verification failed.' }
  }

  const verifiedPayment = await fetchRazorpayPayment(parsed.data.paymentId)
  if (!verifiedPayment.success) {
    return { status: 'error', message: verifiedPayment.message }
  }
  const payment = verifiedPayment.payment
  if (payment.id !== parsed.data.paymentId
    || payment.order_id !== parsed.data.orderId
    || payment.status !== 'captured'
    || payment.currency !== 'INR'
    || payment.amount !== amountInPaise(order.amount)) {
    return { status: 'error', message: 'Payment is not captured or does not match the membership order.' }
  }

  const adminClient = createAdminClient()
  const { data: settledPaymentId, error: settlementError } = await adminClient.rpc('settle_razorpay_payment', {
    p_order_id: payment.order_id,
    p_payment_id: payment.id,
    p_amount_paise: payment.amount,
    p_currency: payment.currency,
    p_method: mapRazorpayMethod(payment.method),
  })
  if (settlementError || !settledPaymentId) {
    return { status: 'error', message: 'Payment was verified but membership activation is pending. The webhook will retry.' }
  }

  revalidatePath('/member')
  revalidatePath('/admin')
  revalidatePath('/admin/memberships')
  revalidatePath('/admin/payments')
  return {
    status: 'success',
    message: 'Payment verified and membership activated.',
    paymentId: settledPaymentId,
  }
}
