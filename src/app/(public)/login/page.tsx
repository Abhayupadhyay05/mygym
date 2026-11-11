import type { Metadata } from 'next'
import LoginClient from './PageClient'

export const metadata: Metadata = {
  title: 'Login',
  description:
    'Sign in to your Premium Fitness Gym account to manage your membership and track your progress.',
}

export default function LoginPage() {
  return <LoginClient />
}
