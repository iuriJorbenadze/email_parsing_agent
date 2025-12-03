'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { 
  Search, 
  Filter, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock data - will be replaced with API call
const mockEmails = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  subject: [
    'Partnership Opportunity - Tech Blog Network',
    'Guest Post Offer - $150 per article',
    'Link Exchange Proposal - DA 45 Site',
    'Sponsored Content Request - Finance Niche',
    'Website Acquisition Inquiry',
  ][i % 5],
  sender: ['john@techblog.com', 'marketing@seoagency.io', 'outreach@linkbuilder.com', 'ads@financepro.net', 'buyer@webflippers.com'][i % 5],
  senderName: ['John Smith', 'Marketing Team', 'Sarah Wilson', 'Finance Pro', 'Mike Chen'][i % 5],
  receivedAt: new Date(Date.now() - 1000 * 60 * 60 * i * 3),
  status: ['pending', 'parsed', 'reviewed', 'failed', 'reviewed'][i % 5],
  account: 'inbox@company.com',
}))

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'parsed', label: 'Parsed' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'failed', label: 'Failed' },
]

const statusConfig = {
  pending: { label: 'Pending', class: 'badge-pending' },
  parsed: { label: 'Parsed', class: 'badge-parsed' },
  reviewed: { label: 'Reviewed', class: 'badge-reviewed' },
  failed: { label: 'Failed', class: 'badge-failed' },
}

export default function EmailsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredEmails = mockEmails.filter(email => {
    const matchesSearch = !searchQuery || 
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.sender.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || email.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
        <button className="btn btn-primary">
          <RefreshCw className="w-4 h-4" />
          Sync Now
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
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input pl-9 pr-8 appearance-none cursor-pointer"
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Email List */}
      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface-light">
              <th className="text-left text-sm font-medium text-text-muted px-4 py-3">Sender</th>
              <th className="text-left text-sm font-medium text-text-muted px-4 py-3">Subject</th>
              <th className="text-left text-sm font-medium text-text-muted px-4 py-3">Account</th>
              <th className="text-left text-sm font-medium text-text-muted px-4 py-3">Status</th>
              <th className="text-left text-sm font-medium text-text-muted px-4 py-3">Received</th>
              <th className="text-left text-sm font-medium text-text-muted px-4 py-3 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {filteredEmails.map((email) => (
              <tr 
                key={email.id} 
                className="border-b border-border last:border-0 hover:bg-surface-light/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xs font-medium">
                      {email.senderName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{email.senderName}</p>
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
                  <span className="text-sm text-text-secondary font-mono">
                    {email.account}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={cn('badge', statusConfig[email.status as keyof typeof statusConfig].class)}>
                    {statusConfig[email.status as keyof typeof statusConfig].label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-text-muted">
                    {formatDistanceToNow(email.receivedAt, { addSuffix: true })}
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

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-muted">
          Showing {filteredEmails.length} of {mockEmails.length} emails
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
            Page {currentPage}
          </span>
          <button 
            className="btn btn-secondary p-2"
            onClick={() => setCurrentPage(p => p + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}


