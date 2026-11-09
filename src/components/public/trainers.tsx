'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dumbbell, Award, Star, MapPin, Calendar, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const trainers = [
  {
    name: 'Marcus Johnson',
    role: 'Head Strength Coach',
    specialties: ['Powerlifting', 'Strength & Conditioning', 'Olympic Lifting'],
    experience: '12+ Years',
    certifications: ['CSCS', 'USAW Level 2', 'PPSC'],
    bio: 'Former collegiate strength coach with a passion for helping athletes reach peak performance. Specializes in periodized programming for powerlifting and athletic development.',
    image: '/trainers/marcus.jpg',
    color: '#00FF87',
  },
  {
    name: 'Sarah Chen',
    role: 'Functional Fitness Director',
    specialties: ['HIIT', 'Functional Training', 'Mobility'],
    experience: '8+ Years',
    certifications: ['CF-L2', 'FMS', 'Precision Nutrition'],
    bio: 'CrossFit Games athlete turned coach. Expert in functional movement patterns, metabolic conditioning, and injury prevention through mobility work.',
    image: '/trainers/sarah.jpg',
    color: '#FF6B00',
  },
  {
    name: 'David Rodriguez',
    role: 'Bodybuilding & Aesthetics Coach',
    specialties: ['Hypertrophy', 'Bodybuilding Prep', 'Nutrition'],
    experience: '10+ Years',
    certifications: ['NASM-CPT', 'ISSA Bodybuilding', 'Precision Nutrition L1'],
    bio: 'Natural bodybuilding competitor and posing coach. Helped 50+ clients earn pro cards. Masters the science of hypertrophy and peak week protocols.',
    image: '/trainers/david.jpg',
    color: '#3B82F6',
  },
  {
    name: 'Emily Watson',
    role: 'Yoga & Mind-Body Specialist',
    specialties: ['Vinyasa Yoga', 'Meditation', 'Recovery'],
    experience: '6+ Years',
    certifications: ['RYT-500', 'Yin Yoga', 'Breathwork Facilitator'],
    bio: 'Former dancer turned yoga instructor. Blends dynamic flow with restorative practices for complete mind-body integration and athletic recovery.',
    image: '/trainers/emily.jpg',
    color: '#EC4899',
  },
  {
    name: 'James Mitchell',
    role: 'Cardio & Endurance Coach',
    specialties: ['Marathon Training', 'Triathlon', 'Heart Rate Training'],
    experience: '9+ Years',
    certifications: ['USAT Level 2', 'RRCA', 'TrainingPeaks Certified'],
    bio: 'Ironman finisher and marathon coach. Data-driven approach to endurance training using heart rate zones, power metrics, and recovery analytics.',
    image: '/trainers/james.jpg',
    color: '#06B6D4',
  },
  {
    name: 'Lisa Park',
    role: 'Group Fitness Coordinator',
    specialties: ['Spin', 'Zumba', 'Bootcamp', 'Dance Fitness'],
    experience: '7+ Years',
    certifications: ['ACSM-GEI', 'Spinning Master Instructor', 'Zumba Education Specialist'],
    bio: 'Energy specialist who makes fitness fun. Leads our most popular group classes with infectious enthusiasm and expert choreography.',
    image: '/trainers/lisa.jpg',
    color: '#F59E0B',
  },
]

export function Trainers() {
  return (
    <section className="py-24 md:py-32 bg-[#0A0A0A]" aria-labelledby="trainers-heading">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: 'rgba(0, 255, 135, 0.1)', color: '#00FF87' }}>            Meet Our Team
          </span>
          <h2 id="trainers-heading" className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Expert Trainers Who <span className="text-gradient">Care</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Certified professionals dedicated to your success. Every trainer holds multiple certifications and years of experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.map((trainer, index) => (
            <motion.article
              key={trainer.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className="glass-dark h-full border-white/10 hover:border-[#00FF87]/30 transition-all duration-300 overflow-hidden">
                {/* Trainer Image */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Dumbbell className="h-20 w-20" style={{ color: trainer.color }} opacity={0.15} aria-hidden="true" />
                  </div>
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%2300FF87%22 fill-opacity=%220.02%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V0h4V0h-4zM0 36v-4h-2v4h-4v2h4v4h2v-4h4v-2H0zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V0h4V0H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-[0.5]" />
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                    {trainer.specialties.slice(0, 2).map((spec, i) => (
                      <span key={i} className="px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: `${trainer.color}20`, color: trainer.color }}>
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="h-4 w-4" style={{ color: trainer.color }} aria-hidden="true" />
                    <span className="text-sm font-medium text-foreground">{trainer.role}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">{trainer.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{trainer.experience} Experience</p>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{trainer.bio}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {trainer.certifications.map((cert, i) => (
                      <span key={i} className="px-2 py-0.5 text-xs font-medium rounded border border-white/10">{cert}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Available Mon-Fri</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Floor 2</span>
                  </div>
                </CardContent>
              </Card>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="w-full sm:w-auto" style={{ borderColor: '#00FF87', color: '#00FF87' }}>            View All Trainers
          </Button>
        </div>
      </div>
    </section>
  )
}