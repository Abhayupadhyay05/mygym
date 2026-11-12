import { z } from 'zod'

export const adminDashboardSummarySchema = z.object({
  total_members: z.coerce.number().int().nonnegative(),
  active_members: z.coerce.number().int().nonnegative(),
  expired_members: z.coerce.number().int().nonnegative(),
  expiring_soon: z.coerce.number().int().nonnegative(),
  today_attendance: z.coerce.number().int().nonnegative(),
  today_revenue: z.coerce.number().finite().nonnegative(),
  monthly_revenue: z.coerce.number().finite().nonnegative(),
})
