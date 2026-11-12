'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Dumbbell, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ACCENT_COLOR, GYM_NAME } from '@/lib/constants'
import { isSupabaseConfigured } from '@/lib/env'
import { createClient } from '@/lib/supabase/client'
import { registrationSchema } from '@/lib/validations/auth'

export default function RegisterClient() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formMessage, setFormMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const configured = isSupabaseConfigured()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormMessage('')
    const values = Object.fromEntries(new FormData(event.currentTarget))
    const parsed = registrationSchema.safeParse(values)
    if (!parsed.success) {
      setFormMessage(parsed.error.issues[0]?.message ?? 'Check the information and try again.')
      return
    }
    if (!configured) {
      setFormMessage('Account services are not configured yet.')
      return
    }

    setIsSubmitting(true)
    try {
      const { data, error } = await createClient().auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          data: {
            full_name: `${parsed.data.firstName} ${parsed.data.lastName}`,
            phone: parsed.data.phone || null,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setFormMessage('Account creation failed. Check the details or contact the gym for help.')
        return
      }
      if (!data.session) {
        setFormMessage('Check your email for a confirmation link to finish creating your account.')
        return
      }

      router.replace('/member')
      router.refresh()
    } catch {
      setFormMessage('Account creation is temporarily unavailable. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleGoogleSignUp() {
    setFormMessage('')
    if (!configured) {
      setFormMessage('Account services are not configured yet.')
      return
    }
    setIsSubmitting(true)
    try {
      const { error } = await createClient().auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) {
        setFormMessage('Google sign-up is unavailable. Please use email registration.')
      }
    } catch {
      setFormMessage('Google sign-up is unavailable. Please use email registration.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2" aria-label="Go to homepage">
            <Dumbbell className="h-10 w-10 text-[#00FF87]" aria-hidden="true" />
            <span className="font-heading text-2xl font-bold tracking-tight text-foreground">{GYM_NAME}</span>
          </Link>
        </div>

        <Card className="glass-dark border border-white/10">
          <CardHeader className="text-center pb-6">
            <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
            <CardDescription className="text-muted-foreground mt-2">Join Premium Fitness Gym and start your journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!configured && (
              <p className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200" role="status">
                Account services are not configured. Add the Supabase project settings to the local environment to enable registration.
              </p>
            )}
            <Button type="button" variant="outline" className="w-full gap-2" onClick={handleGoogleSignUp} disabled={!configured || isSubmitting}>
              <span className="font-bold" aria-hidden="true">G</span>
              Continue with Google
            </Button>
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0A0A0A] px-2 text-xs text-muted-foreground">Or register with email</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Input id="firstName" name="firstName" autoComplete="given-name" placeholder="John" className="pl-10" required maxLength={80} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Input id="lastName" name="lastName" autoComplete="family-name" placeholder="Doe" className="pl-10" required maxLength={80} />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className="pl-10" required maxLength={254} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional, international format)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+919876543210" className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Create a password" className="pl-10 pr-10" required minLength={8} maxLength={128} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Use at least 8 characters.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Confirm your password" className="pl-10 pr-10" required minLength={8} maxLength={128} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full h-12 text-lg font-semibold" style={{ backgroundColor: ACCENT_COLOR, color: '#0A0A0A' }} disabled={!configured || isSubmitting}>
                {isSubmitting ? 'Creating account…' : 'Create Account'}
              </Button>
            </form>
            {formMessage && <p className="text-sm text-muted-foreground text-center" role="status">{formMessage}</p>}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account? <Link href="/login" className="text-[#00FF87] hover:underline font-medium">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
