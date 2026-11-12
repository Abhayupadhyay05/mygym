import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import { z } from 'zod'
import { isSupabaseConfigured } from '@/lib/env'
import { createClient } from '@/lib/supabase/server'

export const appRoleSchema = z.enum(['OWNER', 'RECEPTIONIST', 'TRAINER', 'MEMBER'])
export type AppRole = z.infer<typeof appRoleSchema>

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
    .select('id, full_name, role')
    .eq('id', user.id)
    .single()

  const role = appRoleSchema.safeParse(profile?.role)
  if (profileError || !profile || !role.success) {
    redirect('/login?error=profile')
  }
  if (!allowedRoles.includes(role.data)) {
    redirect(role.data === 'MEMBER' ? '/member' : role.data === 'TRAINER' ? '/trainer' : '/admin')
  }

  return { supabase, user, profile, role: role.data }
}
