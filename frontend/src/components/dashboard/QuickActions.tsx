'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  RefreshCw, 
  Plus, 
  FileJson, 
  Database,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useSeedData, useParseBatch } from '@/lib/hooks'

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
    <div className="bg-surface border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <h2 className="font-medium text-text-primary">Quick Actions</h2>
      </div>

      <div className="p-4 space-y-3">
        {/* Status messages */}
        {seedData.isSuccess && (
          <div className="p-3 bg-success/10 border border-success/20 rounded-md text-sm text-success flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            Sample data added!
          </div>
        )}
        
        {parseBatch.isSuccess && (
          <div className="p-3 bg-success/10 border border-success/20 rounded-md text-sm text-success flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            Processed {parseBatch.data?.successful || 0} of {parseBatch.data?.processed || 0} emails
          </div>
        )}
        
        {parseBatch.isError && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-md text-sm text-error flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            Processing failed
          </div>
        )}

        {/* Parse Batch */}
        <div className="p-3 bg-surface-light rounded-md space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-text-primary">Parse Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              className="input py-1.5 text-xs w-24"
              disabled={parseBatch.isPending}
            >
              <option value={1}>1 email</option>
              <option value={5}>5 emails</option>
              <option value={10}>10 emails</option>
              <option value={25}>25 emails</option>
            </select>
            <button
              onClick={handleParseBatch}
              disabled={parseBatch.isPending}
              className="btn btn-primary flex-1 py-1.5 text-xs"
            >
              {parseBatch.isPending ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              {parseBatch.isPending ? 'Processing...' : 'Parse'}
            </button>
          </div>
        </div>

        {/* Other actions */}
        <button
          onClick={handleSeedData}
          disabled={seedData.isPending}
          className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-surface-light transition-colors text-left disabled:opacity-50"
        >
          <div className="w-8 h-8 rounded-md bg-warning/10 flex items-center justify-center">
            {seedData.isPending ? (
              <RefreshCw className="w-4 h-4 text-warning animate-spin" />
            ) : (
              <Database className="w-4 h-4 text-warning" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">Seed Data</p>
            <p className="text-xs text-text-muted">Add test emails</p>
          </div>
        </button>

        <Link
          href="/accounts"
          className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-surface-light transition-colors"
        >
          <div className="w-8 h-8 rounded-md bg-info/10 flex items-center justify-center">
            <Plus className="w-4 h-4 text-info" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">Connect Gmail</p>
            <p className="text-xs text-text-muted">Add inbox</p>
          </div>
        </Link>

        <Link
          href="/schema"
          className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-surface-light transition-colors"
        >
          <div className="w-8 h-8 rounded-md bg-primary-500/10 flex items-center justify-center">
            <FileJson className="w-4 h-4 text-primary-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">Edit Schema</p>
            <p className="text-xs text-text-muted">Configure parsing</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
