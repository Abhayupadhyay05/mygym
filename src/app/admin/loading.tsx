export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading dashboard">
      <div className="h-20 animate-pulse rounded-lg bg-white/5" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 7 }, (_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-xl border border-white/10 bg-white/[0.03]" />
        ))}
      </div>
    </div>
  )
}
