import { z } from 'zod'

const priceString = z.string().trim()
  .regex(/^(?:0|[1-9]\d{0,9})(?:\.\d{1,2})?$/, 'Enter an amount with up to 2 decimal places.')
  .refine((value) => Number(value) > 0, 'Plan price must be greater than zero.')

export const membershipPlanInputSchema = z.object({
  id: z.union([z.literal(''), z.string().uuid()]).optional(),
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2000),
  durationUnit: z.enum(['DAYS', 'MONTHS']),
  durationValue: z.coerce.number().int().min(1).max(7300),
  price: priceString,
  isActive: z.enum(['true', 'false']),
}).refine(
  (plan) => plan.durationUnit === 'DAYS' || plan.durationValue <= 600,
  { path: ['durationValue'], message: 'Month-based plans cannot exceed 600 months.' },
)

export const membershipPlanSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  duration_days: z.number().nullable(),
  duration_months: z.number().nullable(),
  price: z.coerce.number().finite().positive(),
  is_active: z.boolean(),
}).refine(
  (plan) => (plan.duration_days !== null) !== (plan.duration_months !== null),
  'Plan must have exactly one duration unit.',
)

export const assignMembershipInputSchema = z.object({
  memberNumber: z.string().trim().min(1).max(50),
  planId: z.string().uuid(),
})

export const membershipListItemSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED', 'FROZEN']),
  starts_on: z.string(),
  ends_on: z.string(),
  amount: z.coerce.number().finite().nonnegative(),
  created_at: z.string(),
  member: z.object({
    member_number: z.string(),
    full_name: z.string(),
  }),
  plan: z.object({
    name: z.string(),
  }),
})
