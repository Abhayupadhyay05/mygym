import Link from 'next/link'
import { Dumbbell } from 'lucide-react'
import { SignOutButton } from '@/components/shared/sign-out-button'
import { requireRole } from '@/lib/auth/authorization'

export const instant = false

export default async function TrainerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { profile } = await requireRole(['TRAINER'])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-white/10 bg-[#0A0A0A]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/trainer" className="flex items-center gap-3" aria-label="Trainer dashboard">
            <Dumbbell className="h-7 w-7 text-[#00FF87]" aria-hidden="true" />
            <span className="font-semibold text-foreground">Trainer Portal</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground sm:inline">{profile.full_name}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
