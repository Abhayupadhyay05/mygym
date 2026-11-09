'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Dumbbell, Award, Clock, Flame, Trophy } from 'lucide-react'

const stats = [
  { icon: Users, value: '500+', label: 'Active Members', desc: 'And growing daily' },
  { icon: Dumbbell, value: '15+', label: 'Expert Trainers', desc: 'Certified professionals' },
  { icon: Award, value: '50+', label: 'Weekly Classes', desc: 'Diverse programs' },
  { icon: Clock, value: '18h', label: 'Daily Open Hours', desc: '5 AM - 11 PM' },
  { icon: Flame, value: '98%', label: 'Retention Rate', desc: 'Member satisfaction' },
  { icon: Trophy, value: '10+', label: 'Years Experience', desc: 'Proven results' },
]

export function Stats() {
  return (
    <section className="py-24 md:py-32 bg-[#111111] border-y border-white/10" aria-labelledby="stats-heading">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 id="stats-heading" className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Our <span className="text-gradient">Impact</span> in Numbers
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Real results from real members who chose to transform their lives.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.article
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="glass-dark border border-white/10 p-6 md:p-8 text-center">
                <CardContent className="p-0">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(0, 255, 135, 0.1)' }}>
                    <stat.icon className="h-8 w-8" style={{ color: '#00FF87' }} aria-hidden="true" />
                  </div>
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 100, delay: 0.3 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-2"
                  >
                    {stat.value}
                  </motion.div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{stat.label}</h3>
                  <p className="text-sm text-muted-foreground">{stat.desc}</p>
                </CardContent>
              </Card>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
