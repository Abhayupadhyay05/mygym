import 'server-only'
import { z } from 'zod'
import { getRazorpayEnv } from '@/lib/env.server'
import { verifyHmacSha256 } from '@/lib/payments/signature'

const orderResponseSchema = z.object({
  id: z.string().min(1).max(80),
  amount: z.number().int().positive(),
  currency: z.literal('INR'),
})

const paymentResponseSchema = z.object({
  id: z.string().min(1).max(80),
  order_id: z.string().min(1).max(80),
  amount: z.number().int().positive(),
  currency: z.literal('INR'),
  status: z.string(),
  method: z.string(),
})

export type RazorpayPaymentMethod = 'CARD' | 'UPI' | 'NET_BANKING' | 'WALLET' | 'OTHER'

export function amountInPaise(amount: number | string) {
  const rupees = Number(amount)
  if (!Number.isFinite(rupees) || rupees <= 0) {
    throw new Error('Invalid payment amount.')
  }
  const paise = Math.round(rupees * 100)
  if (!Number.isSafeInteger(paise) || paise <= 0) {
    throw new Error('Invalid payment amount.')
  }
  return paise
}

export function verifyCheckoutSignature(orderId: string, paymentId: string, signature: string) {
  const { keySecret } = getRazorpayEnv()
  return verifyHmacSha256(keySecret, `${orderId}|${paymentId}`, signature)
}

export function verifyWebhookSignature(rawBody: string, signature: string) {
  const { webhookSecret } = getRazorpayEnv()
  return verifyHmacSha256(webhookSecret, rawBody, signature)
}

export function mapRazorpayMethod(method: string): RazorpayPaymentMethod {
  switch (method) {
    case 'card': return 'CARD'
    case 'upi': return 'UPI'
    case 'netbanking': return 'NET_BANKING'
    case 'wallet': return 'WALLET'
    default: return 'OTHER'
  }
}

function basicAuthHeader(keyId: string, keySecret: string) {
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`
}

export async function createRazorpayOrder(input: {
  amountPaise: number
  receipt: string
  membershipId: string
}) {
  const { keyId, keySecret } = getRazorpayEnv()
  let response: Response
  try {
    response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: basicAuthHeader(keyId, keySecret),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: input.amountPaise,
        currency: 'INR',
        receipt: input.receipt,
        notes: { membership_id: input.membershipId },
      }),
      signal: AbortSignal.timeout(10_000),
      cache: 'no-store',
    })
  } catch {
    return { success: false as const, message: 'Razorpay could not be reached. Please retry.' }
  }

  if (!response.ok) {
    return { success: false as const, message: 'Razorpay could not create an order. Please retry.' }
  }

  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    return { success: false as const, message: 'Razorpay returned an unreadable order response.' }
  }

  const order = orderResponseSchema.safeParse(payload)
  if (!order.success || order.data.amount !== input.amountPaise) {
    return { success: false as const, message: 'Razorpay returned an unexpected order response.' }
  }
  return { success: true as const, order: order.data, keyId }
}

export async function fetchRazorpayPayment(paymentId: string) {
  const { keyId, keySecret } = getRazorpayEnv()
  let response: Response
  try {
    response = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, {
      headers: { Authorization: basicAuthHeader(keyId, keySecret) },
      signal: AbortSignal.timeout(10_000),
      cache: 'no-store',
    })
  } catch {
    return { success: false as const, message: 'Unable to verify payment with Razorpay. Please retry.' }
  }

  if (!response.ok) {
    return { success: false as const, message: 'Razorpay payment verification failed. Please retry.' }
  }
  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    return { success: false as const, message: 'Razorpay returned an unreadable payment response.' }
  }
  const payment = paymentResponseSchema.safeParse(payload)
  if (!payment.success) {
    return { success: false as const, message: 'Razorpay returned an unexpected payment response.' }
  }
  return { success: true as const, payment: payment.data }
}
