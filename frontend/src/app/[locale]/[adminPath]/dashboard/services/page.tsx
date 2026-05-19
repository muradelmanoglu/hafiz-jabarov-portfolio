'use client'

import { useEffect, useState } from 'react'
import { adminApi, type PortfolioService } from '@/lib/api'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'

type LangTab = 'en' | 'az' | 'ru'
const LANG_TABS: { key: LangTab; label: string }[] = [
  { key: 'en', label: 'EN' },
  { key: 'az', label: 'AZ' },
  { key: 'ru', label: 'RU' },
]

type ServiceWithTranslations = Omit<Partial<PortfolioService>, 'translations'> & {
  translations: Record<string, Record<string, string>>
}

const STATUS_BADGE: Record<string, string> = {
  PUBLISHED: 'bg-green-900/50 text-green-400',
  DRAFT: 'bg-gray-800 text-gray-400',
  ARCHIVED: 'bg-yellow-900/50 text-yellow-400',
}

const emptyForm = (): ServiceWithTranslations => ({
  title: '',
  slug: '',
  category: '',
  shortDescription: '',
  longDescription: '',
  deliverables: [],
  engagementDuration: '',
  startingRate: '',
  startingRateVisible: true,
  ctaText: 'Get started',
  orderWeight: 0,
  featured: false,
  status: 'DRAFT',
  translations: { az: {}, ru: {} },
})

export default function ServicesPage() {
  const [services, setServices] = useState<PortfolioService[]>([])
  const [editing, setEditing] = useState<ServiceWithTranslations | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [langTab, setLangTab] = useState<LangTab>('en')
  const [newDeliverable, setNewDeliverable] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => { fetchServices() }, [])

  const fetchServices = async () => {
    const res = await adminApi.getServices()
    if (res.data.data) setServices(res.data.data)
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    setSaveError(null)
    try {
      if (editingId) {
        await adminApi.updateService(editingId, editing)
      } else {
        await adminApi.createService(editing)
      }
      setEditing(null)
      setEditingId(null)
      fetchServices()
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setSaveError(e?.response?.data?.message || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this service?')) return
    await adminApi.deleteService(id)
    fetchServices()
  }

  const openEdit = (svc?: PortfolioService) => {
    setEditing(
      svc
        ? {
            ...svc,
            translations: (() => {
              try { return JSON.parse(svc.translations || '{}') } catch { return { az: {}, ru: {} } }
            })(),
          }
        : emptyForm()
    )
    setEditingId(svc?.id || null)
    setLangTab('en')
    setSaveError(null)
    setNewDeliverable('')
  }

  const tField = (field: 'shortDescription' | 'longDescription'): string => {
    if (langTab === 'en') return ''
    return (editing?.translations?.[langTab]?.[field] as string) || ''
  }

  const setTField = (field: 'shortDescription' | 'longDescription', val: string) => {
    if (!editing) return
    setEditing({
      ...editing,
      translations: {
        ...editing.translations,
        [langTab]: { ...editing.translations[langTab], [field]: val },
      },
    })
  }

  const addDeliverable = () => {
    const v = newDeliverable.trim()
    if (!v || !editing) return
    setEditing({ ...editing, deliverables: [...(editing.deliverables || []), v] })
    setNewDeliverable('')
  }

  const removeDeliverable = (i: number) => {
    if (!editing) return
    const arr = [...(editing.deliverables || [])]
    arr.splice(i, 1)
    setEditing({ ...editing, deliverables: arr })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <p className="text-gray-500 text-sm mt-1">{services.length} services</p>
        </div>
        <button onClick={() => openEdit()} className="btn-accent flex items-center gap-2 text-sm">
          <Plus size={16} /> New Service
        </button>
      </div>

      {editing && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">{editingId ? 'Edit Service' : 'New Service'}</h2>
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

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Title *</label>
              <input
                value={editing.title || ''}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="admin-input"
                placeholder="Fractional PM"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Slug (auto if empty)</label>
              <input
                value={editing.slug || ''}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                className="admin-input"
                placeholder="fractional-pm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Status</label>
              <select
                value={editing.status || 'DRAFT'}
                onChange={(e) => setEditing({ ...editing, status: e.target.value as PortfolioService['status'] })}
                className="admin-input"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Category</label>
              <input
                value={editing.category || ''}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                className="admin-input"
                placeholder="Strategy, Delivery, Coaching..."
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Engagement Duration</label>
              <input
                value={editing.engagementDuration || ''}
                onChange={(e) => setEditing({ ...editing, engagementDuration: e.target.value })}
                className="admin-input"
                placeholder="4–8 weeks"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Starting Rate</label>
              <div className="flex gap-2 items-center">
                <input
                  value={editing.startingRate || ''}
                  onChange={(e) => setEditing({ ...editing, startingRate: e.target.value })}
                  className="admin-input flex-1"
                  placeholder="$2,000"
                />
                <label className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.startingRateVisible ?? true}
                    onChange={(e) => setEditing({ ...editing, startingRateVisible: e.target.checked })}
                    className="w-3.5 h-3.5"
                  />
                  Visible
                </label>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">CTA Button Text</label>
              <input
                value={editing.ctaText || ''}
                onChange={(e) => setEditing({ ...editing, ctaText: e.target.value })}
                className="admin-input"
                placeholder="Get started"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Order Weight</label>
              <input
                type="number"
                value={editing.orderWeight || 0}
                onChange={(e) => setEditing({ ...editing, orderWeight: +e.target.value })}
                className="admin-input"
              />
            </div>
            {langTab === 'en' ? (
              <>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">Short Description *</label>
                  <input
                    value={editing.shortDescription || ''}
                    onChange={(e) => setEditing({ ...editing, shortDescription: e.target.value })}
                    className="admin-input"
                    placeholder="Embedded PM leadership for early-stage teams..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">Long Description</label>
                  <textarea
                    value={editing.longDescription || ''}
                    onChange={(e) => setEditing({ ...editing, longDescription: e.target.value })}
                    rows={4}
                    className="admin-input resize-none"
                    placeholder="Full description shown on the services page..."
                  />
                </div>
              </>
            ) : (
              <>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">Short Description ({langTab.toUpperCase()})</label>
                  <input
                    value={tField('shortDescription')}
                    onChange={(e) => setTField('shortDescription', e.target.value)}
                    className="admin-input"
                    placeholder={`Short description in ${langTab.toUpperCase()}...`}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">Long Description ({langTab.toUpperCase()})</label>
                  <textarea
                    value={tField('longDescription')}
                    onChange={(e) => setTField('longDescription', e.target.value)}
                    rows={4}
                    className="admin-input resize-none"
                    placeholder={`Long description in ${langTab.toUpperCase()}...`}
                  />
                </div>
              </>
            )}
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-500 mb-2">Deliverables</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(editing.deliverables || []).map((d, i) => (
                  <span key={i} className="flex items-center gap-1 bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full">
                    {d}
                    <button onClick={() => removeDeliverable(i)} className="text-gray-500 hover:text-red-400">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newDeliverable}
                  onChange={(e) => setNewDeliverable(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDeliverable())}
                  placeholder="Product roadmap, Sprint planning..."
                  className="admin-input flex-1"
                />
                <button onClick={addDeliverable} className="btn-outline text-sm px-3">
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="svc-featured"
                checked={editing.featured || false}
                onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="svc-featured" className="text-gray-400 text-sm">Featured</label>
            </div>
          </div>

          {saveError && (
            <p className="text-red-400 text-sm mt-4 bg-red-950/50 px-3 py-2 rounded-lg">{saveError}</p>
          )}

          <div className="flex gap-3 mt-5 pt-4 border-t border-gray-800">
            <button onClick={handleSave} disabled={saving} className="btn-accent flex items-center gap-2 text-sm">
              <Check size={16} /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setEditing(null); setEditingId(null) }} className="btn-outline text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {services.map((svc) => (
          <div key={svc.id} className="card flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-white font-medium text-sm">{svc.title}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_BADGE[svc.status] || ''}`}>{svc.status}</span>
                {svc.category && <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded-full">{svc.category}</span>}
                {svc.featured && <span className="text-xs bg-yellow-900/30 text-yellow-400 px-2 py-0.5 rounded-full">Featured</span>}
              </div>
              <p className="text-gray-500 text-xs truncate">{svc.shortDescription}</p>
              {svc.engagementDuration && (
                <p className="text-gray-700 text-xs mt-0.5">{svc.engagementDuration}{svc.startingRate && svc.startingRateVisible ? ` · from ${svc.startingRate}` : ''}</p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(svc)} className="text-gray-500 hover:text-white">
                <Pencil size={16} />
              </button>
              <button onClick={() => handleDelete(svc.id)} className="text-gray-500 hover:text-red-400">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <p className="text-gray-600 text-sm text-center py-8">No services yet. Add your first one.</p>
        )}
      </div>
    </div>
  )
}
