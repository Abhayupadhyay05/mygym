import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { getServiceRoleEnv } from '@/lib/env.server'

export function createAdminClient() {
  const { supabaseUrl, serviceRoleKey } = getServiceRoleEnv()
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  })
}
