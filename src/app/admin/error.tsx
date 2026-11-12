'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function AdminDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin dashboard failed to load', { digest: error.digest })
  }, [error.digest])

  return (
    <div className="mx-auto max-w-xl rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
      <h1 className="text-xl font-semibold text-foreground">Dashboard unavailable</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The dashboard data could not be loaded. Check the database setup and try again.
      </p>
      <Button className="mt-5" onClick={reset}>Try again</Button>
    </div>
  )
}
