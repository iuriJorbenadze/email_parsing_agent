'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ArrowRight, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock data - will be replaced with API call
const recentEmails = [
  {
    id: 1,
    subject: 'Partnership Opportunity - Tech Blog Network',
    sender: 'john@techblog.com',
    senderName: 'John Smith',
    receivedAt: new Date(Date.now() - 1000 * 60 * 30),
    status: 'pending',
  },
  {
    id: 2,
    subject: 'Guest Post Offer - $150 per article',
    sender: 'marketing@seoagency.io',
    senderName: 'Marketing Team',
    receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: 'parsed',
  },
  {
    id: 3,
    subject: 'Link Exchange Proposal - DA 45 Site',
    sender: 'outreach@linkbuilder.com',
    senderName: 'Sarah Wilson',
    receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    status: 'reviewed',
  },
  {
    id: 4,
    subject: 'Sponsored Content Request - Finance Niche',
    sender: 'ads@financepro.net',
    senderName: 'Finance Pro',
    receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    status: 'failed',
  },
  {
    id: 5,
    subject: 'Website Acquisition Inquiry',
    sender: 'buyer@webflippers.com',
    senderName: 'Mike Chen',
    receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    status: 'reviewed',
  },
]

const statusConfig = {
  pending: { label: 'Pending', class: 'badge-pending' },
  parsed: { label: 'Parsed', class: 'badge-parsed' },
  reviewed: { label: 'Reviewed', class: 'badge-reviewed' },
  failed: { label: 'Failed', class: 'badge-failed' },
}

export function RecentEmails() {
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

      <div className="space-y-1">
        {recentEmails.map((email, index) => (
          <Link
            key={email.id}
            href={`/emails/${email.id}`}
            className="flex items-center gap-4 p-3 -mx-1 rounded-lg hover:bg-surface-light transition-colors group animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
              {email.senderName.charAt(0)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-text-primary truncate">
                  {email.senderName}
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
              <span className={cn('badge', statusConfig[email.status as keyof typeof statusConfig].class)}>
                {statusConfig[email.status as keyof typeof statusConfig].label}
              </span>
              <span className="text-xs text-text-muted w-16 text-right">
                {formatDistanceToNow(email.receivedAt, { addSuffix: false })}
              </span>
              <Eye className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}


