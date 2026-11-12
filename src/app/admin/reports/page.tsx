import type { Metadata } from 'next'
import { requireRole } from '@/lib/auth/authorization'
import { monthlyReportRowSchema, reportPeriodSchema } from '@/lib/validations/report'

export const metadata: Metadata = { title: 'Reports' }

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
const monthFormatter = new Intl.DateTimeFormat('en-IN', { month: 'short', year: '2-digit', timeZone: 'UTC' })

type SearchParams = Record<string, string | string[] | undefined>

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function ReportsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const rawParams = await searchParams
  const parsedPeriod = reportPeriodSchema.safeParse(firstValue(rawParams.months) ?? '12')
  if (!parsedPeriod.success) {
    throw new Error('Choose a supported report period.')
  }

  const { supabase } = await requireRole(['OWNER', 'RECEPTIONIST'])
  const { data, error } = await supabase.rpc('admin_monthly_report', { p_months: parsedPeriod.data })
  if (error) {
    throw new Error('Unable to load monthly reports. Confirm the database migration has been applied.')
  }
  const report = monthlyReportRowSchema.array().safeParse(data)
  if (!report.success) {
    throw new Error('The monthly report returned an unexpected response.')
  }

  const totals = report.data.reduce((sum, month) => ({
    paidRevenue: sum.paidRevenue + month.paid_revenue,
    newMembers: sum.newMembers + month.new_members,
    attendanceVisits: sum.attendanceVisits + month.attendance_visits,
  }), { paidRevenue: 0, newMembers: 0, attendanceVisits: 0 })
  const maxRevenue = Math.max(1, ...report.data.map((month) => month.paid_revenue))

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#00FF87]">Gym analytics</p>
          <h1 className="mt-2 text-3xl font-bold">Monthly reports</h1>
          <p className="mt-2 text-muted-foreground">Paid transaction totals, member sign-ups, and recorded attendance.</p>
        </div>
        <form method="get" className="flex items-center gap-2">
          <label htmlFor="months" className="text-sm text-muted-foreground">Period</label>
          <select id="months" name="months" defaultValue={String(parsedPeriod.data)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground">
            <option value="6">6 months</option>
            <option value="12">12 months</option>
            <option value="24">24 months</option>
          </select>
          <button type="submit" className="h-10 rounded-lg border border-border px-3 text-sm hover:bg-muted">Apply</button>
        </form>
      </div>

      <section className="grid gap-4 sm:grid-cols-3" aria-label="Period totals">
        <article className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-muted-foreground">Paid revenue</p>
          <p className="mt-3 text-2xl font-semibold">{currency.format(totals.paidRevenue)}</p>
        </article>
        <article className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-muted-foreground">New members</p>
          <p className="mt-3 text-2xl font-semibold">{totals.newMembers.toLocaleString('en-IN')}</p>
        </article>
        <article className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-muted-foreground">Attendance visits</p>
          <p className="mt-3 text-2xl font-semibold">{totals.attendanceVisits.toLocaleString('en-IN')}</p>
        </article>
      </section>

      <section className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-7" aria-labelledby="revenue-trend">
        <div>
          <h2 id="revenue-trend" className="text-lg font-semibold">Paid revenue trend</h2>
          <p className="mt-1 text-sm text-muted-foreground">Only payments with PAID status are included; refund adjustments are not included.</p>
        </div>
        <div className="overflow-x-auto">
          <div className="flex min-w-[640px] items-end gap-3 border-b border-white/10 pb-3" role="img" aria-label={`Monthly paid revenue for ${parsedPeriod.data} months`}>
            {report.data.map((month) => {
              const label = monthFormatter.format(new Date(`${month.month_start}T00:00:00Z`))
              const height = month.paid_revenue > 0 ? Math.max(4, Math.round((month.paid_revenue / maxRevenue) * 144)) : 2
              return (
                <div key={month.month_start} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2">
                  <span className="max-w-full truncate text-[10px] text-muted-foreground">{currency.format(month.paid_revenue)}</span>
                  <div className="w-full rounded-t bg-[#00FF87]" style={{ height }} aria-hidden="true" />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <caption className="sr-only">Monthly revenue, new member, and attendance totals</caption>
            <thead className="text-muted-foreground">
              <tr>
                <th scope="col" className="px-3 py-2 font-medium">Month</th>
                <th scope="col" className="px-3 py-2 font-medium">Paid revenue</th>
                <th scope="col" className="px-3 py-2 font-medium">New members</th>
                <th scope="col" className="px-3 py-2 font-medium">Attendance visits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {report.data.map((month) => (
                <tr key={month.month_start}>
                  <td className="px-3 py-3">{monthFormatter.format(new Date(`${month.month_start}T00:00:00Z`))}</td>
                  <td className="px-3 py-3">{currency.format(month.paid_revenue)}</td>
                  <td className="px-3 py-3">{month.new_members.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-3">{month.attendance_visits.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
