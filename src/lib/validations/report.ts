import { z } from 'zod'

export const reportPeriodSchema = z.enum(['6', '12', '24']).transform(Number)

export const monthlyReportRowSchema = z.object({
  month_start: z.string(),
  paid_revenue: z.coerce.number().finite().nonnegative(),
  new_members: z.coerce.number().int().nonnegative(),
  attendance_visits: z.coerce.number().int().nonnegative(),
})
