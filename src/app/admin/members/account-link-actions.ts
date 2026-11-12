'use server'

import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth/authorization'
import {
  memberAccountLinkResultSchema,
  memberAccountLinkSchema,
} from '@/lib/validations/account-link'

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

  const { data, error } = await supabase.rpc('link_member_account', {
    target_member_id: parsed.data.memberId,
    target_profile_id: parsed.data.profileId,
  })
  const linkedMember = memberAccountLinkResultSchema.safeParse(data)
  if (error || !linkedMember.success) {
    return {
      status: 'error',
      message: error?.code === '23505'
        ? 'That account is already linked to another member.'
        : error?.code === 'P0002'
          ? 'Choose an active MEMBER account and an unlinked active member.'
          : 'Unable to link this account. Refresh and try again.',
    }
  }

  revalidatePath('/admin/members')
  revalidatePath(`/admin/members/${linkedMember.data}/edit`)
  revalidatePath('/member')
  return { status: 'success', message: 'Member account linked.' }
}
