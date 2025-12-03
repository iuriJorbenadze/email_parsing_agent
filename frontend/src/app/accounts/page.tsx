'use client'

import { useState } from 'react'
import { 
  Plus, 
  Mail, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGmailAccounts } from '@/lib/hooks'
import { api } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'

export default function AccountsPage() {
  const { data: accounts = [], isLoading, refetch } = useGmailAccounts()
  const [isConnecting, setIsConnecting] = useState(false)
  const queryClient = useQueryClient()

  const handleConnect = () => {
    setIsConnecting(true)
    // TODO: Implement Google OAuth flow
    setTimeout(() => setIsConnecting(false), 2000)
  }

  const handleSync = (accountId: number) => {
    // TODO: Implement sync
    console.log('Syncing account:', accountId)
  }

  const handleDisconnect = async (accountId: number) => {
    if (!confirm('Are you sure you want to disconnect this account? All associated emails will be deleted.')) {
      return
    }
    await api.delete(`/gmail-accounts/${accountId}`)
    queryClient.invalidateQueries({ queryKey: ['gmail-accounts'] })
    queryClient.invalidateQueries({ queryKey: ['emails'] })
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Gmail Accounts</h1>
          <p className="text-text-secondary mt-1">
            Connect and manage your Gmail inboxes
          </p>
        </div>
        <button 
          onClick={handleConnect}
          disabled={isConnecting}
          className="btn btn-primary"
        >
          {isConnecting ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Connect Gmail
        </button>
      </div>

      {/* Account List */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="card animate-pulse">
            <div className="h-20 bg-surface-light rounded"></div>
          </div>
        ) : accounts.length === 0 ? (
          <div className="card text-center py-12">
            <Mail className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No accounts connected
            </h3>
            <p className="text-text-secondary mb-6">
              Connect a Gmail account to start parsing emails
            </p>
            <button 
              onClick={handleConnect}
              className="btn btn-primary mx-auto"
            >
              <Plus className="w-4 h-4" />
              Connect Gmail
            </button>
          </div>
        ) : (
          accounts.map((account: any, index: number) => (
            <div 
              key={account.id}
              className="card flex items-center justify-between animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                {/* Gmail icon */}
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  account.is_active 
                    ? 'bg-gradient-to-br from-red-500 to-orange-500' 
                    : 'bg-surface-lighter'
                )}>
                  <Mail className="w-6 h-6 text-white" />
                </div>

                {/* Account info */}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-text-primary">
                      {account.display_name || account.email}
                    </h3>
                    {account.is_active ? (
                      <span className="badge bg-success/20 text-success">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="badge bg-error/20 text-error">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Disconnected
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary font-mono">
                    {account.email}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {account.email_count || 0} emails
                    </span>
                    {account.last_sync && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last sync: {new Date(account.last_sync).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleSync(account.id)}
                  className="btn btn-secondary"
                  disabled={!account.is_active}
                >
                  <RefreshCw className="w-4 h-4" />
                  Sync
                </button>
                <button 
                  onClick={() => handleDisconnect(account.id)}
                  className="btn btn-ghost text-error hover:bg-error/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* OAuth Info */}
      <div className="card bg-surface-light border-primary-500/20">
        <h3 className="font-semibold text-text-primary mb-2">
          Gmail Integration
        </h3>
        <p className="text-sm text-text-secondary mb-4">
          We use Google OAuth to securely connect to your Gmail accounts. We only request read access to your emails and will never send emails on your behalf.
        </p>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <CheckCircle className="w-4 h-4 text-success" />
          <span>Read-only access</span>
          <span className="text-border">•</span>
          <CheckCircle className="w-4 h-4 text-success" />
          <span>Secure OAuth 2.0</span>
          <span className="text-border">•</span>
          <CheckCircle className="w-4 h-4 text-success" />
          <span>Revoke anytime</span>
        </div>
      </div>
    </div>
  )
}
