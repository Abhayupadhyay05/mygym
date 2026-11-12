import { NextResponse, type NextRequest } from 'next/server'
import { isSupabaseConfigured } from '@/lib/env'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const recovery = searchParams.get('next') === '/reset-password'

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL('/login?configuration=required', origin))
  }
  if (!code) {
    return NextResponse.redirect(new URL('/login?error=callback', origin))
  }

  const supabase = await createClient()
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
  if (exchangeError) {
    return NextResponse.redirect(new URL('/login?error=callback', origin))
  }

  if (recovery) {
    return NextResponse.redirect(new URL('/reset-password', origin))
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return NextResponse.redirect(new URL('/login?error=callback', origin))
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return NextResponse.redirect(new URL('/login?error=profile', origin))
  }

  const destination = profile.role === 'OWNER' || profile.role === 'RECEPTIONIST'
    ? '/admin'
    : profile.role === 'TRAINER'
      ? '/trainer'
      : '/member'
  return NextResponse.redirect(new URL(destination, origin))
}
