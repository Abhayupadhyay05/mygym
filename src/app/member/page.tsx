import { requireRole } from '@/lib/auth/authorization'
import Link from 'next/link'
import { z } from 'zod'
import { WHATSAPP_DEFAULT_MESSAGE, WHATSAPP_NUMBER } from '@/lib/constants'
import {
  memberDashboardAttendanceSchema,
  memberDashboardMemberSchema,
  memberDashboardMembershipSchema,
  memberDashboardNotificationSchema,
  memberDashboardPaymentSchema,
  memberDashboardTrainerSchema,
} from '@/lib/validations/member-dashboard'
import { NotificationReadForm } from './notification-read-form'
import { RazorpayPaymentButton } from './payments/razorpay-payment-button'
import { isRazorpayConfigured, isServiceRoleConfigured } from '@/lib/env.server'

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })
const dateTime = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' })
const dateOnly = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' })

function formatGymDate(value: string) {
  return dateOnly.format(new Date(`${value}T00:00:00+05:30`))
}

export default async function MemberDashboardPage() {
  const { supabase, user } = await requireRole(['MEMBER'])
  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('id, member_number, status, joined_at, full_name, email, phone')
    .eq('profile_id', user.id)
    .maybeSingle()

  if (memberError) {
    throw new Error('Unable to load your gym profile.')
  }

  if (!member) {
    return (
      <section className="mx-auto max-w-2xl rounded-xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <h1 className="text-2xl font-bold">Welcome to your member portal</h1>
        <p className="mt-3 text-muted-foreground">
          Your sign-in is ready, but it has not been linked to a gym membership yet. Please contact reception to connect your account.
        </p>
      </section>
    )
  }
  const parsedMember = memberDashboardMemberSchema.safeParse(member)
  if (!parsedMember.success) {
    throw new Error('Your member profile returned an unexpected response.')
  }

  const [membershipResult, paymentResult, attendanceResult, assignmentResult, notificationResult] = await Promise.all([
    supabase
      .from('memberships')
      .select('id, status, starts_on, ends_on, amount')
      .eq('member_id', member.id)
      .order('starts_on', { ascending: false })
      .limit(10),
    supabase
      .from('payments')
      .select('id, amount, currency, status, method, paid_at, created_at')
      .eq('member_id', member.id)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('attendance')
      .select('id, attendance_date, checked_in_at')
      .eq('member_id', member.id)
      .order('checked_in_at', { ascending: false })
      .limit(10),
    supabase
      .from('trainer_assignments')
      .select('trainer_id')
      .eq('member_id', member.id)
      .is('ended_at', null)
      .limit(10),
    supabase
      .from('notifications')
      .select('id, subject, body, status, channel, created_at, read_at')
      .eq('member_id', member.id)
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  if (membershipResult.error || paymentResult.error || attendanceResult.error || assignmentResult.error || notificationResult.error) {
    throw new Error('Unable to load your membership activity.')
  }

  const memberships = memberDashboardMembershipSchema.array().safeParse(membershipResult.data)
  const payments = memberDashboardPaymentSchema.array().safeParse(paymentResult.data)
  const attendance = memberDashboardAttendanceSchema.array().safeParse(attendanceResult.data)
  const notifications = memberDashboardNotificationSchema.array().safeParse(notificationResult.data)
  if (!memberships.success || !payments.success || !attendance.success || !notifications.success) {
    throw new Error('Your account returned data in an unexpected format.')
  }

  const trainerIds = assignmentResult.data.map((assignment) => assignment.trainer_id)
  let trainers: z.infer<typeof memberDashboardTrainerSchema>[] = []
  if (trainerIds.length > 0) {
    const { data, error } = await supabase
      .from('trainers')
      .select('id, display_name, specialties')
      .in('id', trainerIds)
    if (error) {
      throw new Error('Unable to load your trainer information.')
    }
    const parsedTrainers = memberDashboardTrainerSchema.array().safeParse(data)
    if (!parsedTrainers.success) {
      throw new Error('Your trainer information returned an unexpected format.')
    }
    trainers = parsedTrainers.data
  }

  const currentMembership = memberships.data.find((item) => item.status === 'ACTIVE')
  const pendingMembership = memberships.data.find((item) => item.status === 'PENDING')
  const onlinePaymentConfigured = isRazorpayConfigured() && isServiceRoleConfigured()
  const memberProfile = parsedMember.data

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#00FF87]">Member portal</p>
        <h1 className="mt-2 text-3xl font-bold">Your membership</h1>
        <p className="mt-2 text-muted-foreground">Member number: {memberProfile.member_number}</p>
      </div>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5" aria-labelledby="member-profile">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 id="member-profile" className="font-semibold">Your profile</h2>
            <dl className="mt-3 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
              <div><dt className="text-muted-foreground">Name</dt><dd>{memberProfile.full_name}</dd></div>
              <div><dt className="text-muted-foreground">Email</dt><dd>{memberProfile.email ?? 'Not provided'}</dd></div>
              <div><dt className="text-muted-foreground">Phone</dt><dd>{memberProfile.phone}</dd></div>
            </dl>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-[#00FF87]/50 px-4 py-2 text-sm font-medium text-[#00FF87] hover:bg-[#00FF87]/10"
          >
            Contact gym on WhatsApp
          </a>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2" aria-label="Membership details">
        <article className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="font-semibold">Current membership</h2>
          {currentMembership ? (
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Status</dt><dd>{currentMembership.status}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Starts</dt><dd>{formatGymDate(currentMembership.starts_on)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Expires</dt><dd>{formatGymDate(currentMembership.ends_on)}</dd></div>
            </dl>
          ) : pendingMembership ? (
            <div className="mt-3 space-y-3">
              <p className="text-sm text-amber-300">A membership is waiting for payment.</p>
              <p className="text-sm text-muted-foreground">
                Scheduled period: {formatGymDate(pendingMembership.starts_on)} – {formatGymDate(pendingMembership.ends_on)}
              </p>
              <p className="text-sm font-medium">{currency.format(pendingMembership.amount)}</p>
              {onlinePaymentConfigured ? (
                <RazorpayPaymentButton membershipId={pendingMembership.id} />
              ) : (
                <p className="text-sm text-muted-foreground">Online payments are not configured yet. Please contact reception.</p>
              )}
            </div>
          ) : <p className="mt-3 text-sm text-muted-foreground">No active membership is linked to your account.</p>}
        </article>
        <article className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="font-semibold">Assigned trainers</h2>
          {trainers.length ? (
            <ul className="mt-3 space-y-3">
              {trainers.map((trainer) => (
                <li key={trainer.id}>
                  <p>{trainer.display_name}</p>
                  {trainer.specialties.length > 0 && <p className="text-sm text-muted-foreground">{trainer.specialties.join(', ')}</p>}
                </li>
              ))}
            </ul>
          ) : <p className="mt-3 text-sm text-muted-foreground">No trainer assignment is linked yet.</p>}
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="font-semibold">Recent payments</h2>
          {payments.data.length ? (
            <ul className="mt-4 divide-y divide-white/10">
              {payments.data.map((payment) => (
                <li key={payment.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <span>{payment.paid_at ? dateTime.format(new Date(payment.paid_at)) : 'Payment pending'}</span>
                  <span className="text-right">
                    <span className="block">{currency.format(payment.amount)} · {payment.status}</span>
                    {payment.status === 'PAID' && (
                      <Link href={`/member/payments/${payment.id}/receipt`} className="mt-1 inline-block text-[#00FF87] hover:underline">
                        View receipt
                      </Link>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          ) : <p className="mt-3 text-sm text-muted-foreground">No payment history is available.</p>}
        </article>
        <article className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="font-semibold">Recent attendance</h2>
          {attendance.data.length ? (
            <ul className="mt-4 divide-y divide-white/10">
              {attendance.data.map((visit) => (
                <li key={visit.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <span>{formatGymDate(visit.attendance_date)}</span>
                  <span className="text-muted-foreground">{dateTime.format(new Date(visit.checked_in_at))}</span>
                </li>
              ))}
            </ul>
          ) : <p className="mt-3 text-sm text-muted-foreground">No attendance history is available.</p>}
        </article>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5" aria-labelledby="member-notifications">
        <h2 id="member-notifications" className="font-semibold">Notifications</h2>
        {notifications.data.length ? (
          <ul className="mt-4 divide-y divide-white/10">
            {notifications.data.map((notification) => (
              <li key={notification.id} className="flex flex-wrap items-start justify-between gap-4 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium">{notification.subject}</h3>
                    <span className="text-xs text-muted-foreground">{notification.status}</span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{notification.body}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{dateTime.format(new Date(notification.created_at))}</p>
                </div>
                {notification.status !== 'READ' && <NotificationReadForm notificationId={notification.id} />}
              </li>
            ))}
          </ul>
        ) : <p className="mt-3 text-sm text-muted-foreground">No notifications are available.</p>}
      </section>
    </div>
  )
}
