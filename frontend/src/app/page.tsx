import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { RecentEmails } from '@/components/dashboard/RecentEmails'
import { QuickActions } from '@/components/dashboard/QuickActions'

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary">
          Monitor your email parsing pipeline and review processed emails
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


