import { z } from 'zod'

export const manualPaymentInputSchema = z.object({
  membershipId: z.string().uuid(),
  method: z.enum(['CASH', 'UPI', 'OTHER']),
  idempotencyKey: z.string().uuid(),
})

export const paymentListItemSchema = z.object({
  id: z.string().uuid(),
  amount: z.coerce.number().finite().positive(),
  currency: z.literal('INR'),
  method: z.enum(['CASH', 'UPI', 'CARD', 'NET_BANKING', 'WALLET', 'OTHER']),
  status: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED']),
  paid_at: z.string().nullable(),
  created_at: z.string(),
  member: z.object({
    member_number: z.string(),
    full_name: z.string(),
  }),
  membership: z.object({
    id: z.string().uuid(),
    plan: z.object({
      name: z.string(),
    }).nullable(),
  }).nullable(),
})

export const paymentReceiptSchema = z.object({
  id: z.string().uuid(),
  amount: z.coerce.number().finite().positive(),
  currency: z.literal('INR'),
  method: z.enum(['CASH', 'UPI', 'CARD', 'NET_BANKING', 'WALLET', 'OTHER']),
  status: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED']),
  paid_at: z.string().nullable(),
  created_at: z.string(),
  member: z.object({
    member_number: z.string(),
    full_name: z.string(),
    email: z.string().nullable(),
    phone: z.string(),
  }),
  membership: z.object({
    id: z.string().uuid(),
    starts_on: z.string(),
    ends_on: z.string(),
    plan: z.object({
      name: z.string(),
    }).nullable(),
  }).nullable(),
})

export const pendingMembershipPaymentSchema = z.object({
  id: z.string().uuid(),
  amount: z.coerce.number().finite().positive(),
  starts_on: z.string(),
  ends_on: z.string(),
  created_at: z.string(),
  member: z.object({
    member_number: z.string(),
    full_name: z.string(),
  }),
  plan: z.object({
    name: z.string(),
  }),
})

export const razorpayOrderInputSchema = z.object({
  membershipId: z.string().uuid(),
  idempotencyKey: z.string().uuid(),
})

export const razorpayCheckoutInputSchema = z.object({
  orderId: z.string().trim().min(1).max(80),
  paymentId: z.string().trim().min(1).max(80),
  signature: z.string().regex(/^[\da-f]{64}$/i),
})

export const razorpayOrderRegistrationSchema = z.object({
  registered_payment_id: z.string().uuid(),
  razorpay_order_id: z.string().min(1).max(80),
  payment_amount: z.coerce.number().finite().positive(),
})
