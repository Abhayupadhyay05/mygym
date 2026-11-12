import { z } from 'zod'

export const attendanceCheckInInputSchema = z.object({
  memberNumber: z.string().trim().min(1, 'Enter a member number.').max(50),
})

export const attendanceRecordSchema = z.object({
  id: z.string().uuid(),
  attendance_date: z.string(),
  checked_in_at: z.string(),
  member: z.object({
    member_number: z.string(),
    full_name: z.string(),
  }),
})
