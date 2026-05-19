'use client'

import { useEffect, useState } from 'react'
import { adminApi, type FAQ } from '@/lib/api'
import { Plus, Pencil, Trash2, Check } from 'lucide-react'

type LangTab = 'en' | 'az' | 'ru'
const LANG_TABS: { key: LangTab; label: string }[] = [
  { key: 'en', label: 'EN' },
  { key: 'az', label: 'AZ' },
  { key: 'ru', label: 'RU' },
]

type FAQWithTranslations = Partial<FAQ> & {
  translations: Record<string, Record<string, string>>
}

const CATEGORIES: FAQ['category'][] = ['GENERAL', 'SERVICES', 'PROCESS', 'PRICING']
const VISIBLE_OPTIONS: Array<'HOME' | 'SERVICES' | 'CONTACT'> = ['HOME', 'SERVICES', 'CONTACT']

const emptyForm = (): FAQWithTranslations => ({
  question: '',
  answer: '',
  category: 'GENERAL',
  orderWeight: 0,
  visibleOn: ['HOME'],
  translations: { az: {}, ru: {} },
})

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [editing, setEditing] = useState<FAQWithTranslations | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [langTab, setLangTab] = useState<LangTab>('en')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => { fetchFAQs() }, [])

  const fetchFAQs = async () => {
    const res = await adminApi.getFAQs()
    if (res.data.data) setFaqs(res.data.data)
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    setSaveError(null)
    try {
      const payload = {
        ...editing,
        translations: editing.translations as unknown as Record<string, Record<string, unknown>>,
      }
      if (editingId) {
        await adminApi.updateFAQ(editingId, payload)
      } else {
        await adminApi.createFAQ(payload)
      }
      setEditing(null)
      setEditingId(null)
      fetchFAQs()
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setSaveError(e?.response?.data?.message || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this FAQ?')) return
    await adminApi.deleteFAQ(id)
    fetchFAQs()
  }

  const openEdit = (f?: FAQ) => {
    setEditing(
      f
        ? {
            ...f,
            translations: (() => {
              try { return JSON.parse(f.translations || '{}') } catch { return { az: {}, ru: {} } }
            })(),
          }
        : emptyForm()
    )
    setEditingId(f?.id || null)
    setLangTab('en')
    setSaveError(null)
  }

  const toggleVisible = (page: 'HOME' | 'SERVICES' | 'CONTACT') => {
    if (!editing) return
    const current = editing.visibleOn || []
    const next = current.includes(page) ? current.filter((p) => p !== page) : [...current, page]
    setEditing({ ...editing, visibleOn: next })
  }

  const tField = (field: 'question' | 'answer'): string => {
    if (langTab === 'en') return ''
    return (editing?.translations?.[langTab]?.[field] as string) || ''
  }

  const setTField = (field: 'question' | 'answer', val: string) => {
    if (!editing) return
    setEditing({
      ...editing,
      translations: {
        ...editing.translations,
        [langTab]: { ...editing.translations[langTab], [field]: val },
      },
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">FAQs</h1>
          <p className="text-gray-500 text-sm mt-1">{faqs.length} questions</p>
        </div>
        <button onClick={() => openEdit()} className="btn-accent flex items-center gap-2 text-sm">
          <Plus size={16} /> New FAQ
        </button>
      </div>

      {editing && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">{editingId ? 'Edit FAQ' : 'New FAQ'}</h2>
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
                  <label className="block text-xs text-gray-500 mb-1">Question *</label>
                  <input
                    value={editing.question || ''}
                    onChange={(e) => setEditing({ ...editing, question: e.target.value })}
                    className="admin-input"
                    placeholder="What does a fractional PM engagement look like?"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Answer *</label>
                  <textarea
                    value={editing.answer || ''}
                    onChange={(e) => setEditing({ ...editing, answer: e.target.value })}
                    rows={4}
                    className="admin-input resize-none"
                    placeholder="It typically starts with a discovery week..."
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Question ({langTab.toUpperCase()})</label>
                  <input
                    value={tField('question')}
                    onChange={(e) => setTField('question', e.target.value)}
                    className="admin-input"
                    placeholder={`Question in ${langTab.toUpperCase()}...`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Answer ({langTab.toUpperCase()})</label>
                  <textarea
                    value={tField('answer')}
                    onChange={(e) => setTField('answer', e.target.value)}
                    rows={4}
                    className="admin-input resize-none"
                    placeholder={`Answer in ${langTab.toUpperCase()}...`}
                  />
                </div>
              </>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Category</label>
                <select
                  value={editing.category || 'GENERAL'}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value as FAQ['category'] })}
                  className="admin-input"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
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
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">Visible on pages</label>
              <div className="flex gap-4">
                {VISIBLE_OPTIONS.map((page) => (
                  <label key={page} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(editing.visibleOn || []).includes(page)}
                      onChange={() => toggleVisible(page)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-400 text-sm">{page}</span>
                  </label>
                ))}
              </div>
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
        {faqs.map((f) => (
          <div key={f.id} className="card flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-white font-medium text-sm">{f.question}</span>
                <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{f.category}</span>
              </div>
              <p className="text-gray-500 text-xs line-clamp-2">{f.answer}</p>
              <p className="text-gray-700 text-xs mt-0.5">{(f.visibleOn || []).join(' · ')}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(f)} className="text-gray-500 hover:text-white">
                <Pencil size={16} />
              </button>
              <button onClick={() => handleDelete(f.id)} className="text-gray-500 hover:text-red-400">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {faqs.length === 0 && (
          <p className="text-gray-600 text-sm text-center py-8">No FAQs yet.</p>
        )}
      </div>
    </div>
  )
}
