import type { Metadata } from 'next'
import ContactClient from './PageClient'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Premium Fitness Gym. Visit us, call, email, or chat on WhatsApp.',
}

export default function ContactPage() {
  return <ContactClient />
}
