'use client'

import { useEffect, useState } from 'react'
import { adminApi, type SiteSettings, type HeadlineMetric, type SocialLink } from '@/lib/api'
import { Check, RefreshCw, Plus, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function SettingsPage() {
  const t = useTranslations('admin.settings')
  const tf = useTranslations('admin.settings.fields')
  const [settings, setSettings] = useState<Partial<SiteSettings>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newMetric, setNewMetric] = useState<HeadlineMetric>({ value: '', label: '' })
  const [newSocialLink, setNewSocialLink] = useState<SocialLink>({ label: '', url: '' })

  // Derive parsed custom social links from JSON field
  const parsedSocialLinks: SocialLink[] = (() => {
    try { return JSON.parse(settings.customSocialLinksJson || '[]') } catch { return [] }
  })()

  const setSocialLinks = (links: SocialLink[]) => {
    setSettings({ ...settings, customSocialLinksJson: JSON.stringify(links) })
  }

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

  const fileField = (key: keyof SiteSettings, label: string) => (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <div className="flex gap-2 items-center">
        <input
          value={(settings[key] as string) || ''}
          onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
          className="admin-input flex-1 text-xs"
          placeholder="https://... or upload →"
        />
        <label className="btn-outline text-xs px-3 py-2 cursor-pointer shrink-0">
          Upload
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              const reader = new FileReader()
              reader.onload = () => {
                setSettings({ ...settings, [key]: reader.result as string })
              }
              reader.readAsDataURL(file)
            }}
          />
        </label>
      </div>
      {(settings[key] as string)?.startsWith('data:image') && (
        <img src={settings[key] as string} alt={label} className="mt-2 h-10 w-auto rounded object-contain bg-gray-800 p-1" />
      )}
    </div>
  )

  if (loading) return <div className="text-gray-500">Loading settings...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('subtitle')}</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-accent flex items-center gap-2 text-sm">
          {saving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
          {saved ? t('saved') : t('save')}
        </button>
      </div>

      <div className="space-y-6">
        <div className="card">
          <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
            {t('identity')}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {field('siteTitle', tf('siteTitle'))}
            {field('tagline', tf('tagline'))}
            {field('heroHeadline', tf('heroHeadline'))}
            {field('metaDescription', tf('metaDescription'), true)}
            {field('heroSubheadline', tf('heroSubheadline'), true)}
          </div>
        </div>

        <div className="card">
          <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
            About Section
          </h2>
          <p className="text-gray-500 text-xs mb-4">Overrides the "About" section text on the homepage. Leave blank to use translation file defaults.</p>
          <div className="space-y-4">
            {field('aboutHeading', 'Heading')}
            {field('aboutP1', 'Paragraph 1', true)}
            {field('aboutP2', 'Paragraph 2', true)}
            {field('aboutP3', 'Paragraph 3', true)}
          </div>
        </div>

        <div className="card">
          <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
            {t('availability')}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">{tf('status')}</label>
              <select
                value={settings.availability || 'AVAILABLE'}
                onChange={(e) => setSettings({ ...settings, availability: e.target.value as SiteSettings['availability'] })}
                className="admin-input"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="SELECTIVE">SELECTIVE</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
            {field('availabilityMessage', tf('availabilityMessage'))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
            {t('contactSocial')}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {field('email', tf('email'))}
            {field('phone', tf('phone'))}
            {field('linkedIn', tf('linkedIn'))}
            {field('github', tf('github'))}
            {field('calendly', tf('calendly'))}
            {field('twitter', tf('twitter'))}
            {field('instagram', tf('instagram'))}
            {field('resumeUrl', tf('resumeUrl'))}
          </div>
        </div>

        {/* Custom Social Links */}
        <div className="card">
          <h2 className="text-white font-semibold mb-1 text-sm uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
            Custom Social Links
          </h2>
          <p className="text-gray-500 text-xs mb-4">Add any extra social platform (e.g. YouTube, Dribbble, TikTok). These appear alongside the standard links in the footer and contact section.</p>

          {/* Existing links */}
          <div className="space-y-2 mb-4">
            {parsedSocialLinks.map((link, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-800 rounded-lg px-3 py-2">
                <span className="text-white text-sm font-medium w-28 shrink-0">{link.label}</span>
                <span className="text-gray-400 text-xs flex-1 truncate">{link.url}</span>
                <button
                  onClick={() => {
                    const arr = [...parsedSocialLinks]
                    arr.splice(i, 1)
                    setSocialLinks(arr)
                  }}
                  className="text-gray-600 hover:text-red-400 shrink-0"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Add new link */}
          <div className="flex gap-2 items-center">
            <input
              value={newSocialLink.label}
              onChange={(e) => setNewSocialLink({ ...newSocialLink, label: e.target.value })}
              placeholder="Platform (e.g. YouTube)"
              className="admin-input text-sm w-40 shrink-0"
            />
            <input
              value={newSocialLink.url}
              onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  if (!newSocialLink.label.trim() || !newSocialLink.url.trim()) return
                  setSocialLinks([...parsedSocialLinks, { ...newSocialLink }])
                  setNewSocialLink({ label: '', url: '' })
                }
              }}
              placeholder="https://..."
              className="admin-input text-sm flex-1"
            />
            <button
              onClick={() => {
                if (!newSocialLink.label.trim() || !newSocialLink.url.trim()) return
                setSocialLinks([...parsedSocialLinks, { ...newSocialLink }])
                setNewSocialLink({ label: '', url: '' })
              }}
              className="btn-outline px-3 text-sm shrink-0"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
            {t('branding')}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {fileField('logoUrl', tf('logoUrl'))}
            {fileField('faviconUrl', tf('faviconUrl'))}
            {fileField('defaultOgImageUrl', tf('defaultOgImageUrl'))}
            {field('copyrightText', tf('copyrightText'))}
            {field('colophonText', tf('colophonText'))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
            Hero Stats
          </h2>
          <p className="text-gray-500 text-xs mb-4">The 4 numbers shown in the hero section (e.g. 7+ Years, 30+ Products)</p>
          <div className="space-y-2 mb-4">
            {(settings.headlineMetrics || []).map((m, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-800 rounded-lg px-3 py-2">
                <span className="text-white font-bold text-sm w-16 shrink-0">{m.value}</span>
                <span className="text-gray-300 text-xs flex-1">{m.label}</span>
                <button
                  onClick={() => {
                    const arr = [...(settings.headlineMetrics || [])]
                    arr.splice(i, 1)
                    setSettings({ ...settings, headlineMetrics: arr })
                  }}
                  className="text-gray-600 hover:text-red-400 ml-auto"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              value={newMetric.value}
              onChange={(e) => setNewMetric({ ...newMetric, value: e.target.value })}
              placeholder="Value (e.g. 7+)"
              className="admin-input text-sm"
            />
            <div className="flex gap-2">
              <input
                value={newMetric.label}
                onChange={(e) => setNewMetric({ ...newMetric, label: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    if (!newMetric.value.trim() || !newMetric.label.trim()) return
                    setSettings({ ...settings, headlineMetrics: [...(settings.headlineMetrics || []), { ...newMetric }] })
                    setNewMetric({ value: '', label: '' })
                  }
                }}
                placeholder="Label (e.g. Years PM experience)"
                className="admin-input text-sm flex-1"
              />
              <button
                onClick={() => {
                  if (!newMetric.value.trim() || !newMetric.label.trim()) return
                  setSettings({ ...settings, headlineMetrics: [...(settings.headlineMetrics || []), { ...newMetric }] })
                  setNewMetric({ value: '', label: '' })
                }}
                className="btn-outline px-3 text-sm"
              >+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
