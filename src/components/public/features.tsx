'use client'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Zap, Shield, Users, Target, Heart, Brain, Award, Globe } from 'lucide-react'

const features = [
  { icon: Zap, title: 'HIIT Training', desc: 'High-intensity interval training for maximum calorie burn in minimum time.' },
  { icon: Shield, title: 'Strength Programs', desc: 'Progressive overload programs designed for muscle and strength gains.' },
  { icon: Users, title: 'Group Classes', desc: 'Energetic group sessions from yoga to spin, led by certified instructors.' },
  { icon: Target, title: 'Personal Training', desc: 'One-on-one coaching tailored to your specific goals and fitness level.' },
  { icon: Heart, title: 'Cardio Zone', desc: 'State-of-the-art cardio equipment with entertainment systems.' },
  { icon: Brain, title: 'Mind & Body', desc: 'Yoga, pilates, and meditation for holistic wellness.' },
  { icon: Award, title: 'Nutrition Coaching', desc: 'Personalized meal plans and dietary guidance from certified nutritionists.' },
  { icon: Globe, title: 'Virtual Access', desc: 'On-demand workouts and live-streamed classes from anywhere.' },
]

export function Features() {
  return (
    <section className="py-24 md:py-32 bg-background" aria-labelledby="features-heading">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 id="features-heading" className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Everything You Need to <span className="text-gradient">Transform</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Premium facilities, expert guidance, and a supportive community - all under one roof.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className="glass-dark h-full border border-white/10 group-hover:border-[#00FF87]/50 transition-colors duration-300">
                <CardContent className="p-6 md:p-8">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: 'rgba(0, 255, 135, 0.1)' }}>
                    <feature.icon className="h-7 w-7" style={{ color: '#00FF87' }} aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}