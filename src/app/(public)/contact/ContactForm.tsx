'use client'

import type { FormEvent } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ACCENT_COLOR, FOOTER_LINKS } from '@/lib/constants'

export function ContactForm() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const firstName = String(formData.get('firstName') ?? '').trim()
    const lastName = String(formData.get('lastName') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const phone = String(formData.get('phone') ?? '').trim()
    const subject = String(formData.get('subject') ?? '').trim()
    const message = String(formData.get('message') ?? '').trim()
    const body = [
      `Name: ${firstName} ${lastName}`.trim(),
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : '',
      '',
      message,
    ]
      .filter(Boolean)
      .join('\n')

    const query = new URLSearchParams({
      subject: `Website enquiry: ${subject}`,
      body,
    })

    window.location.assign(`mailto:${FOOTER_LINKS.contact.email}?${query.toString()}`)
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name</Label>
          <Input id="firstName" name="firstName" placeholder="John" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name</Label>
          <Input id="lastName" name="lastName" placeholder="Doe" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
        <Input id="email" name="email" type="email" placeholder="john@example.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium text-foreground">Phone</Label>
        <Input id="phone" name="phone" type="tel" placeholder="+91 98765 43210" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject" className="text-sm font-medium text-foreground">Subject</Label>
        <select
          id="subject"
          name="subject"
          className="w-full px-4 py-3 rounded-lg bg-[#111111] border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#00FF87]/50 focus:border-transparent"
          required
        >
          <option value="">Select a topic</option>
          <option value="Membership Inquiry">Membership Inquiry</option>
          <option value="Schedule a Tour">Schedule a Tour</option>
          <option value="Personal Training">Personal Training</option>
          <option value="Group Classes">Group Classes</option>
          <option value="Corporate Partnership">Corporate Partnership</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium text-foreground">Message</Label>
        <Textarea id="message" name="message" placeholder="Tell us about your fitness goals or questions..." rows={5} required />
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Your default email app will open with the message ready to send. This website does not send or store the message.
      </p>
      <Button type="submit" className="w-full h-12 text-lg font-semibold" style={{ backgroundColor: ACCENT_COLOR, color: '#0A0A0A' }}>
        <Send className="h-4 w-4 mr-2" aria-hidden="true" />
        Open Email App
      </Button>
    </form>
  )
}
