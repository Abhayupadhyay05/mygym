export default function MemberDashboardLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading member dashboard">
      <div className="h-20 animate-pulse rounded-lg bg-white/5" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-40 animate-pulse rounded-xl border border-white/10 bg-white/[0.03]" />
        <div className="h-40 animate-pulse rounded-xl border border-white/10 bg-white/[0.03]" />
      </div>
    </div>
  )
}
