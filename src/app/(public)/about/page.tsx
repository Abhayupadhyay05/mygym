import { Metadata } from 'next'
import { Features } from '@/components/public/features'
import { Stats } from '@/components/public/stats'
import { Testimonials } from '@/components/public/testimonials'
import { CTA } from '@/components/public/cta'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ACCENT_COLOR } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Premium Fitness Gym - our story, mission, values, and the team behind your fitness journey.',
}

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <section className="relative min-h-[70vh] hero-gradient flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FF87]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-32 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: 'rgba(0, 255, 135, 0.1)', color: '#00FF87' }}>
              Our Story
            </span>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Where <span className="text-gradient">Strength</span> Meets <span className="text-gradient">Excellence</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              Premium Fitness Gym is the destination for serious fitness enthusiasts who demand more from their training environment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/membership-plans">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold gap-2" style={{ backgroundColor: ACCENT_COLOR, color: '#0A0A0A' }}>
                  View Memberships
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold">
                  Contact Us
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-foreground" style={{ color: '#00FF87' }}>10+</p>
                <p className="text-muted-foreground mt-1">Years of Excellence</p>
              </div>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-foreground" style={{ color: '#00FF87' }}>5000+</p>
                <p className="text-muted-foreground mt-1">Transformed Lives</p>
              </div>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-foreground" style={{ color: '#00FF87' }}>15+</p>
                <p className="text-muted-foreground mt-1">Certified Trainers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Our <span className="text-gradient">Mission</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                To provide a world-class fitness facility that empowers every member to achieve their personal best through expert coaching, premium equipment, and a supportive community.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We believe fitness is not just about physical transformation—it&apos;s about building confidence, discipline, and a lifestyle that extends far beyond the gym walls. Every decision we make, from the equipment we select to the trainers we hire, is guided by this philosophy.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our facility houses the finest equipment from industry leaders, dedicated zones for every training style, and an atmosphere that motivates without intimidation.
              </p>
            </div>
            <div className="space-y-6">
              <div className="glass-dark p-6 rounded-2xl border border-white/10">
                <div className="w-12 h-12 rounded-xl mb-4" style={{ backgroundColor: 'rgba(0, 255, 135, 0.1)' }}>
                  <span className="text-2xl">🏋️</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Excellence in Equipment</h3>
                <p className="text-muted-foreground leading-relaxed">Curated selection of premium machines and free weights from industry-leading brands.</p>
              </div>
              <div className="glass-dark p-6 rounded-2xl border border-white/10">
                <div className="w-12 h-12 rounded-xl mb-4" style={{ backgroundColor: 'rgba(0, 255, 135, 0.1)' }}>
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Expert Guidance</h3>
                <p className="text-muted-foreground leading-relaxed">Every trainer holds multiple certifications and undergoes continuous education to stay at the forefront of exercise science.</p>
              </div>
              <div className="glass-dark p-6 rounded-2xl border border-white/10">
                <div className="w-12 h-12 rounded-xl mb-4" style={{ backgroundColor: 'rgba(0, 255, 135, 0.1)' }}>
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Community First</h3>
                <p className="text-muted-foreground leading-relaxed">A supportive environment where beginners and pros train side by side. No ego, just progress.</p>
              </div>
              <div className="glass-dark p-6 rounded-2xl border border-white/10">
                <div className="w-12 h-12 rounded-xl mb-4" style={{ backgroundColor: 'rgba(0, 255, 135, 0.1)' }}>
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Results-Driven</h3>
                <p className="text-muted-foreground leading-relaxed">Evidence-based programming with regular assessments to track your progress and adjust your plan.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#111111] border-y border-white/10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Our <span className="text-gradient">Values</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The principles that guide everything we do.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-dark p-8 rounded-2xl border border-white/10 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-3">Integrity</h3>
              <p className="text-muted-foreground leading-relaxed">We do what is right, not what is easy. Transparent pricing, honest advice, no hidden fees.</p>
            </div>
            <div className="glass-dark p-8 rounded-2xl border border-white/10 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-3">Excellence</h3>
              <p className="text-muted-foreground leading-relaxed">Mediocrity has no place here. Every detail matters—from equipment maintenance to program design.</p>
            </div>
            <div className="glass-dark p-8 rounded-2xl border border-white/10 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-3">Empowerment</h3>
              <p className="text-muted-foreground leading-relaxed">We don&apos;t just train bodies; we build confidence, knowledge, and lifelong habits.</p>
            </div>
          </div>
        </div>
      </section>

      <Features />
      <Stats />
      <Testimonials />
      <CTA />
    </div>
  )
}