import { describe, expect, it } from 'vitest'
import {
  membershipPlanInputSchema,
  membershipPlanSchema,
} from './membership'

const validPlanInput = {
  name: 'Monthly membership',
  description: '',
  durationUnit: 'MONTHS',
  durationValue: '1',
  price: '2499.00',
  isActive: 'true',
}

describe('membershipPlanInputSchema', () => {
  it('accepts a calendar-month plan with a positive decimal price', () => {
    expect(membershipPlanInputSchema.safeParse(validPlanInput).success).toBe(true)
  })

  it('rejects invalid prices and duration bounds', () => {
    expect(membershipPlanInputSchema.safeParse({ ...validPlanInput, price: '0' }).success).toBe(false)
    expect(membershipPlanInputSchema.safeParse({ ...validPlanInput, price: '1.999' }).success).toBe(false)
    expect(membershipPlanInputSchema.safeParse({ ...validPlanInput, durationValue: '601' }).success).toBe(false)
  })

  it('allows longer day durations within the database bound', () => {
    expect(membershipPlanInputSchema.safeParse({
      ...validPlanInput,
      durationUnit: 'DAYS',
      durationValue: '7300',
    }).success).toBe(true)
  })
})

describe('membershipPlanSchema', () => {
  it('requires exactly one duration unit', () => {
    const basePlan = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Monthly membership',
      description: null,
      price: '2499.00',
      is_active: true,
    }

    expect(membershipPlanSchema.safeParse({
      ...basePlan,
      duration_days: null,
      duration_months: 1,
    }).success).toBe(true)
    expect(membershipPlanSchema.safeParse({
      ...basePlan,
      duration_days: null,
      duration_months: null,
    }).success).toBe(false)
    expect(membershipPlanSchema.safeParse({
      ...basePlan,
      duration_days: 30,
      duration_months: 1,
    }).success).toBe(false)
  })
})
