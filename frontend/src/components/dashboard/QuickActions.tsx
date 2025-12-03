'use client'

import Link from 'next/link'
import { 
  RefreshCw, 
  Plus, 
  FileJson, 
  Download,
  Zap
} from 'lucide-react'

const actions = [
  {
    name: 'Connect Gmail',
    description: 'Add a new Gmail inbox',
    href: '/accounts',
    icon: Plus,
    color: 'primary',
  },
  {
    name: 'Sync Emails',
    description: 'Fetch new emails now',
    href: '#',
    icon: RefreshCw,
    color: 'success',
    action: true,
  },
  {
    name: 'Edit Schema',
    description: 'Customize parsing fields',
    href: '/schema',
    icon: FileJson,
    color: 'accent',
  },
  {
    name: 'Export Data',
    description: 'Download parsed results',
    href: '#',
    icon: Download,
    color: 'info',
    action: true,
  },
]

const colorClasses = {
  primary: 'bg-primary-500/10 text-primary-400 group-hover:bg-primary-500/20',
  success: 'bg-success/10 text-success group-hover:bg-success/20',
  accent: 'bg-accent-500/10 text-accent-400 group-hover:bg-accent-500/20',
  info: 'bg-info/10 text-info group-hover:bg-info/20',
}

export function QuickActions() {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-warning" />
        <h2 className="text-lg font-semibold">Quick Actions</h2>
      </div>

      <div className="space-y-2">
        {actions.map((action, index) => {
          const Component = action.action ? 'button' : Link
          const props = action.action ? {} : { href: action.href }

          return (
            <Component
              key={action.name}
              {...(props as any)}
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
            </Component>
          )
        })}
      </div>
    </div>
  )
}


