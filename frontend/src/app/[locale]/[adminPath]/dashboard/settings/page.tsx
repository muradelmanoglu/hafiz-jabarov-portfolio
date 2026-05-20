'use client'

import { useEffect, useState } from 'react'
import { adminApi, api, type SiteSettings, type HeadlineMetric, type SocialLink } from '@/lib/api'
import { Check, RefreshCw, Plus, X, Upload } from 'lucide-react'
import { useTranslations } from 'next-intl'

const DEFAULT_PROJECT_TYPES = [
  { value: 'FRACTIONAL_PM', label: 'Fractional PM' },
  { value: 'ECOMMERCE_DELIVERY', label: 'E-Commerce Delivery' },
  { value: 'DELIVERY_AUDIT', label: 'Delivery Audit' },
  { value: 'DESIGN_COACHING', label: 'Design Coaching' },
  { value: 'TEAM_SETUP', label: 'Team Setup' },
  { value: 'OTHER', label: 'Other' },
]

const DEFAULT_BUDGET_RANGES = [
  { value: 'UNDER_1K', label: 'Under $1,000' },
  { value: 'FROM_1K_TO_5K', label: '$1,000 – $5,000' },
  { value: 'FROM_5K_TO_10K', label: '$5,000 – $10,000' },
  { value: 'FROM_10K_TO_25K', label: '$10,000 – $25,000' },
  { value: 'ABOVE_25K', label: '$25,000+' },
]

export default function SettingsPage() {
  const t = useTranslations('admin.settings')
  const tf = useTranslations('admin.settings.fields')
  const [settings, setSettings] = useState<Partial<SiteSettings>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newMetric, setNewMetric] = useState<HeadlineMetric>({ value: '', label: '' })
  const [newSocialLink, setNewSocialLink] = useState<SocialLink>({ label: '', url: '' })
  const [newProjectType, setNewProjectType] = useState<{ value: string; label: string }>({ value: '', label: '' })
  const [newBudgetRange, setNewBudgetRange] = useState<{ value: string; label: string }>({ value: '', label: '' })

  const parsedProjectTypes: { value: string; label: string }[] = (() => {
    try { return JSON.parse(settings.contactProjectTypesJson || '[]') } catch { return [] }
  })()
  const parsedBudgetRanges: { value: string; label: string }[] = (() => {
    try { return JSON.parse(settings.contactBudgetRangesJson || '[]') } catch { return [] }
  })()

  const setProjectTypes = (items: { value: string; label: string }[]) =>
    setSettings({ ...settings, contactProjectTypesJson: JSON.stringify(items) })
  const setBudgetRanges = (items: { value: string; label: string }[]) =>
    setSettings({ ...settings, contactBudgetRangesJson: JSON.stringify(items) })
  // Derive parsed custom social links from JSON field
  const parsedSocialLinks: SocialLink[] = (() => {
    try { return JSON.parse(settings.customSocialLinksJson || '[]') } catch { return [] }
  })()

  const setSocialLinks = (links: SocialLink[]) => {
    setSettings({ ...settings, customSocialLinksJson: JSON.stringify(links) })
  }

  useEffect(() => {
    adminApi.getSettings().then((res) => {
      if (res.data.data) {
        const s = res.data.data
        let projectTypes: { value: string; label: string }[] = []
        let budgetRanges: { value: string; label: string }[] = []
        try { projectTypes = JSON.parse(s.contactProjectTypesJson || '[]') } catch { /* empty */ }
        try { budgetRanges = JSON.parse(s.contactBudgetRangesJson || '[]') } catch { /* empty */ }
        if (!projectTypes.length) s.contactProjectTypesJson = JSON.stringify(DEFAULT_PROJECT_TYPES)
        if (!budgetRanges.length) s.contactBudgetRangesJson = JSON.stringify(DEFAULT_BUDGET_RANGES)
        setSettings(s)
      }
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

  const [uploading, setUploading] = useState<Record<string, boolean>>({})

  const uploadField = (key: keyof SiteSettings, label: string, accept: string = 'image/*') => {
    const val = (settings[key] as string) || ''
    const isPdf = accept.includes('pdf')
    const isUploading = uploading[key as string]

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      e.target.value = ''
      setUploading((u) => ({ ...u, [key]: true }))
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
        const res = await api.post<{ success: boolean; data: string }>('/admin/upload', {
          data: base64,
          contentType: file.type,
          name: file.name,
        })
        if (res.data.success && res.data.data) {
          setSettings((prev) => ({ ...prev, [key]: res.data.data }))
        }
      } catch (err) {
        console.error('Upload error:', err)
        alert('Upload failed. Please try again.')
      } finally {
        setUploading((u) => ({ ...u, [key]: false }))
      }
    }

    return (
      <div>
        <label className="block text-xs text-gray-500 mb-1">{label}</label>
        <div className="flex gap-2 items-center">
          <label className={`btn-outline text-xs px-3 py-2 cursor-pointer shrink-0 flex items-center gap-1.5 ${isUploading ? 'opacity-50' : ''}`}>
            <Upload size={12} />
            {isUploading ? 'Uploading...' : isPdf ? 'Upload PDF' : 'Upload'}
            <input type="file" accept={accept} className="hidden" onChange={handleFileChange} disabled={isUploading} />
          </label>
          {val ? (
            isPdf ? (
              <a href={val} target="_blank" rel="noopener noreferrer" className="text-xs text-green-400 flex-1 truncate hover:underline">
                PDF uploaded ✓
              </a>
            ) : (
              <img src={val} alt={label} className="h-8 w-auto rounded object-contain bg-gray-800 p-0.5 shrink-0" />
            )
          ) : (
            <span className="text-xs text-gray-600 flex-1">No file uploaded</span>
          )}
          {val && (
            <button onClick={() => setSettings((prev) => ({ ...prev, [key]: '' }))} className="text-gray-600 hover:text-red-400 shrink-0">
              <X size={14} />
            </button>
          )}
        </div>
      </div>
    )
  }

  const fileField = uploadField

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
            {uploadField('resumeUrl', tf('resumeUrl'), 'application/pdf')}
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

        {/* Project Types */}
        <div className="card">
          <h2 className="text-white font-semibold mb-1 text-sm uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
            Contact Form — Project Types
          </h2>
          <p className="text-gray-500 text-xs mb-4">Shown in the project type dropdown of the contact form. Leave empty to use the defaults.</p>
          <div className="space-y-2 mb-4">
            {parsedProjectTypes.map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-800 rounded-lg px-3 py-2">
                <span className="text-white text-sm font-medium w-36 shrink-0">{item.label}</span>
                <span className="text-gray-400 text-xs flex-1 truncate">{item.value}</span>
                <button onClick={() => { const arr = [...parsedProjectTypes]; arr.splice(i, 1); setProjectTypes(arr) }} className="text-gray-600 hover:text-red-400 shrink-0"><X size={14} /></button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <input value={newProjectType.label} onChange={(e) => setNewProjectType({ ...newProjectType, label: e.target.value })} placeholder="Label (e.g. SaaS Product)" className="admin-input text-sm flex-1" />
            <input value={newProjectType.value} onChange={(e) => setNewProjectType({ ...newProjectType, value: e.target.value })} placeholder="Value (e.g. SAAS_PRODUCT)" className="admin-input text-sm w-40 shrink-0" />
            <button onClick={() => { if (!newProjectType.label.trim() || !newProjectType.value.trim()) return; setProjectTypes([...parsedProjectTypes, { ...newProjectType }]); setNewProjectType({ value: '', label: '' }) }} className="btn-outline px-3 text-sm shrink-0"><Plus size={14} /></button>
          </div>
        </div>

        {/* Budget Ranges */}
        <div className="card">
          <h2 className="text-white font-semibold mb-1 text-sm uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
            Contact Form — Budget Ranges
          </h2>
          <p className="text-gray-500 text-xs mb-4">Shown in the budget range dropdown of the contact form. Leave empty to use the defaults.</p>
          <div className="space-y-2 mb-4">
            {parsedBudgetRanges.map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-800 rounded-lg px-3 py-2">
                <span className="text-white text-sm font-medium w-36 shrink-0">{item.label}</span>
                <span className="text-gray-400 text-xs flex-1 truncate">{item.value}</span>
                <button onClick={() => { const arr = [...parsedBudgetRanges]; arr.splice(i, 1); setBudgetRanges(arr) }} className="text-gray-600 hover:text-red-400 shrink-0"><X size={14} /></button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <input value={newBudgetRange.label} onChange={(e) => setNewBudgetRange({ ...newBudgetRange, label: e.target.value })} placeholder="Label (e.g. $5k–$10k)" className="admin-input text-sm flex-1" />
            <input value={newBudgetRange.value} onChange={(e) => setNewBudgetRange({ ...newBudgetRange, value: e.target.value })} placeholder="Value (e.g. 5K_TO_10K)" className="admin-input text-sm w-40 shrink-0" />
            <button onClick={() => { if (!newBudgetRange.label.trim() || !newBudgetRange.value.trim()) return; setBudgetRanges([...parsedBudgetRanges, { ...newBudgetRange }]); setNewBudgetRange({ value: '', label: '' }) }} className="btn-outline px-3 text-sm shrink-0"><Plus size={14} /></button>
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
