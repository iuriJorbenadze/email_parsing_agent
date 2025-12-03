'use client'

import { Mail, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

const stats = [
  {
    name: 'Total Emails',
    value: '1,284',
    change: '+12%',
    changeType: 'positive',
    icon: Mail,
    gradient: 'from-primary-500 to-primary-600',
  },
  {
    name: 'Reviewed',
    value: '1,156',
    change: '+8%',
    changeType: 'positive',
    icon: CheckCircle,
    gradient: 'from-success to-emerald-600',
  },
  {
    name: 'Pending Review',
    value: '98',
    change: '-23%',
    changeType: 'positive',
    icon: Clock,
    gradient: 'from-warning to-amber-600',
  },
  {
    name: 'Parse Errors',
    value: '30',
    change: '+2',
    changeType: 'negative',
    icon: AlertTriangle,
    gradient: 'from-error to-rose-600',
  },
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.name}
          className="card group hover:border-primary-500/30 transition-all duration-300 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-text-secondary">{stat.name}</p>
              <p className="mt-2 text-3xl font-bold font-mono">{stat.value}</p>
            </div>
            <div className={cn(
              'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center',
              stat.gradient
            )}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className={cn(
              'text-sm font-medium',
              stat.changeType === 'positive' ? 'text-success' : 'text-error'
            )}>
              {stat.change}
            </span>
            <span className="text-sm text-text-muted">vs last week</span>
          </div>
        </div>
      ))}
    </div>
  )
}


