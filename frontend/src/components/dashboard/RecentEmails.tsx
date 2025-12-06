'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Inbox, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEmails } from '@/lib/hooks'

const statusConfig = {
  pending: { label: 'Pending', class: 'badge-pending' },
  parsing: { label: 'Parsing', class: 'badge-parsing' },
  parsed: { label: 'Parsed', class: 'badge-parsed' },
  reviewed: { label: 'Reviewed', class: 'badge-reviewed' },
  failed: { label: 'Failed', class: 'badge-failed' },
}

export function RecentEmails() {
  const router = useRouter()
  const { data, isLoading } = useEmails({ page: 1, page_size: 5 })
  const emails = data?.emails || []

  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="h-5 w-32 bg-surface-light rounded mb-4" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 bg-surface-light rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-lg">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-medium text-text-primary">Recent Emails</h2>
        <Link 
          href="/emails" 
          className="text-sm text-text-secondary hover:text-text-primary flex items-center gap-1 transition-colors"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {emails.length === 0 ? (
        <div className="text-center py-12 px-4">
          <Inbox className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary text-sm">No emails yet</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {emails.map((email: any) => (
            <div
              key={email.id}
              onClick={() => router.push(`/emails/${email.id}`)}
              className="group flex items-center gap-3 p-3 hover:bg-surface-light cursor-pointer transition-colors"
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-surface-lighter flex items-center justify-center text-text-secondary text-xs font-medium flex-shrink-0">
                {(email.sender_name || email.sender || '?').charAt(0).toUpperCase()}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-primary truncate">
                    {email.sender_name || 'Unknown'}
                  </span>
                </div>
                <p className="text-xs text-text-secondary truncate mt-0.5">
                  {email.subject || '(No subject)'}
                </p>
              </div>

              {/* Status */}
              <span className={cn('badge text-xs flex-shrink-0', statusConfig[email.status as keyof typeof statusConfig]?.class || 'badge-pending')}>
                {statusConfig[email.status as keyof typeof statusConfig]?.label || email.status}
              </span>

              <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
