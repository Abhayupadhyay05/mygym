import { Hero } from '@/components/public/hero'
import { Features } from '@/components/public/features'
import { Stats } from '@/components/public/stats'
import { Programs } from '@/components/public/programs'
import { Trainers } from '@/components/public/trainers'
import { Testimonials } from '@/components/public/testimonials'
import { CTA } from '@/components/public/cta'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Premium Fitness Gym | Where Strength Meets Excellence',
  description: 'State-of-the-art facility with expert trainers, modern equipment, and personalized fitness programs designed for your success.',
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <Stats />
      <Programs />
      <Trainers />
      <Testimonials />
      <CTA />
    </div>
  )
}
