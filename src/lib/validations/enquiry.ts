import { z } from 'zod'

const emailInput = z.string().trim().max(254).refine(
  (value) => value === '' || z.email().safeParse(value).success,
  'Enter a valid email address.',
)

const phoneInput = z.string().trim()
  .min(8, 'Phone number must have at least 8 characters.')
  .max(32)
  .regex(/^[+\d\s().-]+$/, 'Enter a valid phone number.')

export const enquiryInputSchema = z.object({
  fullName: z.string().trim().min(1, 'Enter a name.').max(160),
  email: emailInput,
  phone: phoneInput,
  message: z.string().trim().max(4000),
})

export const enquiryUpdateInputSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['NEW', 'CONTACTED', 'FOLLOW_UP', 'CONVERTED', 'CLOSED']),
  followUpAt: z.string().refine(
    (value) => value === '' || (
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)
      && Number.isFinite(Date.parse(`${value}:00+05:30`))
    ),
    'Enter a valid follow-up date and time.',
  ),
  assignedTo: z.enum(['true', 'false', 'keep']),
  memberNumber: z.string().trim().max(50),
}).refine(
  (enquiry) => enquiry.status !== 'CONVERTED' || enquiry.memberNumber.length > 0,
  { path: ['memberNumber'], message: 'Enter the member number to link when converting.' },
)

export const enquirySchema = z.object({
  id: z.string().uuid(),
  full_name: z.string(),
  email: z.string().nullable(),
  phone: z.string(),
  message: z.string().nullable(),
  status: z.enum(['NEW', 'CONTACTED', 'FOLLOW_UP', 'CONVERTED', 'CLOSED']),
  follow_up_at: z.string().nullable(),
  converted_member_id: z.string().uuid().nullable(),
  assigned_to: z.string().uuid().nullable(),
  created_at: z.string(),
  converted_member: z.object({
    member_number: z.string(),
    full_name: z.string(),
  }).nullable(),
})
