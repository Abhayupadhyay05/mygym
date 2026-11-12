'use server'

import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth/authorization'
import { attendanceCheckInInputSchema } from '@/lib/validations/attendance'

export type AttendanceActionState = {
  status: 'idle' | 'error' | 'success'
  message: string
}

export async function recordAttendanceAction(
  _previousState: AttendanceActionState,
  formData: FormData,
): Promise<AttendanceActionState> {
  const { supabase } = await requireRole(['OWNER', 'RECEPTIONIST'])
  const memberNumber = formData.get('memberNumber')
  const parsed = attendanceCheckInInputSchema.safeParse({
    memberNumber: typeof memberNumber === 'string' ? memberNumber : '',
  })

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? 'Enter a valid member number.',
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

  const { error } = await supabase.from('attendance').insert({ member_id: member.id })
  if (error) {
    return {
      status: 'error',
      message: error.code === '23505'
        ? 'This member has already checked in today.'
        : error.code === '42501'
          ? 'Attendance requires an active membership for today.'
          : 'Unable to record attendance. Please try again.',
    }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/attendance')
  revalidatePath('/member')
  return { status: 'success', message: `Check-in recorded for ${parsed.data.memberNumber}.` }
}
