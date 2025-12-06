'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Check, 
  RefreshCw, 
  AlertTriangle,
  Loader2,
  CheckCircle,
  Sparkles,
  AlertCircle
} from 'lucide-react'
import { JsonEditor } from '@/components/email/JsonEditor'
import { useEmail, useUpdateEmail, useParseEmail } from '@/lib/hooks'
import { cn } from '@/lib/utils'

export default function EmailDetailPage() {
  const params = useParams()
  const router = useRouter()
  const emailId = params.id as string
  
  const { data: email, isLoading, error, refetch } = useEmail(emailId)
  const updateEmail = useUpdateEmail()
  const parseEmail = useParseEmail()
  
  const [editedData, setEditedData] = useState<any>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (email) {
      setEditedData(email.corrected_data || email.parsed_data || null)
      setHasChanges(false)
      setSaveSuccess(false)
    }
  }, [email])

  const handleJsonChange = (newData: any) => {
    setEditedData(newData)
    setHasChanges(true)
    setSaveSuccess(false)
  }

  const handleSave = async () => {
    if (!email) return
    
    try {
      await updateEmail.mutateAsync({
        id: email.id,
        corrected_data: editedData,
        status: 'reviewed',
      })
      setHasChanges(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      refetch()
    } catch (error) {
      console.error('Failed to save:', error)
      alert('Failed to save changes')
    }
  }

  const handleMarkReviewed = async () => {
    if (!email) return
    
    try {
      await updateEmail.mutateAsync({
        id: email.id,
        status: 'reviewed',
      })
      refetch()
    } catch (error) {
      console.error('Failed to mark reviewed:', error)
    }
  }

  const handleParse = async () => {
    if (!email) return
    
    try {
      await parseEmail.mutateAsync(email.id)
      refetch()
    } catch (error: any) {
      console.error('Failed to parse:', error)
      alert(`Parsing failed: ${error.response?.data?.detail || error.message}`)
    }
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-text-muted" />
      </div>
    )
  }

  if (error || !email) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <AlertTriangle className="w-10 h-10 text-error" />
        <p className="text-text-secondary">Email not found</p>
        <button onClick={() => router.back()} className="btn btn-secondary text-sm">
          Go Back
        </button>
      </div>
    )
  }

  const needsParsing = !email.parsed_data && email.status === 'pending'
  const canReparse = email.status !== 'parsing'

  const statusColors: Record<string, string> = {
    reviewed: 'bg-success/15 text-success',
    parsed: 'bg-info/15 text-info',
    parsing: 'bg-primary-500/15 text-primary-400',
    failed: 'bg-error/15 text-error',
    pending: 'bg-warning/15 text-warning',
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 px-4 py-3 border-b border-border bg-surface">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3 min-w-0">
            <button 
              onClick={() => router.back()}
              className="btn btn-ghost p-2 flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-medium text-text-primary truncate">
                  {email.subject || 'No Subject'}
                </h1>
                <span className={cn('badge text-xs flex-shrink-0', statusColors[email.status] || statusColors.pending)}>
                  {email.status}
                </span>
              </div>
              <p className="text-xs text-text-muted truncate">
                {email.sender_name || 'Unknown'} &lt;{email.sender}&gt;
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {saveSuccess && (
              <span className="text-success flex items-center gap-1 text-xs">
                <CheckCircle className="w-3.5 h-3.5" />
                Saved
              </span>
            )}
            
            {canReparse && (
              <button 
                onClick={handleParse}
                disabled={parseEmail.isPending}
                className={cn('btn text-sm', needsParsing ? 'btn-primary' : 'btn-secondary')}
              >
                {parseEmail.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                {parseEmail.isPending ? 'Parsing...' : needsParsing ? 'Parse' : 'Re-parse'}
              </button>
            )}
            
            {email.status === 'parsed' && !hasChanges && (
              <button 
                onClick={handleMarkReviewed}
                disabled={updateEmail.isPending}
                className="btn btn-secondary text-sm"
              >
                <Check className="w-3.5 h-3.5" />
                Mark Reviewed
              </button>
            )}
            
            <button 
              onClick={handleSave}
              disabled={!hasChanges || updateEmail.isPending || !editedData}
              className="btn btn-primary text-sm"
            >
              {updateEmail.isPending ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              {hasChanges ? 'Save' : 'Saved'}
            </button>
          </div>
        </div>
      </header>

      {/* Status banners */}
      {parseEmail.isPending && (
        <div className="px-4 py-2 bg-primary-500/10 border-b border-primary-500/20 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-primary-400" />
          <span className="text-primary-400 text-sm">Parsing with AI...</span>
        </div>
      )}
      
      {email.status === 'failed' && email.error_message && (
        <div className="px-4 py-2 bg-error/10 border-b border-error/20 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-error" />
          <span className="text-error text-sm">Error: {email.error_message}</span>
        </div>
      )}

      {/* Side by side view */}
      <div className="flex-1 flex overflow-hidden">
        {/* Original Email */}
        <div className="w-1/2 flex flex-col border-r border-border">
          <div className="flex-shrink-0 px-4 py-2 border-b border-border bg-surface-light">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
              Original Email
            </span>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <pre className="whitespace-pre-wrap font-sans text-text-primary text-sm leading-relaxed">
              {email.body_text || 'No content'}
            </pre>
          </div>
        </div>

        {/* Parsed Data */}
        <div className="w-1/2 flex flex-col">
          <div className="flex-shrink-0 px-4 py-2 border-b border-border bg-surface-light flex items-center justify-between">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
              Parsed Data
            </span>
            {hasChanges && (
              <span className="text-xs text-warning flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Unsaved
              </span>
            )}
          </div>
          <div className="flex-1 overflow-auto">
            {editedData ? (
              <JsonEditor 
                value={editedData} 
                onChange={handleJsonChange}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-text-muted gap-3 p-4">
                <Sparkles className="w-10 h-10 text-text-muted/30" />
                <p className="text-sm">No parsed data</p>
                <button 
                  onClick={handleParse}
                  disabled={parseEmail.isPending}
                  className="btn btn-primary text-sm"
                >
                  {parseEmail.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  Parse with AI
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
