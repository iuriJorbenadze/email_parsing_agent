'use client'

import Link from 'next/link'
import { ArrowRight, Eye, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEmails } from '@/lib/hooks'

const statusConfig = {
  pending: { label: 'Pending', class: 'badge-pending' },
  parsing: { label: 'Parsing', class: 'badge-pending' },
  parsed: { label: 'Parsed', class: 'badge-parsed' },
  reviewed: { label: 'Reviewed', class: 'badge-reviewed' },
  failed: { label: 'Failed', class: 'badge-failed' },
}

export function RecentEmails() {
  const { data, isLoading } = useEmails({ page: 1, page_size: 5 })
  const emails = data?.emails || []

  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-surface-light rounded w-1/4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-surface-light rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Emails</h2>
        <Link 
          href="/emails" 
          className="btn btn-ghost text-sm group"
        >
          View all
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {emails.length === 0 ? (
        <div className="text-center py-8">
          <Inbox className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary">No emails yet</p>
          <p className="text-sm text-text-muted mt-1">
            Connect a Gmail account or seed sample data
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {emails.map((email: any, index: number) => (
            <Link
              key={email.id}
              href={`/emails/${email.id}`}
              className="flex items-center gap-4 p-3 -mx-1 rounded-lg hover:bg-surface-light transition-colors group animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                {(email.sender_name || email.sender || '?').charAt(0).toUpperCase()}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-text-primary truncate">
                    {email.sender_name || 'Unknown'}
                  </span>
                  <span className="text-text-muted text-sm truncate">
                    &lt;{email.sender}&gt;
                  </span>
                </div>
                <p className="text-sm text-text-secondary truncate mt-0.5">
                  {email.subject}
                </p>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={cn('badge', statusConfig[email.status as keyof typeof statusConfig]?.class || 'badge-pending')}>
                  {statusConfig[email.status as keyof typeof statusConfig]?.label || email.status}
                </span>
                <Eye className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
