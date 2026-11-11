'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Dumbbell, Shield, Users, Clock } from 'lucide-react'
import { GYM_DESCRIPTION, ACCENT_COLOR } from '@/lib/constants'
import { motion } from 'framer-motion'
import Link from 'next/link'

const features = [
  { icon: Shield, label: 'Certified Trainers', desc: 'Expert guidance' },
  { icon: Users, label: 'Community Driven', desc: 'Motivating environment' },
  { icon: Clock, label: 'Open 5AM-11PM', desc: 'Flexible schedule' },
]

const particles = Array.from({ length: 20 }, (_, index) => ({
  startX: (index * 37) % 100,
  endX: (index * 53 + 17) % 100,
  startY: (index * 29) % 100,
  endY: (index * 41 + 11) % 100,
  duration: 15 + (index % 10),
  delay: (index % 5) * 0.8,
}))

export function Hero() {
  return (
    <section className="relative min-h-screen hero-gradient flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FF87]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#00FF87]/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0" aria-hidden="true">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full" style={{ backgroundColor: '#00FF87' }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
              x: [`${particle.startX}vw`, `${particle.endX}vw`],
              y: [`${particle.startY}vh`, `${particle.endY}vh`],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-32 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
              >
                <span className="relative">
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#00FF87', boxShadow: '0 0 8px #00FF87' }} />
                  <Dumbbell className="h-4 w-4" style={{ color: '#00FF87' }} aria-hidden="true" />
                </span>
                <span className="text-sm font-medium text-foreground">Now Open in Your City</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
              >
                Where <span className="text-gradient">Strength</span> Meets{' '}
                <span className="text-gradient">Excellence</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed"
              >
                {GYM_DESCRIPTION}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-16"
              >
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold gap-2" style={{ backgroundColor: ACCENT_COLOR, color: '#0A0A0A' }}>
                    Start Your Journey
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/membership-plans">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold border-white/20 hover:bg-white/5">
                    View Memberships
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-8"
              >
                {features.map((feature, index) => (
                  <div key={feature.label} className="flex items-center gap-3 group">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-[#00FF87]/50 transition-colors">
                      <feature.icon className="h-5 w-5" style={{ color: '#00FF87' }} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{feature.label}</p>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="relative"
            >
              <div className="relative aspect-[4/3] lg:aspect-[3/2] rounded-3xl overflow-hidden glass-dark">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Dumbbell className="h-32 w-32" style={{ color: '#00FF87' }} opacity={0.1} aria-hidden="true" />
                </div>
                {/* Image overlay pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%2300FF87%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V0h4V0h-4zM0 36v-4h-2v4h-4v2h4v4h2v-4h4v-2H0zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V0h4V0H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-[0.5]" />
              </div>
              
              {/* Floating Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8"
                whileHover={{ y: -8 }}
              >
                <div className="glass-dark p-6 rounded-2xl border border-white/10 min-w-[200px]">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(0, 255, 135, 0.1)' }}>
                      <Dumbbell className="h-6 w-6" style={{ color: '#00FF87' }} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-foreground">500+</p>
                      <p className="text-sm text-muted-foreground">Active Members</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -top-6 -right-6 md:-top-8 md:-right-8"
                whileHover={{ y: -8 }}
              >
                <div className="glass-dark p-6 rounded-2xl border border-white/10 min-w-[200px]">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(255, 107, 0, 0.1)' }}>
                      <Users className="h-6 w-6" style={{ color: '#FF6B00' }} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-foreground">15+</p>
                      <p className="text-sm text-muted-foreground">Expert Trainers</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
