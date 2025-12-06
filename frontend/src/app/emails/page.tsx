'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Filter, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Inbox,
  ChevronRight as ChevronRightIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEmails } from '@/lib/hooks'

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'parsed', label: 'Parsed' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'failed', label: 'Failed' },
]

const statusConfig = {
  pending: { label: 'Pending', class: 'badge-pending' },
  parsing: { label: 'Parsing', class: 'badge-parsing' },
  parsed: { label: 'Parsed', class: 'badge-parsed' },
  reviewed: { label: 'Reviewed', class: 'badge-reviewed' },
  failed: { label: 'Failed', class: 'badge-failed' },
}

export default function EmailsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20

  const { data, isLoading, refetch } = useEmails({
    status: statusFilter || undefined,
    page: currentPage,
    page_size: pageSize,
  })

  const emails = data?.emails || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / pageSize)

  // Client-side search filter
  const filteredEmails = searchQuery
    ? emails.filter((email: any) =>
        email.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.sender?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.sender_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : emails

  const handleRowClick = (emailId: number) => {
    router.push(`/emails/${emailId}`)
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Emails</h1>
          <p className="text-text-secondary text-sm mt-1">
            {total} total emails
          </p>
        </div>
        <button 
          onClick={() => refetch()}
          disabled={isLoading}
          className="btn btn-secondary"
        >
          <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setCurrentPage(1)
          }}
          className="input w-36"
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Email List */}
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-surface rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredEmails.length === 0 ? (
        <div className="text-center py-16">
          <Inbox className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-1">
            No emails found
          </h3>
          <p className="text-text-secondary text-sm">
            {statusFilter ? 'Try changing the status filter' : 'Connect a Gmail account to get started'}
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {filteredEmails.map((email: any) => (
            <div
              key={email.id}
              onClick={() => handleRowClick(email.id)}
              className="group flex items-center gap-4 p-4 bg-surface hover:bg-surface-light rounded-lg cursor-pointer transition-colors border border-transparent hover:border-border"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-surface-lighter flex items-center justify-center text-text-secondary text-sm font-medium flex-shrink-0">
                {(email.sender_name || email.sender || '?').charAt(0).toUpperCase()}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-text-primary text-sm">
                    {email.sender_name || 'Unknown'}
                  </span>
                  <span className="text-text-muted text-xs">
                    {email.sender}
                  </span>
                </div>
                <p className="text-text-secondary text-sm truncate">
                  {email.subject || '(No subject)'}
                </p>
              </div>

              {/* Status */}
              <span className={cn('badge flex-shrink-0', statusConfig[email.status as keyof typeof statusConfig]?.class || 'badge-pending')}>
                {statusConfig[email.status as keyof typeof statusConfig]?.label || email.status}
              </span>

              {/* Date */}
              <span className="text-text-muted text-xs w-24 text-right flex-shrink-0">
                {email.received_at ? new Date(email.received_at).toLocaleDateString() : '-'}
              </span>

              {/* Arrow */}
              <ChevronRightIcon className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > pageSize && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-sm text-text-muted">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button 
              className="btn btn-ghost p-2"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              className="btn btn-ghost p-2"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
