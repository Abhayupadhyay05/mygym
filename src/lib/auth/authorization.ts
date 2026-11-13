import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import { z } from 'zod'
import { isSupabaseConfigured } from '@/lib/env'
import { createClient } from '@/lib/supabase/server'

export const appRoleSchema = z.enum(['OWNER', 'RECEPTIONIST', 'TRAINER', 'MEMBER'])
export type AppRole = z.infer<typeof appRoleSchema>

export function getActiveAppRole(profile: { role: unknown; is_active: boolean } | null) {
  if (!profile || profile.is_active !== true) {
    return null
  }

  const role = appRoleSchema.safeParse(profile.role)
  return role.success ? role.data : null
}

export async function requireRole(allowedRoles: readonly AppRole[]) {
  await connection()

  if (!isSupabaseConfigured()) {
    redirect('/login?configuration=required')
  }

  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect('/login')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, role, is_active')
    .eq('id', user.id)
    .single()

  const role = getActiveAppRole(profile)
  if (profileError || !profile || !role) {
    redirect('/login?error=profile')
  }
  if (!allowedRoles.includes(role)) {
    redirect(role === 'MEMBER' ? '/member' : role === 'TRAINER' ? '/trainer' : '/admin')
  }

  return { supabase, user, profile, role }
}
