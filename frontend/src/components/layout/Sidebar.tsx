'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Mail, 
  Settings, 
  FileJson, 
  Link as LinkIcon,
  Inbox,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Emails', href: '/emails', icon: Mail },
  { name: 'Schema Editor', href: '/schema', icon: FileJson },
  { name: 'Gmail Accounts', href: '/accounts', icon: LinkIcon },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
            <Mail className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg">EmailParser</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-light'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Status indicators */}
      <div className="p-4 border-t border-border space-y-3">
        <div className="text-xs font-medium text-text-muted uppercase tracking-wider">
          Pipeline Status
        </div>
        <div className="space-y-2">
          <StatusItem icon={Inbox} label="Pending" count={12} color="warning" />
          <StatusItem icon={CheckCircle} label="Reviewed" count={156} color="success" />
          <StatusItem icon={AlertCircle} label="Failed" count={3} color="error" />
        </div>
      </div>
    </aside>
  )
}

function StatusItem({ 
  icon: Icon, 
  label, 
  count, 
  color 
}: { 
  icon: any; 
  label: string; 
  count: number;
  color: 'success' | 'warning' | 'error';
}) {
  const colorClasses = {
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
  }

  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-text-secondary">
        <Icon className={cn('w-4 h-4', colorClasses[color])} />
        <span>{label}</span>
      </div>
      <span className={cn('font-mono font-medium', colorClasses[color])}>
        {count}
      </span>
    </div>
  )
}


