'use client'

import { useEffect, useState } from 'react'
import { adminApi, type Education } from '@/lib/api'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

type LangTab = 'en' | 'az' | 'ru'

type EducationWithTranslations = Partial<Education> & {
  translations: Record<string, Record<string, unknown>>
}

const emptyForm = (): EducationWithTranslations => ({
  institution: '',
  program: '',
  location: '',
  startDate: '',
  orderWeight: 0,
  bullets: [],
  translations: { az: {}, ru: {} },
})

export default function EducationPage() {
  const t = useTranslations('admin.education')
  const [items, setItems] = useState<Education[]>([])
  const [editing, setEditing] = useState<EducationWithTranslations | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [langTab, setLangTab] = useState<LangTab>('en')
  const [newBullet, setNewBullet] = useState('')
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    const res = await adminApi.getEducation()
    if (res.data.data) setItems(res.data.data)
  }

  const handleSave = async () => {
    if (!editing) return
    setSaveError(null)
    try {
      if (editingId) {
        await adminApi.updateEducation(editingId, editing)
      } else {
        await adminApi.createEducation(editing)
      }
      setEditing(null)
      setEditingId(null)
      fetchItems()
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setSaveError(e?.response?.data?.message || 'Save failed')
    }
  }

  const tField = (field: string): string => {
    if (langTab === 'en') return ''
    return (editing?.translations?.[langTab]?.[field] as string) || ''
  }

  const setTField = (field: string, val: string) => {
    if (!editing) return
    setEditing({
      ...editing,
      translations: {
        ...editing.translations,
        [langTab]: { ...editing.translations[langTab], [field]: val },
      },
    })
  }

  const tBullets = (): string[] => {
    if (langTab === 'en') return editing?.bullets || []
    return (editing?.translations?.[langTab]?.bullets as string[]) || []
  }

  const setTBullets = (bullets: string[]) => {
    if (!editing) return
    if (langTab === 'en') {
      setEditing({ ...editing, bullets })
    } else {
      setEditing({
        ...editing,
        translations: {
          ...editing.translations,
          [langTab]: { ...editing.translations[langTab], bullets },
        },
      })
    }
  }

  const addBullet = () => {
    const b = newBullet.trim()
    if (!b) return
    setTBullets([...tBullets(), b])
    setNewBullet('')
  }

  const removeBullet = (i: number) => {
    const arr = [...tBullets()]
    arr.splice(i, 1)
    setTBullets(arr)
  }

  const openEdit = (item?: Education, id?: number) => {
    setEditing(
      item
        ? {
            ...item,
            translations: (() => {
              const t = item.translations
              if (!t) return { az: {}, ru: {} }
              if (typeof t === 'string') { try { return JSON.parse(t) } catch { return { az: {}, ru: {} } } }
              return t as Record<string, Record<string, unknown>>
            })(),
          }
        : emptyForm()
    )
    setEditingId(id || null)
    setLangTab('en')
    setNewBullet('')
    setSaveError(null)
  }

  const LANG_TABS: { key: LangTab; label: string }[] = [
    { key: 'en', label: 'EN' },
    { key: 'az', label: 'AZ' },
    { key: 'ru', label: 'RU' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{items.length} entries</p>
        </div>
        <button onClick={() => openEdit()} className="btn-accent flex items-center gap-2 text-sm">
          <Plus size={16} /> {t('new')}
        </button>
      </div>

      {editing && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">{editingId ? t('edit') : t('newEntry')}</h2>
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

          {langTab === 'en' ? (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Institution *</label>
                <input
                  value={editing.institution || ''}
                  onChange={(e) => setEditing({ ...editing, institution: e.target.value })}
                  className="admin-input"
                  placeholder="Baku State University"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Program *</label>
                <input
                  value={editing.program || ''}
                  onChange={(e) => setEditing({ ...editing, program: e.target.value })}
                  className="admin-input"
                  placeholder="BSc Computer Science"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Location</label>
                <input
                  value={editing.location || ''}
                  onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Order</label>
                <input
                  type="number"
                  value={editing.orderWeight || 0}
                  onChange={(e) => setEditing({ ...editing, orderWeight: +e.target.value })}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start date</label>
                <input
                  type="month"
                  value={editing.startDate || ''}
                  onChange={(e) => setEditing({ ...editing, startDate: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End date</label>
                <input
                  type="month"
                  value={editing.endDate || ''}
                  onChange={(e) => setEditing({ ...editing, endDate: e.target.value })}
                  className="admin-input"
                />
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Program ({langTab.toUpperCase()})
                </label>
                <input
                  value={tField('program')}
                  onChange={(e) => setTField('program', e.target.value)}
                  className="admin-input"
                  placeholder={`Program name in ${langTab.toUpperCase()}...`}
                />
              </div>
            </div>
          )}

          {/* Bullets for current lang */}
          <div className="mt-4">
            <label className="block text-xs text-gray-500 mb-2">
              Bullets ({langTab.toUpperCase()})
            </label>
            <div className="space-y-2 mb-3">
              {tBullets().map((b, i) => (
                <div key={i} className="flex items-start gap-2 bg-gray-800/50 rounded-lg px-3 py-2">
                  <span className="text-gray-300 text-sm flex-1">{b}</span>
                  <button
                    onClick={() => removeBullet(i)}
                    className="text-gray-500 hover:text-red-400 shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newBullet}
                onChange={(e) => setNewBullet(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBullet())}
                placeholder="Add a bullet point..."
                className="admin-input flex-1"
              />
              <button onClick={addBullet} className="btn-outline text-sm px-3">
                <Plus size={14} />
              </button>
            </div>
          </div>

          {saveError && (
            <p className="text-red-400 text-sm mt-3 bg-red-950/50 px-3 py-2 rounded-lg">
              {saveError}
            </p>
          )}

          <div className="flex gap-3 mt-5 pt-4 border-t border-gray-800">
            <button onClick={handleSave} className="btn-accent flex items-center gap-2 text-sm">
              <Check size={16} /> {t('save')}
            </button>
            <button
              onClick={() => {
                setEditing(null)
                setEditingId(null)
              }}
              className="btn-outline text-sm"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="card flex items-start justify-between gap-4">
            <div>
              <p className="text-white font-medium text-sm">{item.program}</p>
              <p className="text-sm" style={{ color: 'var(--accent)' }}>
                {item.institution}
              </p>
              <p className="text-gray-600 text-xs mt-0.5">
                {item.startDate?.slice(0, 7)} —{' '}
                {item.endDate?.slice(0, 7) || 'Present'}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => openEdit(item, item.id)}
                className="text-gray-500 hover:text-white"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={async () => {
                  if (confirm(t('deleteConfirm'))) {
                    await adminApi.deleteEducation(item.id)
                    fetchItems()
                  }
                }}
                className="text-gray-500 hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
