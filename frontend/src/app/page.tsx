import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { RecentEmails } from '@/components/dashboard/RecentEmails'
import { QuickActions } from '@/components/dashboard/QuickActions'

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary text-sm mt-1">
          Monitor your email parsing pipeline
        </p>
      </div>

      {/* Stats */}
      <DashboardStats />

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Emails - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentEmails />
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
