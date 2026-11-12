import { z } from 'zod'

export const trainerInputSchema = z.object({
  id: z.union([z.literal(''), z.string().uuid()]).optional(),
  displayName: z.string().trim().min(1, 'Enter a trainer name.').max(160),
  bio: z.string().trim().max(2000),
  specialties: z.string().max(1000).transform((value) => [
    ...new Set(value.split(',').map((item) => item.trim()).filter(Boolean)),
  ]).refine(
    (items) => items.length <= 20 && items.every((item) => item.length <= 60),
    'Add at most 20 specialties, each up to 60 characters.',
  ),
})

export const trainerSchema = z.object({
  id: z.string().uuid(),
  display_name: z.string(),
  bio: z.string().nullable(),
  specialties: z.array(z.string()),
  is_active: z.boolean(),
})

export const trainerAssignmentInputSchema = z.object({
  trainerId: z.string().uuid(),
  memberNumber: z.string().trim().min(1).max(50),
})

export const trainerAssignmentSchema = z.object({
  id: z.string().uuid(),
  assigned_at: z.string(),
  member: z.object({
    id: z.string().uuid(),
    member_number: z.string(),
    full_name: z.string(),
  }),
  trainer: z.object({
    id: z.string().uuid(),
    display_name: z.string(),
  }),
})
