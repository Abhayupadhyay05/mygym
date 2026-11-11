'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dumbbell, Heart, Users, Target, Lock, ShowerHead, ArrowRight } from 'lucide-react'
import { ACCENT_COLOR } from '@/lib/constants'
import Link from 'next/link'
import Image from 'next/image'

const facilities = [
  {
    name: 'Modern Equipment',
    description: 'State-of-the-art cardio and strength machines from leading brands. Sample content — confirm with owner.',
    icon: Dumbbell,
    color: '#00FF87',
  },
  {
    name: 'Strength Training',
    description: 'Dedicated free-weight area with power racks, platforms, and specialty bars. Sample content — confirm with owner.',
    icon: Target,
    color: '#FF6B00',
  },
  {
    name: 'Cardio Zone',
    description: 'Treadmills, bikes, rowers, and ellipticals with entertainment screens. Sample content — confirm with owner.',
    icon: Heart,
    color: '#3B82F6',
  },
  {
    name: 'Personal Training',
    description: 'Private training spaces for one-on-one coaching sessions. Sample content — confirm with owner.',
    icon: Users,
    color: '#EC4899',
  },
  {
    name: 'Locker Rooms',
    description: 'Secure digital lockers, showers, and changing facilities. Sample content — confirm with owner.',
    icon: Lock,
    color: '#06B6D4',
  },
  {
    name: 'Group Workouts',
    description: 'Studio space for instructor-led group fitness classes. Sample content — confirm with owner.',
    icon: ShowerHead,
    color: '#F59E0B',
  },
]

export default function FacilitiesClient() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] hero-gradient flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FF87]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: 'rgba(0, 255, 135, 0.1)', color: '#00FF87' }}>
              Our Facilities
            </span>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Train in a <span className="text-gradient">Facility</span> That Matches Your Ambition
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              Explore our training zones and amenities. All facilities included with every membership.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/membership-plans">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold gap-2" style={{ backgroundColor: ACCENT_COLOR, color: '#0A0A0A' }}>
                  View Memberships
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold">
                  Schedule a Tour
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-24 md:py-32 bg-background" aria-labelledby="facilities-heading">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 id="facilities-heading" className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Our <span className="text-gradient">Training Zones</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Purpose-built environments for every training style. Sample content — verify with owner.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility, index) => (
              <article key={facility.name} className="group">
                <Card className="glass-dark h-full border border-white/10 group-hover:border-[#00FF87]/50 transition-colors duration-300 overflow-hidden">
                  <div className="relative aspect-video overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <facility.icon className="h-20 w-20" style={{ color: facility.color }} opacity={0.15} aria-hidden="true" />
                    </div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%2300FF87%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V0h4V0h-4zM0 36v-4h-2v4h-4v2h4v4h2v-4h4v-2H0zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V0h4V0H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-[0.5]" />
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0A0A0A]/90 to-transparent" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <facility.icon className="h-5 w-5" style={{ color: facility.color }} aria-hidden="true" />
                      <span className="text-sm font-medium text-foreground">{facility.name}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{facility.name}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">{facility.description}</p>
                    <Button variant="outline" className="w-full border-white/20 hover:bg-white/5" style={{ borderColor: facility.color, color: facility.color }}>
                      Explore <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                    </Button>
                  </CardContent>
                </Card>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-background" aria-labelledby="tour-heading">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="glass-dark rounded-3xl border border-white/10 p-8 md:p-16 text-center max-w-4xl mx-auto">
            <h2 id="tour-heading" className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Want to See It <span className="text-gradient">In Person</span>?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
              Schedule a guided tour with our membership team. Experience the atmosphere, try the equipment, and find your perfect training zone.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold gap-2" style={{ backgroundColor: ACCENT_COLOR, color: '#0A0A0A' }}>
                  Book a Tour
                </Button>
              </Link>
              <Link href="/membership-plans">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}