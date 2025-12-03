'use client'

import { useState, useCallback } from 'react'
import Editor from '@monaco-editor/react'

interface JsonEditorProps {
  value: any
  onChange: (value: any) => void
  readOnly?: boolean
}

export function JsonEditor({ value, onChange, readOnly = false }: JsonEditorProps) {
  const [error, setError] = useState<string | null>(null)

  const handleEditorChange = useCallback((newValue: string | undefined) => {
    if (!newValue) return
    
    try {
      const parsed = JSON.parse(newValue)
      setError(null)
      onChange(parsed)
    } catch (e) {
      setError('Invalid JSON')
    }
  }, [onChange])

  return (
    <div className="h-full flex flex-col">
      {error && (
        <div className="flex-shrink-0 px-4 py-2 bg-error/10 border-b border-error/20 text-error text-sm">
          {error}
        </div>
      )}
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="json"
          value={JSON.stringify(value, null, 2)}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'JetBrains Mono, Fira Code, monospace',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            wrappingIndent: 'indent',
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
        />
      </div>
    </div>
  )
}


