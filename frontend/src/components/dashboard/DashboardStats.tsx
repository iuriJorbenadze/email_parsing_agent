'use client'

import { Mail, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEmails } from '@/lib/hooks'

export function DashboardStats() {
  const { data, isLoading } = useEmails({ page_size: 1000 })
  
  // Calculate stats from real data
  const stats = {
    total: data?.total || 0,
    pending: 0,
    parsed: 0,
    reviewed: 0,
    failed: 0,
  }
  
  if (data?.emails) {
    for (const email of data.emails) {
      if (email.status === 'pending') stats.pending++
      else if (email.status === 'parsed') stats.parsed++
      else if (email.status === 'reviewed') stats.reviewed++
      else if (email.status === 'failed') stats.failed++
    }
  }

  const statItems = [
    {
      name: 'Total Emails',
      value: stats.total,
      icon: Mail,
      gradient: 'from-primary-500 to-primary-600',
    },
    {
      name: 'Reviewed',
      value: stats.reviewed,
      icon: CheckCircle,
      gradient: 'from-success to-emerald-600',
    },
    {
      name: 'Pending Review',
      value: stats.pending + stats.parsed,
      icon: Clock,
      gradient: 'from-warning to-amber-600',
    },
    {
      name: 'Parse Errors',
      value: stats.failed,
      icon: AlertTriangle,
      gradient: 'from-error to-rose-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat, index) => (
        <div
          key={stat.name}
          className="card group hover:border-primary-500/30 transition-all duration-300 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-text-secondary">{stat.name}</p>
              <p className="mt-2 text-3xl font-bold font-mono">
                {isLoading ? '...' : stat.value}
              </p>
            </div>
            <div className={cn(
              'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center',
              stat.gradient
            )}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
