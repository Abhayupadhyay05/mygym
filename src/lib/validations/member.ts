import { z } from 'zod'

const optionalDate = z.union([z.literal(''), z.iso.date()]).transform((value) => value || null)
const optionalEmail = z.union([z.literal(''), z.string().trim().email().max(254)]).transform((value) => value || null)
const phoneNumber = z.string().trim().min(8).max(32).regex(/^\+?[0-9()\-\s]+$/)

export const memberInputSchema = z.object({
  id: z.union([z.literal(''), z.string().uuid()]).optional(),
  memberNumber: z.string().trim().min(1).max(50),
  fullName: z.string().trim().min(1).max(160),
  email: optionalEmail,
  phone: phoneNumber,
  dateOfBirth: optionalDate,
  emergencyContactName: z.string().trim().max(160),
  emergencyContactPhone: z.union([z.literal(''), phoneNumber]).transform((value) => value || null),
  address: z.string().trim().max(500),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
  notes: z.string().trim().max(2000),
})

export const memberListItemSchema = z.object({
  id: z.string().uuid(),
  member_number: z.string(),
  full_name: z.string(),
  email: z.string().nullable(),
  phone: z.string(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
  joined_at: z.string(),
})

export const memberSearchResultSchema = z.object({
  total_count: z.number().int().nonnegative(),
  items: memberListItemSchema.array(),
})

export const memberSearchParamsSchema = z.object({
  query: z.string().trim().max(100).default(''),
  status: z.enum(['ALL', 'ACTIVE', 'INACTIVE', 'SUSPENDED']).default('ALL'),
  page: z.coerce.number().int().min(1).max(10001).default(1),
})

export const memberDetailsSchema = z.object({
  id: z.string().uuid(),
  profile_id: z.string().uuid().nullable(),
  member_number: z.string(),
  full_name: z.string(),
  email: z.string().nullable(),
  phone: z.string(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
  date_of_birth: z.string().nullable(),
  emergency_contact_name: z.string().nullable(),
  emergency_contact_phone: z.string().nullable(),
  address: z.string().nullable(),
  notes: z.string().nullable(),
})
