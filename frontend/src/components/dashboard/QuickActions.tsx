'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  RefreshCw, 
  Plus, 
  FileJson, 
  Zap,
  Database,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useSeedData, useParseBatch } from '@/lib/hooks'

const colorClasses = {
  primary: 'bg-primary-500/10 text-primary-400 group-hover:bg-primary-500/20',
  success: 'bg-success/10 text-success group-hover:bg-success/20',
  accent: 'bg-accent-500/10 text-accent-400 group-hover:bg-accent-500/20',
  info: 'bg-info/10 text-info group-hover:bg-info/20',
  warning: 'bg-warning/10 text-warning group-hover:bg-warning/20',
}

export function QuickActions() {
  const seedData = useSeedData()
  const parseBatch = useParseBatch()
  const [batchSize, setBatchSize] = useState(5)

  const handleSeedData = () => {
    seedData.mutate()
  }

  const handleParseBatch = () => {
    parseBatch.mutate(batchSize)
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-warning" />
        <h2 className="text-lg font-semibold">Quick Actions</h2>
      </div>

      {/* Status messages */}
      {seedData.isSuccess && (
        <div className="mb-4 p-3 bg-success/10 border border-success/20 rounded-lg text-sm text-success flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Sample data added!
        </div>
      )}
      
      {parseBatch.isSuccess && (
        <div className="mb-4 p-3 bg-success/10 border border-success/20 rounded-lg text-sm text-success flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Processed {parseBatch.data?.successful || 0} of {parseBatch.data?.processed || 0} emails
        </div>
      )}
      
      {parseBatch.isError && (
        <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-sm text-error flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Batch processing failed
        </div>
      )}

      <div className="space-y-3">
        {/* Parse Batch - Special UI */}
        <div className="p-3 rounded-lg bg-surface-light border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses.accent}`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-text-primary">Process Pending Emails</p>
              <p className="text-sm text-text-muted">Parse with AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              className="input py-1.5 text-sm flex-shrink-0 w-24"
              disabled={parseBatch.isPending}
            >
              <option value={1}>1 email</option>
              <option value={5}>5 emails</option>
              <option value={10}>10 emails</option>
              <option value={25}>25 emails</option>
              <option value={50}>50 emails</option>
            </select>
            <button
              onClick={handleParseBatch}
              disabled={parseBatch.isPending}
              className="btn btn-primary flex-1 py-1.5 text-sm"
            >
              {parseBatch.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Parse Now
                </>
              )}
            </button>
          </div>
        </div>

        {/* Other actions */}
        <button
          onClick={handleSeedData}
          disabled={seedData.isPending}
          className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-surface-light transition-all group text-left disabled:opacity-50"
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${colorClasses.warning}`}>
            {seedData.isPending ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Database className="w-5 h-5" />
            )}
          </div>
          <div>
            <p className="font-medium text-text-primary group-hover:text-primary-400 transition-colors">
              Seed Sample Data
            </p>
            <p className="text-sm text-text-muted">
              Add test emails
            </p>
          </div>
        </button>

        <Link
          href="/accounts"
          className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-surface-light transition-all group text-left"
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${colorClasses.primary}`}>
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium text-text-primary group-hover:text-primary-400 transition-colors">
              Connect Gmail
            </p>
            <p className="text-sm text-text-muted">
              Add a new inbox
            </p>
          </div>
        </Link>

        <Link
          href="/schema"
          className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-surface-light transition-all group text-left"
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${colorClasses.info}`}>
            <FileJson className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium text-text-primary group-hover:text-primary-400 transition-colors">
              Edit Schema
            </p>
            <p className="text-sm text-text-muted">
              Customize parsing fields
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
