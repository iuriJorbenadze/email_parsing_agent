'use client'

import { useState } from 'react'
import { Save, Key, Database, Cpu, Bell } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    openaiModel: 'gpt-4-turbo-preview',
    syncInterval: '15',
    notificationsEnabled: true,
    autoParseEnabled: true,
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // TODO: Save to API
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="p-8 max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">
          Configure your email parsing preferences
        </p>
      </div>

      {/* OpenAI Settings */}
      <section className="card space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-border">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-text-primary">AI Configuration</h2>
            <p className="text-sm text-text-muted">OpenAI API settings for email parsing</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              OpenAI Model
            </label>
            <select
              value={settings.openaiModel}
              onChange={(e) => setSettings({ ...settings, openaiModel: e.target.value })}
              className="input"
            >
              <option value="gpt-4-turbo-preview">GPT-4 Turbo (Recommended)</option>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              API Key Status
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1 input bg-surface font-mono text-sm">
                sk-••••••••••••••••••••••••
              </div>
              <button className="btn btn-secondary">
                <Key className="w-4 h-4" />
                Update
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sync Settings */}
      <section className="card space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-border">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-text-primary">Sync Settings</h2>
            <p className="text-sm text-text-muted">Configure email synchronization</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Sync Interval (minutes)
            </label>
            <select
              value={settings.syncInterval}
              onChange={(e) => setSettings({ ...settings, syncInterval: e.target.value })}
              className="input"
            >
              <option value="5">Every 5 minutes</option>
              <option value="15">Every 15 minutes</option>
              <option value="30">Every 30 minutes</option>
              <option value="60">Every hour</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-primary">Auto-parse new emails</p>
              <p className="text-sm text-text-muted">Automatically parse emails as they arrive</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoParseEnabled}
                onChange={(e) => setSettings({ ...settings, autoParseEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-lighter peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>
        </div>
      </section>

      {/* Notification Settings */}
      <section className="card space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-border">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-text-primary">Notifications</h2>
            <p className="text-sm text-text-muted">Configure alert preferences</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-text-primary">Email notifications</p>
            <p className="text-sm text-text-muted">Get notified when parsing fails</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(e) => setSettings({ ...settings, notificationsEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-surface-lighter peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
          </label>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="btn btn-primary"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}


