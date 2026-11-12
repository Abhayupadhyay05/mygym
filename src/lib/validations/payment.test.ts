import { describe, expect, it } from 'vitest'
import { manualPaymentInputSchema } from './payment'

describe('manualPaymentInputSchema', () => {
  const validPayment = {
    membershipId: '550e8400-e29b-41d4-a716-446655440000',
    method: 'UPI',
    idempotencyKey: '8a5c1f60-f7b0-4a34-a152-d5edcb6d45ef',
  }

  it('accepts a supported manual payment request', () => {
    expect(manualPaymentInputSchema.safeParse(validPayment).success).toBe(true)
  })

  it('rejects online-only methods from the manual payment action', () => {
    expect(manualPaymentInputSchema.safeParse({ ...validPayment, method: 'CARD' }).success).toBe(false)
  })

  it('requires a valid idempotency key', () => {
    expect(manualPaymentInputSchema.safeParse({ ...validPayment, idempotencyKey: 'retry' }).success).toBe(false)
  })
})
