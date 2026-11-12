'use client'

import { Button } from '@/components/ui/button'

export default function MemberDashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
      <h1 className="text-xl font-semibold">Your dashboard is unavailable</h1>
      <p className="mt-2 text-sm text-muted-foreground">We could not load your account details. Please try again.</p>
      <Button className="mt-5" onClick={reset}>Try again</Button>
    </div>
  )
}
