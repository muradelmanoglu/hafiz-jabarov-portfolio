'use client'

import { useEffect, useState } from 'react'
import { adminApi, type CaseStudy } from '@/lib/api'
import { Plus, Pencil, Trash2, Check, ExternalLink, X } from 'lucide-react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'

const emptyForm = (): Partial<CaseStudy> => ({
  title: '',
  slug: '',
  role: '',
  summary: '',
  startDate: '',
  featured: false,
  orderWeight: 0,
  status: 'DRAFT',
  problem: '',
  myRole: '',
  approach: '',
  outcome: '',
  tools: [],
  tags: [],
})

const STATUS_BADGE: Record<string, string> = {
  PUBLISHED: 'bg-green-900/50 text-green-400',
  DRAFT: 'bg-gray-800 text-gray-400',
  ARCHIVED: 'bg-yellow-900/50 text-yellow-400',
}

type Tab = 'basic' | 'content' | 'meta'

export default function CaseStudiesPage() {
  const t = useTranslations('admin.projects')
  const tf = useTranslations('admin.projects.fields')
  const locale = useLocale()
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [editing, setEditing] = useState<Partial<CaseStudy> | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('basic')
  const [newTool, setNewTool] = useState('')
  const [newTag, setNewTag] = useState('')
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchCaseStudies() }, [])

  const fetchCaseStudies = async () => {
    const res = await adminApi.getCaseStudies()
    if (res.data.data) setCaseStudies(res.data.data)
  }

  const handleSave = async () => {
    if (!editing) return
    setSaveError(null)
    setSaving(true)
    try {
      if (editingId) {
        await adminApi.updateCaseStudy(editingId, editing)
      } else {
        await adminApi.createCaseStudy(editing)
      }
      setEditing(null)
      setEditingId(null)
      setActiveTab('basic')
      fetchCaseStudies()
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setSaveError(e?.response?.data?.message || 'Save failed. Check required fields.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm(t('deleteConfirm'))) return
    await adminApi.deleteCaseStudy(id)
    fetchCaseStudies()
  }

  const openEdit = (cs?: Partial<CaseStudy>, id?: number) => {
    setEditing(cs || emptyForm())
    setEditingId(id || null)
    setActiveTab('basic')
    setSaveError(null)
    setNewTool('')
    setNewTag('')
  }

  const addChip = (field: 'tools' | 'tags', val: string, setter: (v: string) => void) => {
    const v = val.trim()
    if (!v || !editing) return
    setEditing({ ...editing, [field]: [...((editing[field] as string[]) || []), v] })
    setter('')
  }

  const removeChip = (field: 'tools' | 'tags', i: number) => {
    if (!editing) return
    const arr = [...((editing[field] as string[]) || [])]
    arr.splice(i, 1)
    setEditing({ ...editing, [field]: arr })
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'basic', label: 'Əsas' },
    { key: 'content', label: 'Məzmun' },
    { key: 'meta', label: 'Media & Meta' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{caseStudies.length} case studies</p>
        </div>
        <button onClick={() => openEdit()} className="btn-accent flex items-center gap-2 text-sm">
          <Plus size={16} /> {t('newCaseStudy')}
        </button>
      </div>

      {editing && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">{editingId ? t('editCaseStudy') : t('newCaseStudy')}</h2>
            {/* Tabs */}
            <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    activeTab === tab.key ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* TAB: Əsas */}
          {activeTab === 'basic' && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">{tf('title')} *</label>
                <input value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="admin-input" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{tf('slug')}</label>
                <input value={editing.slug || ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="admin-input" placeholder="e-commerce-checkout-overhaul" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{tf('role')}</label>
                <input value={editing.role || ''} onChange={(e) => setEditing({ ...editing, role: e.target.value })} className="admin-input" placeholder="Senior Product Manager" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{tf('status')}</label>
                <select value={editing.status || 'DRAFT'} onChange={(e) => setEditing({ ...editing, status: e.target.value as CaseStudy['status'] })} className="admin-input">
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{tf('startDate')}</label>
                <input type="date" value={editing.startDate || ''} onChange={(e) => setEditing({ ...editing, startDate: e.target.value })} className="admin-input" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End date</label>
                <input type="date" value={editing.endDate || ''} onChange={(e) => setEditing({ ...editing, endDate: e.target.value })} className="admin-input" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Team size</label>
                <input type="number" value={editing.teamSize || ''} onChange={(e) => setEditing({ ...editing, teamSize: +e.target.value })} className="admin-input" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{tf('orderWeight')}</label>
                <input type="number" value={editing.orderWeight || 0} onChange={(e) => setEditing({ ...editing, orderWeight: +e.target.value })} className="admin-input" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">{tf('summary')}</label>
                <textarea value={editing.summary || ''} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} rows={3} className="admin-input resize-none" placeholder="Short summary shown on the work listing..." />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="featured" checked={editing.featured || false} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="w-4 h-4" />
                <label htmlFor="featured" className="text-gray-400 text-sm">{tf('featured')}</label>
              </div>
            </div>
          )}

          {/* TAB: Məzmun */}
          {activeTab === 'content' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Problem</label>
                <textarea
                  value={editing.problem || ''}
                  onChange={(e) => setEditing({ ...editing, problem: e.target.value })}
                  rows={4}
                  className="admin-input resize-none"
                  placeholder="Legacy checkout had a 68% abandonment rate, 3 payment providers failing silently..."
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Mənim rolum</label>
                <textarea
                  value={editing.myRole || ''}
                  onChange={(e) => setEditing({ ...editing, myRole: e.target.value })}
                  rows={4}
                  className="admin-input resize-none"
                  placeholder="Owned discovery, roadmap, sprint planning and stakeholder communication..."
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Yanaşma</label>
                <textarea
                  value={editing.approach || ''}
                  onChange={(e) => setEditing({ ...editing, approach: e.target.value })}
                  rows={4}
                  className="admin-input resize-none"
                  placeholder="Phased migration: new payment gateway first, then UI overhaul..."
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Nəticə</label>
                <textarea
                  value={editing.outcome || ''}
                  onChange={(e) => setEditing({ ...editing, outcome: e.target.value })}
                  rows={4}
                  className="admin-input resize-none"
                  placeholder="Cart abandonment dropped 22%. Revenue up 18% MoM..."
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Reflection (optional)</label>
                <textarea
                  value={editing.reflection || ''}
                  onChange={(e) => setEditing({ ...editing, reflection: e.target.value })}
                  rows={3}
                  className="admin-input resize-none"
                />
              </div>

              {/* Tools */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">Tools used</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(editing.tools || []).map((tool, i) => (
                    <span key={i} className="flex items-center gap-1 bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full">
                      {tool}
                      <button onClick={() => removeChip('tools', i)} className="text-gray-500 hover:text-red-400"><X size={10} /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={newTool} onChange={(e) => setNewTool(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addChip('tools', newTool, setNewTool))} placeholder="Jira, Figma, Amplitude..." className="admin-input flex-1" />
                  <button onClick={() => addChip('tools', newTool, setNewTool)} className="btn-outline text-sm px-3"><Plus size={14} /></button>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(editing.tags || []).map((tag, i) => (
                    <span key={i} className="flex items-center gap-1 bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full">
                      {tag}
                      <button onClick={() => removeChip('tags', i)} className="text-gray-500 hover:text-red-400"><X size={10} /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addChip('tags', newTag, setNewTag))} placeholder="e-commerce, fintech..." className="admin-input flex-1" />
                  <button onClick={() => addChip('tags', newTag, setNewTag)} className="btn-outline text-sm px-3"><Plus size={14} /></button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Media & Meta */}
          {activeTab === 'meta' && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">External URL</label>
                <input value={editing.externalUrl || ''} onChange={(e) => setEditing({ ...editing, externalUrl: e.target.value })} className="admin-input" placeholder="https://..." />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Thumbnail URL</label>
                <input value={editing.thumbnailUrl || ''} onChange={(e) => setEditing({ ...editing, thumbnailUrl: e.target.value })} className="admin-input" placeholder="https://..." />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Hero image URL</label>
                <input value={editing.heroImageUrl || ''} onChange={(e) => setEditing({ ...editing, heroImageUrl: e.target.value })} className="admin-input" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Domain / Industry</label>
                <input value={editing.domain || ''} onChange={(e) => setEditing({ ...editing, domain: e.target.value })} className="admin-input" placeholder="E-Commerce, SaaS..." />
              </div>
            </div>
          )}

          {saveError && (
            <p className="text-red-400 text-sm mt-4 bg-red-950/50 px-3 py-2 rounded-lg">{saveError}</p>
          )}

          <div className="flex gap-3 mt-5 pt-4 border-t border-gray-800">
            <button onClick={handleSave} disabled={saving} className="btn-accent flex items-center gap-2 text-sm">
              <Check size={16} /> {saving ? 'Saving...' : t('save')}
            </button>
            <button onClick={() => { setEditing(null); setEditingId(null) }} className="btn-outline text-sm">
              {t('cancel')}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {caseStudies.map((cs) => (
          <div key={cs.id} className="card flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-white font-medium text-sm">{cs.title}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_BADGE[cs.status] || ''}`}>{cs.status}</span>
                {cs.featured && <span className="text-xs bg-yellow-900/30 text-yellow-400 px-2 py-0.5 rounded-full">Featured</span>}
              </div>
              <p className="text-gray-600 text-sm truncate">{cs.summary}</p>
              {(cs.problem || cs.outcome) && (
                <p className="text-gray-700 text-xs mt-0.5">
                  {cs.problem ? '✓ Problem' : ''}{cs.problem && cs.outcome ? ' · ' : ''}{cs.outcome ? '✓ Outcome' : ''}
                </p>
              )}
            </div>
            <div className="flex gap-2 shrink-0 items-center">
              {cs.status === 'PUBLISHED' && (
                <Link href={`/${locale}/work/${cs.slug}`} target="_blank" className="text-gray-500 hover:text-white">
                  <ExternalLink size={14} />
                </Link>
              )}
              <button onClick={() => openEdit({ ...cs }, cs.id)} className="text-gray-500 hover:text-white">
                <Pencil size={16} />
              </button>
              <button onClick={() => handleDelete(cs.id)} className="text-gray-500 hover:text-red-400">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
