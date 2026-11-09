'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Star, Quote, Dumbbell, Heart, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'Software Engineer',
    duration: 'Member since 2022',
    rating: 5,
    text: 'Best gym I\'ve ever trained at. The equipment is top-notch, trainers are knowledgeable, and the community is incredibly supportive. Lost 15kg and gained muscle in 8 months.',
    avatar: '/testimonials/rajesh.jpg',
    achievement: '15kg Weight Loss',
  },
  {
    name: 'Priya Sharma',
    role: 'Marketing Manager',
    duration: 'Member since 2021',
    rating: 5,
    text: 'The group classes keep me motivated! Lisa\'s spin classes are addictive, and the yoga sessions are perfect for recovery. Never thought I\'d enjoy working out this much.',
    avatar: '/testimonials/priya.jpg',
    achievement: 'Consistent 4x/week',
  },
  {
    name: 'Arjun Patel',
    role: 'Powerlifting Competitor',
    duration: 'Member since 2020',
    rating: 5,
    text: 'Marcus helped me hit a 200kg deadlift at my first competition. The platform setup is competition-grade, and the coaching expertise is unmatched. This is a serious lifter\'s gym.',
    avatar: '/testimonials/arjun.jpg',
    achievement: '200kg Deadlift PR',
  },
  {
    name: 'Sneha Reddy',
    role: 'Doctor',
    duration: 'Member since 2023',
    rating: 5,
    text: 'As a busy professional, I appreciate the 5AM opening. Sarah\'s functional training fixed my chronic back pain. The personal attention to form and mobility is exceptional.',
    avatar: '/testimonials/sneha.jpg',
    achievement: 'Pain-Free Movement',
  },
  {
    name: 'Vikram Singh',
    role: 'Entrepreneur',
    duration: 'Member since 2022',
    rating: 5,
    text: 'David\'s bodybuilding program transformed my physique for my wedding. The nutrition guidance was practical and sustainable. 10/10 would recommend for anyone serious about aesthetics.',
    avatar: '/testimonials/vikram.jpg',
    achievement: 'Wedding Ready Physique',
  },
  {
    name: 'Ananya Desai',
    role: 'Student',
    duration: 'Member since 2023',
    rating: 5,
    text: 'Student discount makes it affordable! James\' endurance coaching helped me complete my first half marathon. The community here feels like family - everyone cheers each other on.',
    avatar: '/testimonials/ananya.jpg',
    achievement: 'Half Marathon Finisher',
  },
]

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-[#111111] border-y border-white/10" aria-labelledby="testimonials-heading">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: 'rgba(0, 255, 135, 0.1)', color: '#00FF87' }}>            Member Stories
          </span>
          <h2 id="testimonials-heading" className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Real People, Real <span className="text-gradient">Results</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Hear from our members who transformed their lives at Premium Fitness Gym.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className="glass-dark h-full border-white/10 hover:border-[#00FF87]/30 transition-all duration-300">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-muted-foreground/50 mb-4" aria-hidden="true" />
                  <p className="text-foreground mb-6 flex-1 leading-relaxed">{testimonial.text}</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00FF87] to-[#00CC6A] flex items-center justify-center font-bold text-[#0A0A0A]">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <p className="text-xs text-muted-foreground/70">{testimonial.duration}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: 'rgba(0, 255, 135, 0.1)', color: '#00FF87' }}>
                      <Trophy className="h-3 w-3" aria-hidden="true" />
                      {testimonial.achievement}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}