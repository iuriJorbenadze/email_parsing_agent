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

  // Initialize edited data when email loads
  useEffect(() => {
    if (email) {
      // Use corrected_data if exists, otherwise parsed_data
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
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (error || !email) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <AlertTriangle className="w-12 h-12 text-error" />
        <p className="text-text-secondary">Email not found</p>
        <button onClick={() => router.back()} className="btn btn-secondary">
          Go Back
        </button>
      </div>
    )
  }

  const needsParsing = !email.parsed_data && email.status === 'pending'
  const canReparse = email.status !== 'parsing'

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 px-6 py-4 border-b border-border bg-surface/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="btn btn-ghost p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold truncate max-w-xl">
                {email.subject || 'No Subject'}
              </h1>
              <p className="text-sm text-text-secondary">
                From {email.sender_name || 'Unknown'} &lt;{email.sender}&gt;
                {email.status && (
                  <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                    email.status === 'reviewed' ? 'bg-success/20 text-success' :
                    email.status === 'parsed' ? 'bg-info/20 text-info' :
                    email.status === 'parsing' ? 'bg-warning/20 text-warning' :
                    email.status === 'failed' ? 'bg-error/20 text-error' :
                    'bg-warning/20 text-warning'
                  }`}>
                    {email.status}
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-success flex items-center gap-1 text-sm">
                <CheckCircle className="w-4 h-4" />
                Saved!
              </span>
            )}
            
            {/* Parse / Re-parse button */}
            {canReparse && (
              <button 
                onClick={handleParse}
                disabled={parseEmail.isPending}
                className={`btn ${needsParsing ? 'btn-primary' : 'btn-secondary'}`}
              >
                {parseEmail.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {parseEmail.isPending ? 'Parsing...' : needsParsing ? 'Parse with AI' : 'Re-parse'}
              </button>
            )}
            
            {/* Mark Reviewed button */}
            {email.status === 'parsed' && !hasChanges && (
              <button 
                onClick={handleMarkReviewed}
                disabled={updateEmail.isPending}
                className="btn btn-secondary"
              >
                <Check className="w-4 h-4" />
                Mark Reviewed
              </button>
            )}
            
            {/* Save Changes button */}
            <button 
              onClick={handleSave}
              disabled={!hasChanges || updateEmail.isPending || !editedData}
              className="btn btn-primary"
            >
              {updateEmail.isPending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              {hasChanges ? 'Save Changes' : 'Saved'}
            </button>
          </div>
        </div>
      </header>

      {/* Parsing status banner */}
      {parseEmail.isPending && (
        <div className="px-6 py-3 bg-primary-500/10 border-b border-primary-500/20 flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary-400" />
          <span className="text-primary-300">Parsing email with AI... This may take a few seconds.</span>
        </div>
      )}
      
      {email.status === 'failed' && email.error_message && (
        <div className="px-6 py-3 bg-error/10 border-b border-error/20 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-error" />
          <span className="text-error">Parsing failed: {email.error_message}</span>
        </div>
      )}

      {/* Side by side view */}
      <div className="flex-1 flex overflow-hidden">
        {/* Original Email */}
        <div className="w-1/2 flex flex-col border-r border-border">
          <div className="flex-shrink-0 px-4 py-3 border-b border-border bg-surface-light">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
              Original Email
            </h2>
          </div>
          <div className="flex-1 overflow-auto p-6">
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-text-primary text-sm leading-relaxed bg-transparent p-0 m-0">
                {email.body_text || 'No content'}
              </pre>
            </div>
          </div>
        </div>

        {/* Parsed Data */}
        <div className="w-1/2 flex flex-col">
          <div className="flex-shrink-0 px-4 py-3 border-b border-border bg-surface-light flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
              {editedData ? 'Parsed Data (Editable)' : 'No Parsed Data'}
            </h2>
            {hasChanges && (
              <span className="text-xs text-warning flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Unsaved changes
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
              <div className="flex flex-col items-center justify-center h-full text-text-muted gap-4">
                <Sparkles className="w-12 h-12 text-text-muted/50" />
                <p>No parsed data yet</p>
                <button 
                  onClick={handleParse}
                  disabled={parseEmail.isPending}
                  className="btn btn-primary"
                >
                  {parseEmail.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
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
