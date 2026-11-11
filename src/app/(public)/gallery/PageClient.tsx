'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Camera, Video, MapPin, Users } from 'lucide-react'
import { ACCENT_COLOR } from '@/lib/constants'
import Link from 'next/link'
import { useState } from 'react'

const galleryCategories = [
  { name: 'Facilities', icon: MapPin, color: '#00FF87' },
  { name: 'Equipment', icon: Camera, color: '#FF6B00' },
  { name: 'Classes', icon: Users, color: '#3B82F6' },
  { name: 'Events', icon: Video, color: '#EC4899' },
  { name: 'Trainers', icon: Camera, color: '#F59E0B' },
  { name: 'Community', icon: Users, color: '#06B6D4' },
]

const galleryImages = [
  { category: 'Facilities', alt: 'Strength training spaces' },
  { category: 'Equipment', alt: 'Cardio and strength equipment' },
  { category: 'Classes', alt: 'Group fitness classes' },
  { category: 'Facilities', alt: 'Recovery and mobility spaces' },
  { category: 'Equipment', alt: 'Olympic lifting' },
  { category: 'Classes', alt: 'Indoor cycling' },
  { category: 'Trainers', alt: 'Personal training' },
  { category: 'Community', alt: 'Training together' },
  { category: 'Events', alt: 'Gym events' },
  { category: 'Facilities', alt: 'Yoga and mobility' },
  { category: 'Equipment', alt: 'Functional training' },
  { category: 'Community', alt: 'Member stories' },
]

export default function GalleryClient() {
  const [activeCategory, setActiveCategory] = useState('All')
  const visibleImages =
    activeCategory === 'All'
      ? galleryImages
      : galleryImages.filter((image) => image.category === activeCategory)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
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
              Photo & Video Gallery
            </span>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              See Our <span className="text-gradient">Space</span> in Action
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              Browse the spaces, training disciplines, and community categories that shape the gym experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 bg-background border-y border-white/10" aria-labelledby="categories-heading">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center" role="group" aria-label="Gallery categories">
            {['All', ...galleryCategories.map((category) => category.name)].map((name, index) => {
              const category = galleryCategories.find((item) => item.name === name)
              const color = category?.color ?? ACCENT_COLOR
              const Icon = category?.icon ?? Camera

              return (
              <motion.button
                key={name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: `${color}20`,
                  color,
                  border: `1px solid ${color}40`,
                }}
                type="button"
                aria-pressed={activeCategory === name}
                onClick={() => setActiveCategory(name)}
              >
                <Icon className="h-4 w-4 inline mr-2" aria-hidden="true" />
                {name}
              </motion.button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-24 md:py-32 bg-background" aria-labelledby="gallery-heading">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 id="gallery-heading" className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Facility <span className="text-gradient">Showcase</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Explore training, facility, and community highlights by category.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {visibleImages.map((image, index) => {
              const category = galleryCategories.find((item) => item.name === image.category)
              const Icon = category?.icon ?? Camera
              const color = category?.color ?? ACCENT_COLOR

              return (
              <motion.article
                key={`${image.category}-${image.alt}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="glass-dark border border-white/10 overflow-hidden h-full group">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="h-16 w-16" style={{ color }} opacity={0.25} aria-hidden="true" />
                    </div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%2300FF87%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V0h4V0h-4zM0 36v-4h-2v4h-4v2h4v4h2v-4h4v-2H0zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V0h4V0H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-[0.5]" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-black/70 text-white backdrop-blur-sm">
                        {image.category}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground line-clamp-1">{image.alt}</p>
                  </CardContent>
                </Card>
              </motion.article>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link href="/contact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Visit In Person
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Virtual Tour CTA */}
      <section className="py-24 md:py-32 bg-[#111111] border-y border-white/10" aria-labelledby="tour-heading">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="glass-dark rounded-3xl border border-white/10 p-8 md:p-16 text-center max-w-4xl mx-auto"
          >
            <Video className="h-16 w-16 mx-auto mb-6" style={{ color: '#00FF87' }} opacity={0.3} aria-hidden="true" />
            <h2 id="tour-heading" className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Want a <span className="text-gradient">Virtual Tour</span>?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
              Schedule a live video walkthrough with our team. See every zone, ask questions, and get a feel for the gym from anywhere.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold gap-2" style={{ backgroundColor: ACCENT_COLOR, color: '#0A0A0A' }}>
                  Book Virtual Tour
                </Button>
              </Link>
              <Link href="/facilities">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold">
                  Explore Facilities
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}