'use server'

import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth/authorization'
import { memberAccountLinkSchema } from '@/lib/validations/account-link'

export type AccountLinkActionState = {
  status: 'idle' | 'error' | 'success'
  message: string
}

function getText(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

export async function linkMemberAccountAction(
  _previousState: AccountLinkActionState,
  formData: FormData,
): Promise<AccountLinkActionState> {
  const { supabase } = await requireRole(['OWNER'])
  const parsed = memberAccountLinkSchema.safeParse({
    memberId: getText(formData, 'memberId'),
    profileId: getText(formData, 'profileId'),
  })

  if (!parsed.success) {
    return { status: 'error', message: 'Select a valid member and MEMBER account.' }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', parsed.data.profileId)
    .eq('role', 'MEMBER')
    .eq('is_active', true)
    .maybeSingle()
  if (profileError) {
    return { status: 'error', message: 'Unable to verify that account. Please try again.' }
  }
  if (!profile) {
    return { status: 'error', message: 'Choose an active account with the MEMBER role.' }
  }

  const { data, error } = await supabase
    .from('members')
    .update({ profile_id: profile.id })
    .eq('id', parsed.data.memberId)
    .is('profile_id', null)
    .select('id')
    .maybeSingle()

  if (error || !data) {
    return {
      status: 'error',
      message: error?.code === '23505'
        ? 'That account is already linked to another member.'
        : 'This member is already linked or could not be found. Refresh and try again.',
    }
  }

  revalidatePath('/admin/members')
  revalidatePath(`/admin/members/${data.id}/edit`)
  revalidatePath('/member')
  return { status: 'success', message: 'Member account linked.' }
}
