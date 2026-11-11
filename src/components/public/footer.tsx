import Link from 'next/link'
import { Dumbbell, Globe } from 'lucide-react'
import { GYM_NAME, COPYRIGHT_YEAR, FOOTER_LINKS, SOCIAL_LINKS, ACCENT_COLOR } from '@/lib/constants'

export function Footer() {
  const socialIcons = {
  instagram: Globe,
  facebook: Globe,
  twitter: Globe,
  youtube: Globe,
}

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="Go to homepage">
              <Dumbbell className="h-8 w-8" style={{ color: ACCENT_COLOR }} aria-hidden="true" />
              <span className="font-heading text-xl font-bold tracking-tight text-foreground">
                {GYM_NAME}
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Where strength meets excellence. Transform your body, elevate your mind.
            </p>
            <div className="flex gap-4">
              {Object.entries(SOCIAL_LINKS).map(([key, href]) => {
                const Icon = socialIcons[key as keyof typeof socialIcons]
                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[#00FF87] transition-colors"
                    aria-label={key.charAt(0).toUpperCase() + key.slice(1)}
                  >
                    {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
                  </a>
                )
              })}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-[#00FF87] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Support</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-[#00FF87] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Programs</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.programs.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-[#00FF87] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Contact Us</h4>
            <address className="not-italic text-sm text-muted-foreground space-y-2">
              <p>{FOOTER_LINKS.contact.address}</p>
              <p>
                <a href={`tel:${FOOTER_LINKS.contact.phone}`} className="hover:text-[#00FF87] transition-colors">
                  {FOOTER_LINKS.contact.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${FOOTER_LINKS.contact.email}`} className="hover:text-[#00FF87] transition-colors">
                  {FOOTER_LINKS.contact.email}
                </a>
              </p>
              <p>{FOOTER_LINKS.contact.hours}</p>
            </address>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {COPYRIGHT_YEAR} {GYM_NAME}. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with passion for fitness excellence.
          </p>
        </div>
      </div>
    </footer>
  )
}
