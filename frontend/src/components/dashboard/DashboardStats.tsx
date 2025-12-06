'use client'

import { Mail, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
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
      name: 'Total',
      value: stats.total,
      icon: Mail,
      color: 'text-text-secondary',
      bg: 'bg-surface-lighter',
    },
    {
      name: 'Reviewed',
      value: stats.reviewed,
      icon: CheckCircle,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      name: 'Pending',
      value: stats.pending + stats.parsed,
      icon: Clock,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      name: 'Failed',
      value: stats.failed,
      icon: AlertTriangle,
      color: 'text-error',
      bg: 'bg-error/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((stat) => (
        <div
          key={stat.name}
          className="bg-surface border border-border rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-text-secondary text-sm">{stat.name}</span>
            <div className={`w-8 h-8 rounded-md ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </div>
          <p className="text-2xl font-semibold text-text-primary font-mono">
            {isLoading ? '—' : stat.value}
          </p>
        </div>
      ))}
    </div>
  )
}
