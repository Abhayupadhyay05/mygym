'use client'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Flame, Dumbbell, Heart, Users, Brain, Zap, Target } from 'lucide-react'
import Link from 'next/link'

const programs = [
  {
    icon: Flame,
    title: 'HIIT & Metabolic Conditioning',
    desc: 'High-intensity interval training designed to torch calories and boost metabolism long after your workout ends.',
    duration: '45 min',
    level: 'All Levels',
    features: ['Fat burning', 'Endurance', 'Metabolic boost'],
  },
  {
    icon: Dumbbell,
    title: 'Strength & Powerlifting',
    desc: 'Progressive strength programs focusing on compound movements - squat, bench, deadlift, and overhead press.',
    duration: '60-90 min',
    level: 'Intermediate',
    features: ['Muscle building', 'Strength gains', 'Form mastery'],
  },
  {
    icon: Heart,
    title: 'Cardio & Endurance',
    desc: 'Steady-state and interval cardio sessions on premium equipment with entertainment integration.',
    duration: '30-60 min',
    level: 'All Levels',
    features: ['Heart health', 'Stamina', 'Recovery'],
  },
  {
    icon: Users,
    title: 'Group Fitness Classes',
    desc: 'Energetic instructor-led classes including spin, bootcamp, dance fitness, and circuit training.',
    duration: '45-60 min',
    level: 'All Levels',
    features: ['Community', 'Motivation', 'Variety'],
  },
  {
    icon: Brain,
    title: 'Yoga & Mobility',
    desc: 'Vinyasa, hatha, yin yoga and mobility flows for flexibility, balance, and mental clarity.',
    duration: '60 min',
    level: 'All Levels',
    features: ['Flexibility', 'Mindfulness', 'Recovery'],
  },
  {
    icon: Zap,
    title: 'Athletic Performance',
    desc: 'Sport-specific training for athletes focusing on speed, agility, power, and injury prevention.',
    duration: '90 min',
    level: 'Advanced',
    features: ['Speed', 'Agility', 'Power'],
  },
]

export function Programs() {
  return (
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
            Fitness <span className="text-gradient">Programs</span> for Every Goal
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Scientifically designed programs led by certified experts. Find your perfect fit.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <motion.article
              key={program.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className="glass-dark h-full border border-white/10 group-hover:border-[#00FF87]/50 transition-colors duration-300 overflow-hidden">
                <div className="w-full h-40 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%2300FF87%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V0h4V0h-4zM0 36v-4h-2v4h-4v2h4v4h2v-4h4v-2H0zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V0h4V0H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-[0.5]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <program.icon className="h-16 w-16" style={{ color: '#00FF87' }} opacity={0.15} aria-hidden="true" />
                  </div>
                </div>
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">{program.duration}</span>
                    <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">{program.level}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{program.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{program.desc}</p>
                  <ul className="space-y-2 mb-6" role="list">
                    {program.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#00FF87' }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/programs">
                    <Button variant="outline" className="w-full border-white/20 hover:bg-white/5">
                      Learn More <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/programs">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-lg font-semibold border-white/20 hover:bg-white/5">
              View All Programs
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}