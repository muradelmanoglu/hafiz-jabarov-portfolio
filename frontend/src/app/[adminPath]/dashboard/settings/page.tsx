'use client'

import { useEffect, useState } from 'react'
import { adminApi, type SiteSettings } from '@/lib/api'
import { Check, RefreshCw } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    adminApi.getSettings().then((res) => {
      if (res.data.data) setSettings(res.data.data)
      setLoading(false)
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

  const field = (key: keyof SiteSettings, label: string, textarea?: boolean) => (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      {textarea ? (
        <textarea
          value={(settings[key] as string) || ''}
          onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
          rows={3}
          className="admin-input resize-none"
        />
      ) : (
        <input
          value={(settings[key] as string) || ''}
          onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
          className="admin-input"
        />
      )}
    </div>
  )

  if (loading) {
    return <div className="text-gray-500">Loading settings...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Site Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Global configuration for the portfolio site</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-accent flex items-center gap-2 text-sm"
        >
          {saving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
          {saved ? 'Saved!' : 'Save changes'}
        </button>
      </div>

      <div className="space-y-6">
        <div className="card">
          <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
            Identity
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {field('siteTitle', 'Site title')}
            {field('tagline', 'Tagline')}
            {field('heroHeadline', 'Hero headline')}
            {field('metaDescription', 'Meta description', true)}
            {field('heroSubheadline', 'Hero subheadline', true)}
          </div>
        </div>

        <div className="card">
          <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
            Availability
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Status</label>
              <select
                value={settings.availability || 'AVAILABLE'}
                onChange={(e) =>
                  setSettings({ ...settings, availability: e.target.value as SiteSettings['availability'] })
                }
                className="admin-input"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="SELECTIVE">SELECTIVE</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
            {field('availabilityMessage', 'Availability message')}
          </div>
        </div>

        <div className="card">
          <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
            Contact & Social
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {field('email', 'Email')}
            {field('phone', 'Phone')}
            {field('linkedIn', 'LinkedIn URL')}
            {field('github', 'GitHub URL')}
            {field('calendly', 'Calendly URL')}
            {field('twitter', 'Twitter / X URL')}
            {field('resumeUrl', 'Resume PDF URL')}
          </div>
        </div>

        <div className="card">
          <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
            Branding
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {field('logoUrl', 'Logo URL')}
            {field('faviconUrl', 'Favicon URL')}
            {field('defaultOgImageUrl', 'Default OG image URL')}
            {field('copyrightText', 'Copyright text')}
            {field('colophonText', 'Colophon / built-with text')}
          </div>
        </div>
      </div>
    </div>
  )
}
