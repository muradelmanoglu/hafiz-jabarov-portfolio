'use client'

import { useEffect, useState } from 'react'
import { adminApi, type CaseStudy } from '@/lib/api'
import { Plus, Pencil, Trash2, Check, ExternalLink } from 'lucide-react'
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
})

const STATUS_BADGE: Record<string, string> = {
  PUBLISHED: 'bg-green-900/50 text-green-400',
  DRAFT: 'bg-gray-800 text-gray-400',
  ARCHIVED: 'bg-yellow-900/50 text-yellow-400',
}

export default function CaseStudiesPage() {
  const t = useTranslations('admin.projects')
  const tf = useTranslations('admin.projects.fields')
  const locale = useLocale()
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [editing, setEditing] = useState<Partial<CaseStudy> | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => { fetchCaseStudies() }, [])

  const fetchCaseStudies = async () => {
    const res = await adminApi.getCaseStudies()
    if (res.data.data) setCaseStudies(res.data.data)
  }

  const handleSave = async () => {
    if (!editing) return
    if (editingId) {
      await adminApi.updateCaseStudy(editingId, editing)
    } else {
      await adminApi.createCaseStudy(editing)
    }
    setEditing(null)
    setEditingId(null)
    fetchCaseStudies()
  }

  const handleDelete = async (id: number) => {
    if (!confirm(t('deleteConfirm'))) return
    await adminApi.deleteCaseStudy(id)
    fetchCaseStudies()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{caseStudies.length} case studies</p>
        </div>
        <button
          onClick={() => { setEditing(emptyForm()); setEditingId(null) }}
          className="btn-accent flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> {t('newCaseStudy')}
        </button>
      </div>

      {editing && (
        <div className="card mb-6">
          <h2 className="text-white font-semibold mb-4">{editingId ? t('editCaseStudy') : t('newCaseStudy')}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">{tf('title')} *</label>
              <input value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">{tf('slug')}</label>
              <input value={editing.slug || ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">{tf('role')}</label>
              <input value={editing.role || ''} onChange={(e) => setEditing({ ...editing, role: e.target.value })} className="admin-input" />
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
              <label className="block text-xs text-gray-500 mb-1">{tf('orderWeight')}</label>
              <input type="number" value={editing.orderWeight || 0} onChange={(e) => setEditing({ ...editing, orderWeight: +e.target.value })} className="admin-input" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">{tf('summary')}</label>
              <textarea value={editing.summary || ''} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} rows={3} className="admin-input resize-none" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={editing.featured || false} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="w-4 h-4" />
              <label htmlFor="featured" className="text-gray-400 text-sm">{tf('featured')}</label>
            </div>
          </div>
          <div className="flex gap-3 mt-5 pt-4 border-t border-gray-800">
            <button onClick={handleSave} className="btn-accent flex items-center gap-2 text-sm">
              <Check size={16} /> {t('save')}
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
            </div>
            <div className="flex gap-2 shrink-0 items-center">
              {cs.status === 'PUBLISHED' && (
                <Link href={`/${locale}/work/${cs.slug}`} target="_blank" className="text-gray-500 hover:text-white">
                  <ExternalLink size={14} />
                </Link>
              )}
              <button onClick={() => { setEditing({ ...cs }); setEditingId(cs.id) }} className="text-gray-500 hover:text-white">
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
