"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Dumbbell, Flame, Heart, Users, Brain, Zap, Shield, Wifi, Coffee, ShowerHead, Lock, Calendar, Clock, Star } from "lucide-react"
import { ACCENT_COLOR } from "@/lib/constants"
import Link from "next/link"

const plans = [
  {
    name: "Essential",
    price: "₹2,999",
    period: "/month",
    description: "Perfect for self-motivated individuals who know their way around the gym.",
    features: [
      "Full gym floor access",
      "All cardio equipment",
      "Strength training zone",
      "Functional training area",
      "Locker room access",
      "High-speed WiFi",
      "Mobile app access",
    ],
    notIncluded: [
      "Group classes",
      "Personal training",
      "Recovery center",
      "Nutrition guidance",
      "Guest passes",
    ],
    cta: "Get Started",
    popular: false,
    color: "#6B7280",
  },
  {
    name: "Pro",
    price: "₹4,999",
    period: "/month",
    description: "Our most popular plan - includes all classes and recovery amenities.",
    features: [
      "Everything in Essential",
      "Unlimited group classes",
      "Yoga & mobility classes",
      "Spin studio access",
      "Recovery center access",
      "Sauna & cold plunge",
      "2 guest passes/month",
      "InBody scan (quarterly)",
      "Workout tracking app",
    ],
    notIncluded: [
      "Personal training sessions",
      "Nutrition coaching",
      "Athletic performance lab",
      "Priority booking",
    ],
    cta: "Most Popular",
    popular: true,
    color: "#00FF87",
  },
  {
    name: "Elite",
    price: "₹8,999",
    period: "/month",
    description: "Complete access including personal training and premium services.",
    features: [
      "Everything in Pro",
      "4 personal training sessions/month",
      "Monthly nutrition consultation",
      "Athletic performance lab access",
      "Unlimited guest passes",
      "Priority class booking",
      "Dedicated success coach",
      "Custom program design",
      "Monthly InBody scan",
      "Massage therapy (1/month)",
      "Meal prep locker access",
      "24/7 facility access",
    ],
    notIncluded: [],
    cta: "Go Elite",
    popular: false,
    color: "#F59E0B",
  },
]

const faq = [
  {
    q: "Can I cancel anytime?",
    a: "Yes, all memberships are month-to-month with no long-term contracts. Cancel anytime with 30 days notice.",
  },
  {
    q: "Is there a joining fee?",
    a: "No joining fees on any plan. You only pay your first month to get started.",
  },
  {
    q: "Can I upgrade or downgrade my plan?",
    a: "Absolutely. Changes take effect at the start of your next billing cycle.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept UPI, credit/debit cards, net banking, and auto-pay via Razorpay.",
  },
  {
    q: "Are there student or corporate discounts?",
    a: "Yes, we offer 15% off for students with valid ID and corporate packages for teams of 5+. Contact us for details.",
  },
  {
    q: "Can I freeze my membership?",
    a: "Yes, you can freeze for up to 3 months per year for travel, injury, or medical reasons with documentation.",
  },
]

export default function MembershipPlansClient() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] hero-gradient flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FF87]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-5xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: "rgba(0, 255, 135, 0.1)", color: "#00FF87" }}>
              Membership Plans
            </span>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Simple, Transparent <span className="text-gradient">Pricing</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              No hidden fees. No long-term contracts. Cancel anytime. Choose the plan that fits your goals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="py-24 md:py-32 bg-background" aria-labelledby="plans-heading">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 id="plans-heading" className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Choose Your <span className="text-gradient">Plan</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              All plans include a complimentary fitness assessment and orientation session.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.article
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  className={`glass-dark h-full border-2 transition-all duration-300 relative overflow-hidden ${
                    plan.popular
                      ? "border-[#00FF87]/50 shadow-[0_0_30px_rgba(0,255,135,0.1)]"
                      : "border-white/10 hover:border-[#00FF87]/30"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: "#00FF87" }} />
                  )}

                  <CardHeader className="p-6 md:p-8 pb-4 border-b border-white/10">
                    {plan.popular && (
                      <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4" style={{ backgroundColor: "#00FF87", color: "#0A0A0A" }}>
                        MOST POPULAR
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-4">
                      <Dumbbell className="h-8 w-8" style={{ color: plan.color }} aria-hidden="true" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground">{plan.name}</CardTitle>
                    <div className="flex items-baseline gap-1 mt-4">
                      <span className="text-4xl md:text-5xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="text-muted-foreground mt-4 text-sm leading-relaxed">{plan.description}</p>
                  </CardHeader>

                  <CardContent className="p-6 md:p-8 space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Check className="h-4 w-4" style={{ color: "#00FF87" }} aria-hidden="true" />
                        Included
                      </h4>
                      <ul className="space-y-2" role="list">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "#00FF87" }} aria-hidden="true" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {plan.notIncluded.length > 0 && (
                      <div className="border-t border-white/10 pt-6">
                        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <Star className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          Not Included
                        </h4>
                        <ul className="space-y-2" role="list">
                          {plan.notIncluded.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground/50">
                              <span className="h-4 w-4 flex-shrink-0 mt-0.5 text-muted-foreground/30">-</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Link href="/register">
                      <Button
                        className="w-full h-12 text-lg font-semibold"
                        style={plan.popular
                          ? { backgroundColor: ACCENT_COLOR, color: "#0A0A0A" }
                          : { borderColor: plan.color, color: plan.color }}
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {plan.cta}
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
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground mb-4">All prices inclusive of GST. Billed monthly on the same date.</p>
            <Link href="/contact">
              <Button variant="ghost" size="lg">
                Need a Custom Plan? Contact Us
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 md:py-32 bg-[#111111] border-y border-white/10" aria-labelledby="faq-heading">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 id="faq-heading" className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Everything you need to know about your membership.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faq.map((item, index) => (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="glass-dark p-6 rounded-2xl border border-white/10">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.q}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.a}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-background" aria-labelledby="join-heading">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="glass-dark rounded-3xl border border-white/10 p-8 md:p-16 text-center max-w-4xl mx-auto"
          >
            <h2 id="join-heading" className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Ready to <span className="text-gradient">Start Your Journey</span>?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
              Join 5,000+ members who have transformed their fitness at Premium Fitness Gym. Your first workout is on us.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold gap-2" style={{ backgroundColor: ACCENT_COLOR, color: "#0A0A0A" }}>
                  Join Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold">
                  Schedule a Tour
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}



