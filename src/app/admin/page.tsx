import { Activity, CalendarClock, IndianRupee, UserCheck, Users, UserX } from 'lucide-react'
import { requireRole } from '@/lib/auth/authorization'
import { adminDashboardSummarySchema } from '@/lib/validations/dashboard'

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export default async function AdminDashboardPage() {
  const { supabase } = await requireRole(['OWNER', 'RECEPTIONIST'])
  const { data, error } = await supabase.rpc('admin_dashboard_summary')
  if (error) {
    throw new Error('Unable to load dashboard metrics. Confirm the database migration has been applied.')
  }

  const result = adminDashboardSummarySchema.array().safeParse(data)
  if (!result.success || !result.data[0]) {
    throw new Error('The dashboard returned an unexpected metrics response.')
  }
  const metrics = result.data[0]
  const cards = [
    { title: 'Total members', value: metrics.total_members.toLocaleString('en-IN'), icon: Users },
    { title: 'Active memberships', value: metrics.active_members.toLocaleString('en-IN'), icon: UserCheck },
    { title: 'Expired memberships', value: metrics.expired_members.toLocaleString('en-IN'), icon: UserX },
    { title: 'Expiring in 7 days', value: metrics.expiring_soon.toLocaleString('en-IN'), icon: CalendarClock },
    { title: "Today's attendance", value: metrics.today_attendance.toLocaleString('en-IN'), icon: Activity },
    { title: "Today's revenue", value: currency.format(metrics.today_revenue), icon: IndianRupee },
    { title: 'Monthly revenue', value: currency.format(metrics.monthly_revenue), icon: IndianRupee },
  ]

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#00FF87]">Overview</p>
        <h1 className="mt-2 text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">A live summary of gym activity and membership status.</p>
      </div>
      <section aria-label="Gym metrics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ title, value, icon: Icon }) => (
          <article key={title} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">{title}</p>
              <Icon className="h-5 w-5 text-[#00FF87]" aria-hidden="true" />
            </div>
            <p className="mt-4 text-2xl font-semibold text-foreground">{value}</p>
          </article>
        ))}
      </section>
    </div>
  )
}
