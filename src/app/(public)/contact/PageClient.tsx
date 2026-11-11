'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Phone, Mail, Clock, Map, MessageSquare } from 'lucide-react'
import { FOOTER_LINKS, WHATSAPP_NUMBER, WHATSAPP_DEFAULT_MESSAGE } from '@/lib/constants'
import Link from 'next/link'
import { ContactForm } from './ContactForm'

export default function ContactClient() {
  return (
    <div className="flex flex-col">
      <section className="relative min-h-[50vh] hero-gradient flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FF87]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-5xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: 'rgba(0, 255, 135, 0.1)', color: '#00FF87' }}>
              Contact Us
            </span>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              Have questions about memberships, want to schedule a tour, or need support? Our team is ready to help.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-background overflow-x-clip" aria-labelledby="contact-heading">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="grid lg:grid-cols-2 gap-12"
          >
            <div>
              <h2 id="contact-heading" className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Let&apos;s Start a <span className="text-gradient">Conversation</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                Choose the method that works best for you. We typically respond within a few hours during business hours.
              </p>

              <div className="space-y-6 mb-12">
                {[
                  { icon: MapPin, title: 'Visit Us', details: FOOTER_LINKS.contact.address, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(FOOTER_LINKS.contact.address)}`, external: true },
                  { icon: Phone, title: 'Call Us', details: FOOTER_LINKS.contact.phone, href: `tel:${FOOTER_LINKS.contact.phone.replace(/\s/g, '')}` },
                  { icon: Mail, title: 'Email Us', details: FOOTER_LINKS.contact.email, href: `mailto:${FOOTER_LINKS.contact.email}` },
                  { icon: Clock, title: 'Hours', details: FOOTER_LINKS.contact.hours, href: null },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(0, 255, 135, 0.1)' }}>
                      <item.icon className="h-6 w-6" style={{ color: '#00FF87' }} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                      {item.href ? (
                        <a href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined} className="text-muted-foreground hover:text-[#00FF87] transition-colors">
                          {item.details}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">{item.details}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className="glass-dark p-6 rounded-2xl border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <MessageSquare className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#25D366', color: 'white' }} aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-foreground">Chat on WhatsApp</h3>
                    <p className="text-sm text-muted-foreground">Instant replies during business hours</p>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ backgroundColor: '#25D366', color: 'white' }}
                >
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  Start Chat
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glass-dark border border-white/10">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-6">Send Us a Message</h3>
                  <ContactForm />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#111111] border-y border-white/10" aria-labelledby="map-heading">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 id="map-heading" className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Find Our <span className="text-gradient">Location</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Located in the heart of the city with easy access. Ample parking available.
            </p>
          </motion.div>

          <iframe
            title="Premium Fitness Gym location on Google Maps"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(FOOTER_LINKS.contact.address)}&output=embed`}
            className="relative aspect-video w-full max-w-5xl mx-auto rounded-2xl border border-white/10"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <section className="py-16 bg-background" aria-labelledby="quick-links-heading">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              { href: '/membership-plans', icon: MapPin, label: 'Membership Plans', desc: 'View all options' },
              { href: '/facilities', icon: Map, label: 'Facilities', desc: 'Explore our zones' },
              { href: '/trainers', icon: MessageSquare, label: 'Meet Trainers', desc: 'Book a session' },
              { href: '/programs', icon: MapPin, label: 'Programs', desc: 'Find your fit' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={item.href} className="block">
                  <div className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 255, 135, 0.1)' }}>
                    <item.icon className="h-7 w-7" style={{ color: '#00FF87' }} aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}