import type { Metadata } from 'next'
import { requireRole } from '@/lib/auth/authorization'
import { notificationSchema } from '@/lib/validations/notification'
import { NotificationForm } from './notification-form'

export const metadata: Metadata = { title: 'Notifications' }
export const instant = false

const dateTimeFormatter = new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Kolkata',
})

export default async function NotificationsPage() {
  const { supabase } = await requireRole(['OWNER', 'RECEPTIONIST'])
  const { data, error } = await supabase
    .from('notifications')
    .select('id, subject, body, status, channel, created_at, read_at, member:members(member_number, full_name)')
    .order('created_at', { ascending: false })
    .range(0, 49)

  if (error) {
    throw new Error('Unable to load notifications.')
  }
  const notifications = notificationSchema.array().safeParse(data)
  if (!notifications.success) {
    throw new Error('Notifications returned an unexpected response.')
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#00FF87]">Member communications</p>
        <h1 className="mt-2 text-3xl font-bold">Notifications</h1>
        <p className="mt-2 text-muted-foreground">Create member-portal messages and review recent notification records.</p>
      </div>

      <section className="max-w-2xl rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-7" aria-labelledby="create-notification">
        <h2 id="create-notification" className="mb-5 text-lg font-semibold">New in-app notification</h2>
        <NotificationForm />
      </section>

      <section className="space-y-4" aria-labelledby="recent-notifications">
        <h2 id="recent-notifications" className="text-xl font-semibold">Recent notifications</h2>
        {notifications.data.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-sm text-muted-foreground">No notifications have been created.</div>
        ) : (
          <ul className="space-y-3">
            {notifications.data.map((notification) => (
              <li key={notification.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="font-semibold">{notification.subject}</h3>
                  <span className="text-xs text-muted-foreground">{notification.channel.replaceAll('_', ' ')} · {notification.status}</span>
                </div>
                {notification.member && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    To {notification.member.full_name} ({notification.member.member_number})
                  </p>
                )}
                <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{notification.body}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Created {dateTimeFormatter.format(new Date(notification.created_at))}
                  {notification.read_at && ` · Read ${dateTimeFormatter.format(new Date(notification.read_at))}`}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
