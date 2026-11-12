import { z } from 'zod'

export const memberDashboardMemberSchema = z.object({
  id: z.string().uuid(),
  member_number: z.string(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
  joined_at: z.string(),
  full_name: z.string(),
  email: z.string().nullable(),
  phone: z.string(),
})

export const memberDashboardMembershipSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED', 'FROZEN']),
  starts_on: z.string(),
  ends_on: z.string(),
  amount: z.coerce.number().finite().nonnegative(),
})

export const memberDashboardPaymentSchema = z.object({
  id: z.string().uuid(),
  amount: z.coerce.number().finite().nonnegative(),
  currency: z.string(),
  status: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED']),
  method: z.string(),
  paid_at: z.string().nullable(),
  created_at: z.string(),
})

export const memberDashboardAttendanceSchema = z.object({
  id: z.string().uuid(),
  attendance_date: z.string(),
  checked_in_at: z.string(),
})

export const memberDashboardNotificationSchema = z.object({
  id: z.string().uuid(),
  subject: z.string(),
  body: z.string(),
  status: z.enum(['PENDING', 'SENT', 'FAILED', 'READ']),
  channel: z.enum(['IN_APP', 'EMAIL', 'WHATSAPP']),
  created_at: z.string(),
  read_at: z.string().nullable(),
})

export const memberDashboardTrainerSchema = z.object({
  id: z.string().uuid(),
  display_name: z.string(),
  specialties: z.array(z.string()),
})

export const trainerMemberSummarySchema = z.object({
  member_id: z.string().uuid(),
  member_number: z.string(),
  full_name: z.string(),
})
