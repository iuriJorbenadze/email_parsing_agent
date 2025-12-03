'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Search, 
  Filter, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Inbox
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
  parsing: { label: 'Parsing', class: 'badge-pending' },
  parsed: { label: 'Parsed', class: 'badge-parsed' },
  reviewed: { label: 'Reviewed', class: 'badge-reviewed' },
  failed: { label: 'Failed', class: 'badge-failed' },
}

export default function EmailsPage() {
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

  // Client-side search filter (for subject/sender)
  const filteredEmails = searchQuery
    ? emails.filter((email: any) =>
        email.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.sender?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.sender_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : emails

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Emails</h1>
          <p className="text-text-secondary mt-1">
            View and manage all parsed emails
          </p>
        </div>
        <button 
          onClick={() => refetch()}
          className="btn btn-primary"
        >
          <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="input pl-9 pr-8 appearance-none cursor-pointer"
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Email List */}
      {isLoading ? (
        <div className="card p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-surface-light rounded"></div>
            ))}
          </div>
        </div>
      ) : filteredEmails.length === 0 ? (
        <div className="card text-center py-12">
          <Inbox className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            No emails found
          </h3>
          <p className="text-text-secondary">
            {statusFilter ? 'Try changing the status filter' : 'Seed some data to get started'}
          </p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-light">
                <th className="text-left text-sm font-medium text-text-muted px-4 py-3">Sender</th>
                <th className="text-left text-sm font-medium text-text-muted px-4 py-3">Subject</th>
                <th className="text-left text-sm font-medium text-text-muted px-4 py-3">Status</th>
                <th className="text-left text-sm font-medium text-text-muted px-4 py-3">Received</th>
                <th className="text-left text-sm font-medium text-text-muted px-4 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {filteredEmails.map((email: any) => (
                <tr 
                  key={email.id} 
                  className="border-b border-border last:border-0 hover:bg-surface-light/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xs font-medium">
                        {(email.sender_name || email.sender || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{email.sender_name || 'Unknown'}</p>
                        <p className="text-xs text-text-muted">{email.sender}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-text-primary truncate max-w-xs">
                      {email.subject}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('badge', statusConfig[email.status as keyof typeof statusConfig]?.class || 'badge-pending')}>
                      {statusConfig[email.status as keyof typeof statusConfig]?.label || email.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-text-muted">
                      {email.received_at ? new Date(email.received_at).toLocaleDateString() : '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link 
                      href={`/emails/${email.id}`}
                      className="btn btn-ghost p-2"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-muted">
            Showing {filteredEmails.length} of {total} emails
          </p>
          <div className="flex items-center gap-2">
            <button 
              className="btn btn-secondary p-2"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-text-secondary px-3">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              className="btn btn-secondary p-2"
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
