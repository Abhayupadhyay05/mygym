'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { isSupabaseConfigured } from '@/lib/env'
import { createClient } from '@/lib/supabase/client'
import { newPasswordSchema } from '@/lib/validations/auth'

export default function ResetPasswordClient() {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const configured = isSupabaseConfigured()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    const formData = new FormData(event.currentTarget)
    const parsed = newPasswordSchema.safeParse({
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    })
    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message ?? 'Check the password and try again.')
      return
    }
    if (!configured) {
      setMessage('Account services are not configured yet.')
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await createClient().auth.updateUser({ password: parsed.data.password })
      if (error) {
        setMessage('The recovery link is invalid or expired. Request a new password recovery email.')
        return
      }
      router.replace('/login?password=updated')
      router.refresh()
    } catch {
      setMessage('Password update is temporarily unavailable. Request a new recovery link and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="glass-dark w-full max-w-md border border-white/10">
        <CardHeader>
          <h1 className="text-2xl font-bold">Choose a new password</h1>
          <CardDescription>Use at least 8 characters. The recovery link must be valid.</CardDescription>
        </CardHeader>
        <CardContent>
          {!configured && <p className="mb-4 text-sm text-amber-200" role="status">Account services are not configured.</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} maxLength={128} required />
            </div>
            <Button className="w-full" type="submit" disabled={!configured || isSubmitting}>
              {isSubmitting ? 'Updating…' : 'Update password'}
            </Button>
          </form>
          {message && <p className="mt-4 text-sm text-center text-muted-foreground" role="status">{message}</p>}
        </CardContent>
      </Card>
    </main>
  )
}
