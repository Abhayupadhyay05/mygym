import { Header } from '@/components/public/header'
import { Footer } from '@/components/public/footer'
import { WhatsAppFloat } from '@/components/public/whatsapp-float'

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
