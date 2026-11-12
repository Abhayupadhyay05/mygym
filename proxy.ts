import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getPublicSupabaseEnv, isSupabaseConfigured } from '@/lib/env'

export async function proxy(request: NextRequest) {
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/member') ||
    request.nextUrl.pathname.startsWith('/trainer')

  if (!isSupabaseConfigured()) {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/login?configuration=required', request.url))
    }

    return NextResponse.next({ request })
  }

  const env = getPublicSupabaseEnv()
  let response = NextResponse.next({ request })
  const supabase = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  const { data, error } = await supabase.auth.getClaims()

  if (isProtectedRoute && (error || !data?.claims.sub)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/member/:path*',
    '/trainer/:path*',
    '/auth/:path*',
  ],
}
