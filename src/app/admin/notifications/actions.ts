'use server'

import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth/authorization'
import { notificationInputSchema } from '@/lib/validations/notification'

export type NotificationActionState = {
  status: 'idle' | 'error' | 'success'
  message: string
}

function getText(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

export async function createMemberNotificationAction(
  _previousState: NotificationActionState,
  formData: FormData,
): Promise<NotificationActionState> {
  const { supabase } = await requireRole(['OWNER', 'RECEPTIONIST'])
  const parsed = notificationInputSchema.safeParse({
    memberNumber: getText(formData, 'memberNumber'),
    subject: getText(formData, 'subject'),
    body: getText(formData, 'body'),
  })

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? 'Check the notification details and try again.',
    }
  }

  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('id')
    .eq('member_number', parsed.data.memberNumber)
    .eq('status', 'ACTIVE')
    .maybeSingle()
  if (memberError) {
    return { status: 'error', message: 'Unable to verify that member. Please try again.' }
  }
  if (!member) {
    return { status: 'error', message: 'No active member was found with that member number.' }
  }

  const { error } = await supabase.from('notifications').insert({
    member_id: member.id,
    channel: 'IN_APP',
    subject: parsed.data.subject,
    body: parsed.data.body,
  })
  if (error) {
    return { status: 'error', message: 'Unable to create this notification. Please try again.' }
  }

  revalidatePath('/admin/notifications')
  revalidatePath('/member')
  return { status: 'success', message: 'In-app notification queued for the member portal.' }
}

export async function markMemberNotificationReadAction(
  _previousState: NotificationActionState,
  formData: FormData,
): Promise<NotificationActionState> {
  const { supabase, user } = await requireRole(['MEMBER'])
  const notificationId = getText(formData, 'notificationId')
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(notificationId)) {
    return { status: 'error', message: 'Invalid notification.' }
  }

  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('id')
    .eq('profile_id', user.id)
    .maybeSingle()
  if (memberError) {
    return { status: 'error', message: 'Unable to load your member profile.' }
  }
  if (!member) {
    return { status: 'error', message: 'No linked member profile was found.' }
  }

  const { data, error } = await supabase
    .from('notifications')
    .update({ status: 'READ', read_at: new Date().toISOString() })
    .eq('id', notificationId)
    .eq('member_id', member.id)
    .neq('status', 'READ')
    .select('id')
    .maybeSingle()

  if (error) {
    return { status: 'error', message: 'Unable to update this notification. Please try again.' }
  }
  if (!data) {
    return { status: 'success', message: 'Notification is already marked as read.' }
  }

  revalidatePath('/member')
  return { status: 'success', message: 'Notification marked as read.' }
}
