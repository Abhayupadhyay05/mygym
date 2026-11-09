import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL("https://premiumfitness.com"),
  title: {
    default: 'Premium Fitness Gym | Where Strength Meets Excellence',
    template: '%s | Premium Fitness Gym',
  },
  description: 'State-of-the-art facility with expert trainers, modern equipment, and personalized fitness programs designed for your success.',
  keywords: ['gym', 'fitness', 'workout', 'personal training', 'membership', 'health', 'wellness', 'strength training'],
  authors: [{ name: 'Premium Fitness Gym' }],
  creator: 'Premium Fitness Gym',
  publisher: 'Premium Fitness Gym',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://premiumfitness.com',
    siteName: 'Premium Fitness Gym',
    title: 'Premium Fitness Gym | Where Strength Meets Excellence',
    description: 'State-of-the-art facility with expert trainers, modern equipment, and personalized fitness programs designed for your success.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Premium Fitness Gym',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Fitness Gym',
    description: 'State-of-the-art facility with expert trainers and personalized fitness programs.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
