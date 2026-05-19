'use client'

import { useEffect, useState } from 'react'
import { adminApi, publicApi, type Experience } from '@/lib/api'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

const emptyForm = (): Partial<Experience> => ({
  companyName: '',
  role: '',
  summary: '',
  startDate: '',
  current: false,
  orderWeight: 0,
  bullets: [],
})

function fmtDate(d?: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function ExperiencePage() {
  const t = useTranslations('admin.experience')
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [editing, setEditing] = useState<Partial<Experience> | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [newBullet, setNewBullet] = useState('')
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => { fetchExperience() }, [])

  const fetchExperience = async () => {
    const res = await publicApi.getExperience()
    if (res.data.data) setExperiences(res.data.data)
  }

  const handleSave = async () => {
    if (!editing) return
    setSaveError(null)
    try {
      if (editingId) {
        await adminApi.updateExperience(editingId, editing)
      } else {
        await adminApi.createExperience(editing)
      }
      setEditing(null)
      setEditingId(null)
      setNewBullet('')
      fetchExperience()
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setSaveError(e?.response?.data?.message || 'Save failed')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm(t('deleteConfirm'))) return
    await adminApi.deleteExperience(id)
    fetchExperience()
  }

  const addBullet = () => {
    const b = newBullet.trim()
    if (!b || !editing) return
    setEditing({ ...editing, bullets: [...(editing.bullets || []), b] })
    setNewBullet('')
  }

  const removeBullet = (i: number) => {
    if (!editing) return
    const bullets = [...(editing.bullets || [])]
    bullets.splice(i, 1)
    setEditing({ ...editing, bullets })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{experiences.length} entries</p>
        </div>
        <button
          onClick={() => { setEditing(emptyForm()); setEditingId(null); setNewBullet(''); setSaveError(null) }}
          className="btn-accent flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> {t('new')}
        </button>
      </div>

      {editing && (
        <div className="card mb-6">
          <h2 className="text-white font-semibold mb-4">{editingId ? t('edit') : t('newEntry')}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">{t('company')} *</label>
              <input value={editing.companyName || ''} onChange={(e) => setEditing({ ...editing, companyName: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">{t('role')} *</label>
              <input value={editing.role || ''} onChange={(e) => setEditing({ ...editing, role: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">{t('startDate')}</label>
              <input type="month" value={editing.startDate || ''} onChange={(e) => setEditing({ ...editing, startDate: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">{t('endDate')}</label>
              <input type="month" value={editing.endDate || ''} onChange={(e) => setEditing({ ...editing, endDate: e.target.value })} className="admin-input" disabled={editing.current} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">{t('location')}</label>
              <input value={editing.location || ''} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">{t('orderWeight')}</label>
              <input type="number" value={editing.orderWeight || 0} onChange={(e) => setEditing({ ...editing, orderWeight: +e.target.value })} className="admin-input" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">{t('summary')}</label>
              <textarea value={editing.summary || ''} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} rows={3} className="admin-input resize-none" />
            </div>

            {/* Bullets */}
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-500 mb-2">Bullet points</label>
              <div className="space-y-2 mb-3">
                {(editing.bullets || []).map((b, i) => (
                  <div key={i} className="flex items-start gap-2 bg-gray-800/50 rounded-lg px-3 py-2">
                    <span className="text-gray-300 text-sm flex-1">{b}</span>
                    <button onClick={() => removeBullet(i)} className="text-gray-500 hover:text-red-400 shrink-0 mt-0.5">
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
                  placeholder="Led a portfolio of 4 products..."
                  className="admin-input flex-1"
                />
                <button onClick={addBullet} className="btn-outline text-sm px-3">
                  <Plus size={14} />
                </button>
              </div>
              <p className="text-gray-600 text-xs mt-1">Enter basaraq və ya + ilə əlavə et</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="current"
                checked={editing.current || false}
                onChange={(e) => setEditing({ ...editing, current: e.target.checked, endDate: e.target.checked ? '' : editing.endDate })}
                className="w-4 h-4"
              />
              <label htmlFor="current" className="text-gray-400 text-sm">{t('current')}</label>
            </div>
          </div>

          {saveError && (
            <p className="text-red-400 text-sm mt-3 bg-red-950/50 px-3 py-2 rounded-lg">{saveError}</p>
          )}

          <div className="flex gap-3 mt-5 pt-4 border-t border-gray-800">
            <button onClick={handleSave} className="btn-accent flex items-center gap-2 text-sm">
              <Check size={16} /> {t('save')}
            </button>
            <button onClick={() => { setEditing(null); setEditingId(null); setNewBullet('') }} className="btn-outline text-sm">
              {t('cancel')}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {experiences.map((exp) => (
          <div key={exp.id} className="card flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-medium text-sm">{exp.role}</span>
                <span className="text-gray-500">@</span>
                <span className="text-sm" style={{ color: 'var(--accent)' }}>{exp.companyName}</span>
                {exp.current && (
                  <span className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded-full">{t('present')}</span>
                )}
              </div>
              <p className="text-gray-600 text-xs">
                {fmtDate(exp.startDate)} — {exp.current ? t('present') : fmtDate(exp.endDate)}
              </p>
              {exp.bullets && exp.bullets.length > 0 && (
                <p className="text-gray-600 text-xs mt-1">{exp.bullets.length} bullet{exp.bullets.length > 1 ? 's' : ''}</p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => { setEditing({ ...exp }); setEditingId(exp.id); setNewBullet(''); setSaveError(null) }} className="text-gray-500 hover:text-white">
                <Pencil size={16} />
              </button>
              <button onClick={() => handleDelete(exp.id)} className="text-gray-500 hover:text-red-400">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
