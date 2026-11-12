'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export function SignOutButton() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleSignOut() {
    setErrorMessage('')
    setIsSigningOut(true)
    try {
      const { error } = await createClient().auth.signOut()
      if (error) {
        setErrorMessage('Sign-out failed. Please try again.')
        return
      }
      router.replace('/login')
      router.refresh()
    } catch {
      setErrorMessage('Sign-out is temporarily unavailable. Please try again.')
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <div>
      <Button type="button" variant="outline" onClick={handleSignOut} disabled={isSigningOut}>
        {isSigningOut ? 'Signing out…' : 'Sign out'}
      </Button>
      {errorMessage && <p className="mt-2 text-xs text-red-400" role="status">{errorMessage}</p>}
    </div>
  )
}
