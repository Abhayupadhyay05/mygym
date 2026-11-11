import type { Metadata } from 'next'
import RegisterClient from './PageClient'

export const metadata: Metadata = {
  title: 'Register',
  description:
    'Create your Premium Fitness Gym account and start your fitness journey.',
}

export default function RegisterPage() {
  return <RegisterClient />
}
