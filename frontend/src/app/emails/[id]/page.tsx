'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Check, 
  RefreshCw, 
  Copy,
  ExternalLink,
  AlertTriangle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { JsonEditor } from '@/components/email/JsonEditor'

// Mock data - will be replaced with API call
const mockEmail = {
  id: 1,
  subject: 'Partnership Opportunity - Tech Blog Network',
  sender: 'john@techblog.com',
  senderName: 'John Smith',
  receivedAt: new Date(Date.now() - 1000 * 60 * 30),
  status: 'parsed',
  bodyText: `Hi there,

I'm reaching out from TechBlog Network, a collection of 15 technology-focused websites with a combined monthly readership of 2.5 million visitors.

We're interested in exploring a partnership opportunity with your website. Here's what we're proposing:

- Guest post exchange (2 posts per month each way)
- Link placement in relevant existing articles
- Sponsored content opportunities ($200 per article)

Our flagship site, techblog.com, has:
- Domain Authority: 58
- Monthly organic traffic: 850,000 visitors
- Primary audience: Tech professionals, developers

Let me know if you'd be interested in discussing this further.

Best regards,
John Smith
Partnerships Manager
TechBlog Network
john@techblog.com
+1 (555) 123-4567`,
  parsedData: {
    company_name: 'TechBlog Network',
    contact_email: 'john@techblog.com',
    contact_name: 'John Smith',
    website_url: 'techblog.com',
    offer_type: 'partnership',
    price: {
      amount: 200,
      currency: 'USD'
    },
    description: 'Guest post exchange and sponsored content partnership proposal',
    metrics: {
      monthly_traffic: '850,000',
      domain_authority: 58
    }
  },
}

export default function EmailDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [parsedData, setParsedData] = useState(mockEmail.parsedData)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleJsonChange = (newData: any) => {
    setParsedData(newData)
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setHasChanges(false)
  }

  const handleReparse = async () => {
    // TODO: Implement re-parsing
    console.log('Re-parsing email...')
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
                {mockEmail.subject}
              </h1>
              <p className="text-sm text-text-secondary">
                From {mockEmail.senderName} &lt;{mockEmail.sender}&gt;
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleReparse}
              className="btn btn-secondary"
            >
              <RefreshCw className="w-4 h-4" />
              Re-parse
            </button>
            <button 
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="btn btn-primary"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              {hasChanges ? 'Save Changes' : 'Mark Reviewed'}
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
                {mockEmail.bodyText}
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
            <JsonEditor 
              value={parsedData} 
              onChange={handleJsonChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}


