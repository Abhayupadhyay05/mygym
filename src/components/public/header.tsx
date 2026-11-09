
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MobileMenu } from './mobile-menu'
import { Dumbbell } from 'lucide-react'
import { GYM_NAME, ACCENT_COLOR, NAV_ITEMS } from '@/lib/constants'

const desktopNavItems = NAV_ITEMS.slice(0, -1) // Exclude contact from desktop nav

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" aria-label="Go to homepage">
            <Dumbbell className="h-8 w-8 text-[#00FF87]" aria-hidden="true" />
            <span className="font-heading text-xl font-bold tracking-tight text-foreground">
              {GYM_NAME}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block" aria-label="Main navigation">
            <ul className="flex items-center gap-1">
              {desktopNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#00FF87] focus:ring-offset-2 focus:ring-offset-[#0A0A0A]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm" className="h-10 px-4 text-sm font-medium">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="h-10 px-6 text-sm font-medium bg-[#00FF87] hover:bg-[#00E67A] text-[#0A0A0A]" style={{ backgroundColor: ACCENT_COLOR }}>
                Join Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <MobileMenu />
        </div>
      </div>
    </header>
  )

}
