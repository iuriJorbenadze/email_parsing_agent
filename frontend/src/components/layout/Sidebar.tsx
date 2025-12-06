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
  AlertCircle,
  Sparkles
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
    <aside className="w-60 bg-surface flex flex-col border-r border-border">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-text-primary">EmailParser</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-surface-light text-text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-light'
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Status indicators */}
      <div className="p-3 border-t border-border">
        <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 px-1">
          Pipeline
        </div>
        <div className="space-y-1">
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
    <div className="flex items-center justify-between text-xs px-1 py-1">
      <div className="flex items-center gap-2 text-text-secondary">
        <Icon className={cn('w-3.5 h-3.5', colorClasses[color])} />
        <span>{label}</span>
      </div>
      <span className={cn('font-mono', colorClasses[color])}>
        {count}
      </span>
    </div>
  )
}
