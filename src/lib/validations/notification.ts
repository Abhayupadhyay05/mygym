import { z } from 'zod'

export const notificationInputSchema = z.object({
  memberNumber: z.string().trim().min(1).max(50),
  subject: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(4000),
})

export const notificationSchema = z.object({
  id: z.string().uuid(),
  subject: z.string(),
  body: z.string(),
  status: z.enum(['PENDING', 'SENT', 'FAILED', 'READ']),
  channel: z.enum(['IN_APP', 'EMAIL', 'WHATSAPP']),
  created_at: z.string(),
  read_at: z.string().nullable(),
  member: z.object({
    member_number: z.string(),
    full_name: z.string(),
  }).nullable(),
})
