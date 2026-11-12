'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Dumbbell, Eye, EyeOff, Lock, Mail, Phone } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ACCENT_COLOR, GYM_NAME } from '@/lib/constants'
import { isSupabaseConfigured } from '@/lib/env'
import { createClient } from '@/lib/supabase/client'
import { passwordResetRequestSchema, phoneOtpRequestSchema, phoneOtpVerifySchema, signInSchema } from '@/lib/validations/auth'

export default function LoginClient() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [formMessage, setFormMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const configured = isSupabaseConfigured()

  async function redirectSignedInUser() {
    const supabase = createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      setFormMessage('Your sign-in could not be verified. Please try again.')
      return
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (error || !profile) {
      setFormMessage('Your account profile is not ready yet. Please contact the gym.')
      return
    }

    const destination = profile.role === 'OWNER' || profile.role === 'RECEPTIONIST'
      ? '/admin'
      : profile.role === 'TRAINER'
        ? '/trainer'
        : '/member'
    router.replace(destination)
    router.refresh()
  }

  async function handleEmailSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormMessage('')
    const formData = new FormData(event.currentTarget)
    const parsed = signInSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    })
    if (!parsed.success) {
      setFormMessage(parsed.error.issues[0]?.message ?? 'Check your email and password.')
      return
    }
    if (!configured) {
      setFormMessage('Account services are not configured yet.')
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await createClient().auth.signInWithPassword(parsed.data)
      if (error) {
        setFormMessage('Unable to sign in with those details. Please check them and try again.')
        return
      }
      await redirectSignedInUser()
    } catch {
      setFormMessage('Sign-in is temporarily unavailable. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleGoogleSignIn() {
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
        setFormMessage('Google sign-in is unavailable. Please try email or phone sign-in.')
      }
    } catch {
      setFormMessage('Google sign-in is unavailable. Please try email or phone sign-in.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSendOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormMessage('')
    const parsed = phoneOtpRequestSchema.safeParse({ phone })
    if (!parsed.success) {
      setFormMessage(parsed.error.issues[0]?.message ?? 'Enter a valid phone number.')
      return
    }
    if (!configured) {
      setFormMessage('Account services are not configured yet.')
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await createClient().auth.signInWithOtp({
        phone: parsed.data.phone,
        options: { shouldCreateUser: false },
      })
      if (error) {
        setFormMessage('Could not send a code. Verify the number and SMS provider configuration.')
        return
      }
      setOtpSent(true)
      setFormMessage('A verification code was sent if this number is registered.')
    } catch {
      setFormMessage('Could not send a code. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleVerifyOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormMessage('')
    const parsed = phoneOtpVerifySchema.safeParse({ phone, token: otp })
    if (!parsed.success) {
      setFormMessage(parsed.error.issues[0]?.message ?? 'Enter the verification code.')
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await createClient().auth.verifyOtp({
        phone: parsed.data.phone,
        token: parsed.data.token,
        type: 'sms',
      })
      if (error) {
        setFormMessage('That code could not be verified. Request a new one and try again.')
        return
      }
      await redirectSignedInUser()
    } catch {
      setFormMessage('Phone sign-in is temporarily unavailable. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handlePasswordReset() {
    setFormMessage('')
    const email = passwordResetRequestSchema.safeParse({
      email: (document.getElementById('email') as HTMLInputElement | null)?.value ?? '',
    })
    if (!email.success) {
      setFormMessage('Enter your email above, then choose Forgot password.')
      return
    }
    if (!configured) {
      setFormMessage('Account services are not configured yet.')
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await createClient().auth.resetPasswordForEmail(email.data.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      })
      setFormMessage(error
        ? 'Password recovery is unavailable right now. Please contact the gym.'
        : 'If an account exists for that email, password recovery instructions have been sent.')
    } catch {
      setFormMessage('Password recovery is temporarily unavailable. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2" aria-label="Go to homepage">
            <Dumbbell className="h-10 w-10 text-[#00FF87]" aria-hidden="true" />
            <span className="font-heading text-2xl font-bold tracking-tight text-foreground">{GYM_NAME}</span>
          </Link>
        </div>

        <Card className="glass-dark border border-white/10">
          <CardHeader className="text-center pb-6">
            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
            <CardDescription className="text-muted-foreground mt-2">Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!configured && (
              <p className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200" role="status">
                Account services are not configured. Add the Supabase project settings to the local environment to enable sign-in.
              </p>
            )}

            <Button type="button" variant="outline" className="w-full gap-2" onClick={handleGoogleSignIn} disabled={!configured || isSubmitting}>
              <span className="font-bold" aria-hidden="true">G</span>
              Continue with Google
            </Button>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0A0A0A] px-2 text-xs text-muted-foreground">Or continue with email</span>
            </div>

            <form onSubmit={handleEmailSignIn} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className="pl-10" required />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                  <button type="button" onClick={handlePasswordReset} disabled={!configured || isSubmitting} className="text-sm text-[#00FF87] hover:underline disabled:opacity-50">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Password" className="pl-10 pr-10" required minLength={8} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full h-12 text-lg font-semibold" style={{ backgroundColor: ACCENT_COLOR, color: '#0A0A0A' }} disabled={!configured || isSubmitting}>
                {isSubmitting ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0A0A0A] px-2 text-xs text-muted-foreground">Or use a one-time code</span>
            </div>

            {otpSent ? (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <Label htmlFor="otp">6-digit verification code</Label>
                <Input id="otp" value={otp} onChange={(event) => setOtp(event.target.value)} inputMode="numeric" autoComplete="one-time-code" maxLength={6} required />
                <Button type="submit" variant="outline" className="w-full" disabled={isSubmitting}>Verify code</Button>
              </form>
            ) : (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <Label htmlFor="phone">Mobile number (international format)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input id="phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+919876543210" className="pl-10" required />
                </div>
                <Button type="submit" variant="outline" className="w-full" disabled={!configured || isSubmitting}>Send verification code</Button>
              </form>
            )}

            {formMessage && <p className="text-sm text-muted-foreground text-center" role="status">{formMessage}</p>}
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account? <Link href="/register" className="text-[#00FF87] hover:underline font-medium">Sign up</Link>
            </p>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-muted-foreground mt-6">
          Need assistance with your account? <Link href="/contact" className="hover:text-[#00FF87] underline">Contact us</Link>.
        </p>
      </motion.div>
    </div>
  )
}
