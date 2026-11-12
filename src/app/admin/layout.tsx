import Link from 'next/link'
import { Activity, CreditCard, Dumbbell, ReceiptText, UserRoundCog, Users } from 'lucide-react'
import { SignOutButton } from '@/components/shared/sign-out-button'
import { requireRole } from '@/lib/auth/authorization'

export const instant = false

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { profile } = await requireRole(['OWNER', 'RECEPTIONIST'])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-white/10 bg-[#0A0A0A]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-3" aria-label="Admin dashboard">
              <Dumbbell className="h-7 w-7 text-[#00FF87]" aria-hidden="true" />
              <span className="font-semibold text-foreground">Gym Management</span>
            </Link>
            <nav aria-label="Admin navigation" className="hidden items-center gap-3 xl:flex">
              <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">Dashboard</Link>
              <Link href="/admin/members" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <Users className="h-4 w-4" aria-hidden="true" />
                Members
              </Link>
              <Link href="/admin/memberships" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <CreditCard className="h-4 w-4" aria-hidden="true" />
                Memberships
              </Link>
              <Link href="/admin/membership-plans" className="text-sm text-muted-foreground hover:text-foreground">Plans</Link>
              <Link href="/admin/payments" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ReceiptText className="h-4 w-4" aria-hidden="true" />
                Payments
              </Link>
              <Link href="/admin/attendance" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <Activity className="h-4 w-4" aria-hidden="true" />
                Attendance
              </Link>
              <Link href="/admin/trainers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <UserRoundCog className="h-4 w-4" aria-hidden="true" />
                Trainers
              </Link>
              <Link href="/admin/enquiries" className="text-sm text-muted-foreground hover:text-foreground">Enquiries</Link>
              <Link href="/admin/notifications" className="text-sm text-muted-foreground hover:text-foreground">Notifications</Link>
              <Link href="/admin/reports" className="text-sm text-muted-foreground hover:text-foreground">Reports</Link>
              {profile.role === 'OWNER' && (
                <Link href="/admin/settings" className="text-sm text-muted-foreground hover:text-foreground">Settings</Link>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground sm:inline">{profile.full_name}</span>
            <SignOutButton />
          </div>
        </div>
        <nav aria-label="Admin navigation" className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-2 px-4 pb-3 xl:hidden">
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">Dashboard</Link>
          <Link href="/admin/members" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <Users className="h-4 w-4" aria-hidden="true" />
            Members
          </Link>
          <Link href="/admin/memberships" className="text-sm text-muted-foreground hover:text-foreground">Memberships</Link>
          <Link href="/admin/membership-plans" className="text-sm text-muted-foreground hover:text-foreground">Plans</Link>
          <Link href="/admin/payments" className="text-sm text-muted-foreground hover:text-foreground">Payments</Link>
          <Link href="/admin/attendance" className="text-sm text-muted-foreground hover:text-foreground">Attendance</Link>
          <Link href="/admin/trainers" className="text-sm text-muted-foreground hover:text-foreground">Trainers</Link>
          <Link href="/admin/enquiries" className="text-sm text-muted-foreground hover:text-foreground">Enquiries</Link>
          <Link href="/admin/notifications" className="text-sm text-muted-foreground hover:text-foreground">Notifications</Link>
          <Link href="/admin/reports" className="text-sm text-muted-foreground hover:text-foreground">Reports</Link>
          {profile.role === 'OWNER' && (
            <Link href="/admin/settings" className="text-sm text-muted-foreground hover:text-foreground">Settings</Link>
          )}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
