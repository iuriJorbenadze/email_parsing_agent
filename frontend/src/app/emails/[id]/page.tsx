'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Check, 
  RefreshCw, 
  AlertTriangle,
  Loader2,
  CheckCircle
} from 'lucide-react'
import { JsonEditor } from '@/components/email/JsonEditor'
import { useEmail, useUpdateEmail } from '@/lib/hooks'

export default function EmailDetailPage() {
  const params = useParams()
  const router = useRouter()
  const emailId = params.id as string
  
  const { data: email, isLoading, error, refetch } = useEmail(emailId)
  const updateEmail = useUpdateEmail()
  
  const [editedData, setEditedData] = useState<any>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Initialize edited data when email loads
  useEffect(() => {
    if (email) {
      // Use corrected_data if exists, otherwise parsed_data
      setEditedData(email.corrected_data || email.parsed_data || {})
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
      // Refetch to get updated data
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
            {email.status !== 'reviewed' && !hasChanges && (
              <button 
                onClick={handleMarkReviewed}
                disabled={updateEmail.isPending}
                className="btn btn-secondary"
              >
                <Check className="w-4 h-4" />
                Mark Reviewed
              </button>
            )}
            <button 
              onClick={handleSave}
              disabled={!hasChanges || updateEmail.isPending}
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
              Parsed Data (Editable)
            </h2>
            {hasChanges && (
              <span className="text-xs text-warning flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Unsaved changes
              </span>
            )}
          </div>
          <div className="flex-1 overflow-auto">
            {editedData !== null ? (
              <JsonEditor 
                value={editedData} 
                onChange={handleJsonChange}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-text-muted">
                <p>No parsed data available. Parse this email first.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
