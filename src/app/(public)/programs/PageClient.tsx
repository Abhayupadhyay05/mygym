'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Flame, Heart, Users, Brain, Zap, Calendar, Dumbbell as DumbbellIcon } from 'lucide-react'
import { ACCENT_COLOR } from '@/lib/constants'
import Link from 'next/link'

const programs = [
  {
    icon: Flame,
    title: 'HIIT & Metabolic Conditioning',
    description: 'High-intensity interval training designed to torch calories and boost metabolism long after your workout ends.',
    duration: '45 min',
    level: 'All Levels',
    schedule: 'Mon/Wed/Fri 6AM, 12PM, 6PM',
    features: ['Fat burning', 'Endurance', 'Metabolic boost', 'Time efficient'],
    color: '#FF6B00',
  },
  {
    icon: DumbbellIcon,
    title: 'Strength & Powerlifting',
    description: 'Progressive strength programs focusing on compound movements - squat, bench, deadlift, and overhead press.',
    duration: '60-90 min',
    level: 'Intermediate',
    schedule: 'Tue/Thu/Sat 7AM, 5PM',
    features: ['Muscle building', 'Strength gains', 'Form mastery', 'Periodized programming'],
    color: '#00FF87',
  },
  {
    icon: Heart,
    title: 'Cardio & Endurance',
    description: 'Steady-state and interval cardio sessions on premium equipment with entertainment integration.',
    duration: '30-60 min',
    level: 'All Levels',
    schedule: 'Daily 5AM-10PM',
    features: ['Heart health', 'Stamina', 'Recovery', 'Low impact options'],
    color: '#3B82F6',
  },
  {
    icon: Users,
    title: 'Group Fitness Classes',
    description: 'Energetic instructor-led classes including spin, bootcamp, dance fitness, and circuit training.',
    duration: '45-60 min',
    level: 'All Levels',
    schedule: 'Mon-Sun various times',
    features: ['Community', 'Motivation', 'Variety', 'Certified instructors'],
    color: '#EC4899',
  },
  {
    icon: Brain,
    title: 'Yoga & Mobility',
    description: 'Vinyasa, hatha, yin yoga and mobility flows for flexibility, balance, and mental clarity.',
    duration: '60 min',
    level: 'All Levels',
    schedule: 'Mon/Wed/Fri 7AM, 6PM; Sat 9AM',
    features: ['Flexibility', 'Mindfulness', 'Recovery', 'Breathwork'],
    color: '#06B6D4',
  },
  {
    icon: Zap,
    title: 'Athletic Performance',
    description: 'Sport-specific training for athletes focusing on speed, agility, power, and injury prevention.',
    duration: '90 min',
    level: 'Advanced',
    schedule: 'Tue/Thu 5AM, 4PM; Sat 8AM',
    features: ['Speed', 'Agility', 'Power', 'Injury prevention'],
    color: '#F59E0B',
  },
]

export default function ProgramsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] hero-gradient flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FF87]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-5xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: 'rgba(0, 255, 135, 0.1)', color: '#00FF87' }}>
              All Programs
            </span>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Programs Designed for <span className="text-gradient">Every Goal</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              Six scientifically designed program categories. Expert-led. Results-driven. Choose your path.
            </p>
            <Link href="/contact">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold gap-2" style={{ backgroundColor: ACCENT_COLOR, color: '#0A0A0A' }}>
                Get Program Guidance
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-24 md:py-32 bg-background" aria-labelledby="programs-heading">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 id="programs-heading" className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Our <span className="text-gradient">Program Categories</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Each program includes structured progression, expert coaching, and regular assessments.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, index) => (
              <motion.article
                key={program.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="glass-dark h-full border border-white/10 group-hover:border-[#00FF87]/50 transition-colors duration-300 overflow-hidden">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <program.icon className="h-24 w-24" style={{ color: program.color }} opacity={0.15} aria-hidden="true" />
                    </div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%2300FF87%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V0h4V0h-4zM0 36v-4h-2v4h-4v2h4v4h2v-4h4v-2H0zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V0h4V0H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-[0.5]" />
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0A0A0A]/90 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: `${program.color}20`, color: program.color }}>
                        {program.duration}
                      </span>
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: `${program.color}20`, color: program.color }}>
                        {program.level}
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-3">{program.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">{program.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Calendar className="h-4 w-4" aria-hidden="true" />
                      <span>{program.schedule}</span>
                    </div>

                    <ul className="space-y-2 mb-6" role="list">
                      {program.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: program.color }} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href="/contact">
                      <Button variant="outline" className="w-full border-white/20 hover:bg-white/5" style={{ borderColor: program.color, color: program.color }}>
                        Ask About This Program <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Training CTA */}
      <section className="py-24 md:py-32 bg-[#111111] border-y border-white/10" aria-labelledby="pt-heading">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="glass-dark rounded-3xl border border-white/10 p-8 md:p-16 text-center max-w-4xl mx-auto"
          >
            <DumbbellIcon className="h-16 w-16 mx-auto mb-6" style={{ color: '#00FF87' }} opacity={0.3} aria-hidden="true" />
            <h2 id="pt-heading" className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Need a <span className="text-gradient">Custom Plan</span>?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
              Work one-on-one with our certified trainers for a fully personalized program tailored to your goals, schedule, and current fitness level.
            </p>
            <Link href="/trainers">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold gap-2" style={{ backgroundColor: ACCENT_COLOR, color: '#0A0A0A' }}>
                View Our Trainers
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}