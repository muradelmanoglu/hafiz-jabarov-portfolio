'use client'

import { useEffect, useState } from 'react'
import { adminApi, type SiteSettings } from '@/lib/api'
import { Check, RefreshCw } from 'lucide-react'

type LangTab = 'en' | 'az' | 'ru'
const LANG_TABS: { key: LangTab; label: string }[] = [
  { key: 'en', label: 'EN' },
  { key: 'az', label: 'AZ' },
  { key: 'ru', label: 'RU' },
]

export default function AboutAdminPage() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({})
  const [langTab, setLangTab] = useState<LangTab>('en')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    adminApi.getSettings().then((res) => {
      if (res.data.data) setSettings(res.data.data)
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await adminApi.updateSettings(settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  // Helpers for translation fields (az/ru)
  const getTrans = (): Record<string, Record<string, string>> => {
    try { return JSON.parse(settings.aboutTranslationsJson || '{}') } catch { return {} }
  }

  const getTransField = (field: 'heading' | 'p1' | 'p2' | 'p3'): string => {
    return getTrans()[langTab]?.[field] || ''
  }

  const setTransField = (field: 'heading' | 'p1' | 'p2' | 'p3', val: string) => {
    const t = getTrans()
    const updated = { ...t, [langTab]: { ...(t[langTab] || {}), [field]: val } }
    setSettings({ ...settings, aboutTranslationsJson: JSON.stringify(updated) })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">About Page</h1>
          <p className="text-gray-500 text-sm mt-1">Bio text shown on the About page and homepage About section</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-accent flex items-center gap-2 text-sm">
          {saving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
          {saved ? 'Saved!' : 'Save changes'}
        </button>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-sm">Bio text</h2>
          <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
            {LANG_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setLangTab(tab.key)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  langTab === tab.key ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {langTab === 'en' ? (
            <>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Heading</label>
                <input
                  value={settings.aboutHeading || ''}
                  onChange={(e) => setSettings({ ...settings, aboutHeading: e.target.value })}
                  className="admin-input"
                  placeholder="Hafiz Jabarov"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Paragraph 1</label>
                <textarea
                  value={settings.aboutP1 || ''}
                  onChange={(e) => setSettings({ ...settings, aboutP1: e.target.value })}
                  rows={3}
                  className="admin-input resize-none"
                  placeholder="First paragraph..."
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Paragraph 2</label>
                <textarea
                  value={settings.aboutP2 || ''}
                  onChange={(e) => setSettings({ ...settings, aboutP2: e.target.value })}
                  rows={3}
                  className="admin-input resize-none"
                  placeholder="Second paragraph..."
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Paragraph 3</label>
                <textarea
                  value={settings.aboutP3 || ''}
                  onChange={(e) => setSettings({ ...settings, aboutP3: e.target.value })}
                  rows={3}
                  className="admin-input resize-none"
                  placeholder="Third paragraph..."
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Heading ({langTab.toUpperCase()})</label>
                <input
                  value={getTransField('heading')}
                  onChange={(e) => setTransField('heading', e.target.value)}
                  className="admin-input"
                  placeholder={`Heading in ${langTab.toUpperCase()}...`}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Paragraph 1 ({langTab.toUpperCase()})</label>
                <textarea
                  value={getTransField('p1')}
                  onChange={(e) => setTransField('p1', e.target.value)}
                  rows={3}
                  className="admin-input resize-none"
                  placeholder={`First paragraph in ${langTab.toUpperCase()}...`}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Paragraph 2 ({langTab.toUpperCase()})</label>
                <textarea
                  value={getTransField('p2')}
                  onChange={(e) => setTransField('p2', e.target.value)}
                  rows={3}
                  className="admin-input resize-none"
                  placeholder={`Second paragraph in ${langTab.toUpperCase()}...`}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Paragraph 3 ({langTab.toUpperCase()})</label>
                <textarea
                  value={getTransField('p3')}
                  onChange={(e) => setTransField('p3', e.target.value)}
                  rows={3}
                  className="admin-input resize-none"
                  placeholder={`Third paragraph in ${langTab.toUpperCase()}...`}
                />
              </div>
            </>
          )}
        </div>
        <p className="text-gray-700 text-xs mt-4">Leave blank to use the default text from the translation files.</p>
      </div>
    </div>
  )
}
