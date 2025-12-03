'use client'

import { useState } from 'react'
import { Save, RotateCcw, Plus, Trash2, HelpCircle } from 'lucide-react'
import { JsonEditor } from '@/components/email/JsonEditor'

const defaultSchema = {
  type: "object",
  properties: {
    company_name: {
      type: "string",
      description: "Name of the company making the offer"
    },
    contact_email: {
      type: "string",
      description: "Contact email address"
    },
    contact_name: {
      type: "string",
      description: "Name of the contact person"
    },
    website_url: {
      type: "string",
      description: "Website URL being offered"
    },
    offer_type: {
      type: "string",
      description: "Type of offer (e.g., partnership, advertising, sale)"
    },
    price: {
      type: "object",
      properties: {
        amount: { type: "number" },
        currency: { type: "string" }
      }
    },
    description: {
      type: "string",
      description: "Brief description of the offer"
    },
    metrics: {
      type: "object",
      properties: {
        monthly_traffic: { type: "string" },
        domain_authority: { type: "number" },
        page_authority: { type: "number" }
      },
      description: "Website metrics if mentioned"
    }
  },
  required: ["company_name", "offer_type"]
}

export default function SchemaEditorPage() {
  const [schema, setSchema] = useState(defaultSchema)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSchemaChange = (newSchema: any) => {
    setSchema(newSchema)
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    // TODO: Save to API
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setHasChanges(false)
  }

  const handleReset = () => {
    setSchema(defaultSchema)
    setHasChanges(false)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 px-8 py-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Schema Editor</h1>
            <p className="text-text-secondary mt-1">
              Define the JSON schema for parsing commercial offer emails
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleReset}
              className="btn btn-secondary"
              disabled={!hasChanges}
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button 
              onClick={handleSave}
              className="btn btn-primary"
              disabled={!hasChanges || isSaving}
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Schema'}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Schema Editor */}
        <div className="flex-1 flex flex-col border-r border-border">
          <div className="flex-shrink-0 px-4 py-3 border-b border-border bg-surface-light">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
              JSON Schema Definition
            </h2>
          </div>
          <div className="flex-1">
            <JsonEditor 
              value={schema} 
              onChange={handleSchemaChange}
            />
          </div>
        </div>

        {/* Help Panel */}
        <div className="w-80 flex flex-col bg-surface-light">
          <div className="flex-shrink-0 px-4 py-3 border-b border-border flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-primary-400" />
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
              Schema Guide
            </h2>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-text-primary">Supported Types</h3>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• <code className="text-primary-400">string</code> - Text values</li>
                <li>• <code className="text-primary-400">number</code> - Numeric values</li>
                <li>• <code className="text-primary-400">boolean</code> - True/false</li>
                <li>• <code className="text-primary-400">object</code> - Nested objects</li>
                <li>• <code className="text-primary-400">array</code> - Lists of items</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-text-primary">Field Properties</h3>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• <code className="text-accent-400">type</code> - Data type</li>
                <li>• <code className="text-accent-400">description</code> - Help text for AI</li>
                <li>• <code className="text-accent-400">enum</code> - Allowed values</li>
                <li>• <code className="text-accent-400">required</code> - Mandatory fields</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-text-primary">Tips</h3>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Add clear descriptions to help the AI understand what to extract</li>
                <li>• Use specific field names that match common email terminology</li>
                <li>• Group related fields in nested objects</li>
              </ul>
            </div>

            <div className="p-3 bg-primary-500/10 rounded-lg border border-primary-500/20">
              <p className="text-sm text-primary-300">
                <strong>Note:</strong> Changes to the schema will affect all future email parsing. Existing parsed data will not be re-processed automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


