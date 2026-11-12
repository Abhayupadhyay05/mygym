'use server'

import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth/authorization'
import { profileSettingsSchema } from '@/lib/validations/settings'

export type ProfileSettingsActionState = {
  status: 'idle' | 'error' | 'success'
  message: string
}

export async function saveProfileSettingsAction(
  _previousState: ProfileSettingsActionState,
  formData: FormData,
): Promise<ProfileSettingsActionState> {
  const { supabase, user } = await requireRole(['OWNER'])
  const fullName = formData.get('fullName')
  const phone = formData.get('phone')
  const parsed = profileSettingsSchema.safeParse({
    fullName: typeof fullName === 'string' ? fullName : '',
    phone: typeof phone === 'string' ? phone : '',
  })

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? 'Check your profile details and try again.',
    }
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone || null,
    })
    .eq('id', user.id)
    .select('id')
    .maybeSingle()
  if (error) {
    return { status: 'error', message: 'Unable to save profile settings. Please try again.' }
  }

  if (!data) {
    return { status: 'error', message: 'Your profile could not be updated. Refresh and try again.' }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/settings')
  return { status: 'success', message: 'Profile settings saved.' }
}
