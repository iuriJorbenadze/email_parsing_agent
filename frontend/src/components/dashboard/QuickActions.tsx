'use client'

import Link from 'next/link'
import { 
  RefreshCw, 
  Plus, 
  FileJson, 
  Download,
  Zap,
  Database
} from 'lucide-react'
import { useSeedData } from '@/lib/hooks'

const colorClasses = {
  primary: 'bg-primary-500/10 text-primary-400 group-hover:bg-primary-500/20',
  success: 'bg-success/10 text-success group-hover:bg-success/20',
  accent: 'bg-accent-500/10 text-accent-400 group-hover:bg-accent-500/20',
  info: 'bg-info/10 text-info group-hover:bg-info/20',
  warning: 'bg-warning/10 text-warning group-hover:bg-warning/20',
}

export function QuickActions() {
  const seedData = useSeedData()

  const handleSeedData = () => {
    seedData.mutate()
  }

  const actions = [
    {
      name: 'Seed Sample Data',
      description: 'Add test emails to database',
      icon: Database,
      color: 'warning',
      onClick: handleSeedData,
      loading: seedData.isPending,
    },
    {
      name: 'Connect Gmail',
      description: 'Add a new Gmail inbox',
      href: '/accounts',
      icon: Plus,
      color: 'primary',
    },
    {
      name: 'Edit Schema',
      description: 'Customize parsing fields',
      href: '/schema',
      icon: FileJson,
      color: 'accent',
    },
  ]

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-warning" />
        <h2 className="text-lg font-semibold">Quick Actions</h2>
      </div>

      {seedData.isSuccess && (
        <div className="mb-4 p-3 bg-success/10 border border-success/20 rounded-lg text-sm text-success">
          ✓ Sample data added! Refresh to see emails.
        </div>
      )}

      <div className="space-y-2">
        {actions.map((action, index) => {
          if (action.onClick) {
            return (
              <button
                key={action.name}
                onClick={action.onClick}
                disabled={action.loading}
                className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-surface-light transition-all group animate-fade-in text-left disabled:opacity-50"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${colorClasses[action.color as keyof typeof colorClasses]}`}>
                  {action.loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <action.icon className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-text-primary group-hover:text-primary-400 transition-colors">
                    {action.name}
                  </p>
                  <p className="text-sm text-text-muted">
                    {action.description}
                  </p>
                </div>
              </button>
            )
          }

          return (
            <Link
              key={action.name}
              href={action.href!}
              className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-surface-light transition-all group animate-fade-in text-left"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${colorClasses[action.color as keyof typeof colorClasses]}`}>
                <action.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-text-primary group-hover:text-primary-400 transition-colors">
                  {action.name}
                </p>
                <p className="text-sm text-text-muted">
                  {action.description}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
