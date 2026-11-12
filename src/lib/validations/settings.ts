import { z } from 'zod'

const optionalPhone = z.union([
  z.literal(''),
  z.string().trim().min(8).max(32).regex(/^\+?[0-9()\-\s]+$/),
])

export const profileSettingsSchema = z.object({
  fullName: z.string().trim().min(1, 'Enter your name.').max(160),
  phone: optionalPhone,
})
