import type { Metadata } from 'next'
import { requireRole } from '@/lib/auth/authorization'
import { attendanceRecordSchema } from '@/lib/validations/attendance'
import { AttendanceCheckInForm } from './check-in-form'

export const metadata: Metadata = { title: 'Attendance' }

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium',
  timeZone: 'Asia/Kolkata',
})
const timeFormatter = new Intl.DateTimeFormat('en-IN', {
  timeStyle: 'short',
  timeZone: 'Asia/Kolkata',
})

function localGymDate() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const dateParts = Object.fromEntries(parts.map(({ type, value }) => [type, value]))
  return `${dateParts.year}-${dateParts.month}-${dateParts.day}`
}

export default async function AttendancePage() {
  const { supabase } = await requireRole(['OWNER', 'RECEPTIONIST'])
  const today = localGymDate()
  const { data, error } = await supabase
    .from('attendance')
    .select('id, attendance_date, checked_in_at, member:members!inner(member_number, full_name)')
    .eq('attendance_date', today)
    .order('checked_in_at', { ascending: false })
    .range(0, 49)

  if (error) {
    throw new Error('Unable to load today’s attendance.')
  }
  const records = attendanceRecordSchema.array().safeParse(data)
  if (!records.success) {
    throw new Error('Attendance returned an unexpected response.')
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#00FF87]">Gym operations</p>
        <h1 className="mt-2 text-3xl font-bold">Attendance</h1>
        <p className="mt-2 text-muted-foreground">{dateFormatter.format(new Date(`${today}T00:00:00+05:30`))} · {records.data.length} recent check-ins</p>
      </div>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-7" aria-labelledby="check-in-heading">
        <h2 id="check-in-heading" className="text-lg font-semibold">Record a check-in</h2>
        <p className="mb-5 mt-1 text-sm text-muted-foreground">
          Only active members with an active membership today can check in. A member can check in once per gym day.
        </p>
        <AttendanceCheckInForm />
      </section>

      <section className="space-y-4" aria-labelledby="today-attendance-heading">
        <div>
          <h2 id="today-attendance-heading" className="text-xl font-semibold">Today’s check-ins</h2>
          <p className="mt-1 text-sm text-muted-foreground">Showing up to 50 check-ins for the current Asia/Kolkata day.</p>
        </div>
        {records.data.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-muted-foreground">
            No check-ins have been recorded today.
          </div>
        ) : (
          <ul className="divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10">
            {records.data.map((record) => (
              <li key={record.id} className="flex flex-wrap items-center justify-between gap-3 bg-white/[0.02] px-4 py-4">
                <div>
                  <p className="font-medium">{record.member.full_name}</p>
                  <p className="text-xs text-muted-foreground">{record.member.member_number}</p>
                </div>
                <time dateTime={record.checked_in_at} className="text-sm text-muted-foreground">
                  {timeFormatter.format(new Date(record.checked_in_at))}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
