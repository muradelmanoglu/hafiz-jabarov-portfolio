'use client'

import { useEffect, useState } from 'react'
import { adminApi, type Testimonial } from '@/lib/api'
import { Plus, Pencil, Trash2, Check, Star, ThumbsUp } from 'lucide-react'

const emptyForm = (): Partial<Testimonial> => ({
  quote: '',
  authorName: '',
  authorTitle: '',
  authorCompany: '',
  authorPhotoUrl: '',
  linkedIn: '',
  featured: false,
  orderWeight: 0,
})

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => { fetchTestimonials() }, [])

  const fetchTestimonials = async () => {
    const res = await adminApi.getTestimonials()
    if (res.data.data) setTestimonials(res.data.data)
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    setSaveError(null)
    try {
      if (editingId) {
        await adminApi.updateTestimonial(editingId, editing)
      } else {
        await adminApi.createTestimonial(editing)
      }
      setEditing(null)
      setEditingId(null)
      fetchTestimonials()
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setSaveError(e?.response?.data?.message || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this testimonial?')) return
    await adminApi.deleteTestimonial(id)
    fetchTestimonials()
  }

  const handleApprove = async (id: number) => {
    await adminApi.approveTestimonial(id)
    fetchTestimonials()
  }

  const openEdit = (t?: Testimonial) => {
    setEditing(t ? { ...t } : emptyForm())
    setEditingId(t?.id || null)
    setSaveError(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Testimonials</h1>
          <p className="text-gray-500 text-sm mt-1">{testimonials.length} testimonials</p>
        </div>
        <button onClick={() => openEdit()} className="btn-accent flex items-center gap-2 text-sm">
          <Plus size={16} /> New Testimonial
        </button>
      </div>

      {editing && (
        <div className="card mb-6">
          <h2 className="text-white font-semibold mb-4">{editingId ? 'Edit Testimonial' : 'New Testimonial'}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Quote *</label>
              <textarea
                value={editing.quote || ''}
                onChange={(e) => setEditing({ ...editing, quote: e.target.value })}
                rows={4}
                className="admin-input resize-none"
                placeholder="Working with Hafiz transformed our product delivery..."
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Author Name *</label>
              <input
                value={editing.authorName || ''}
                onChange={(e) => setEditing({ ...editing, authorName: e.target.value })}
                className="admin-input"
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Author Title *</label>
              <input
                value={editing.authorTitle || ''}
                onChange={(e) => setEditing({ ...editing, authorTitle: e.target.value })}
                className="admin-input"
                placeholder="CEO, Acme Inc."
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Company</label>
              <input
                value={editing.authorCompany || ''}
                onChange={(e) => setEditing({ ...editing, authorCompany: e.target.value })}
                className="admin-input"
                placeholder="Acme Inc."
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Photo URL</label>
              <input
                value={editing.authorPhotoUrl || ''}
                onChange={(e) => setEditing({ ...editing, authorPhotoUrl: e.target.value })}
                className="admin-input"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">LinkedIn URL</label>
              <input
                value={editing.linkedIn || ''}
                onChange={(e) => setEditing({ ...editing, linkedIn: e.target.value })}
                className="admin-input"
                placeholder="https://linkedin.com/in/..."
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
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="t-featured"
                checked={editing.featured || false}
                onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="t-featured" className="text-gray-400 text-sm">Featured</label>
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
        {testimonials.map((t) => (
          <div key={t.id} className="card flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-white font-medium text-sm">{t.authorName}</span>
                <span className="text-gray-500 text-xs">{t.authorTitle}</span>
                <span className="text-xs text-gray-700">#{t.orderWeight}</span>
                {t.featured && <span className="text-xs bg-yellow-900/30 text-yellow-400 px-2 py-0.5 rounded-full flex items-center gap-1"><Star size={10} /> Featured</span>}
                {t.approved
                  ? <span className="text-xs bg-green-900/40 text-green-400 px-2 py-0.5 rounded-full">Approved</span>
                  : <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">Pending</span>
                }
              </div>
              <p className="text-gray-500 text-xs line-clamp-2">&ldquo;{t.quote}&rdquo;</p>
            </div>
            <div className="flex gap-2 shrink-0 items-center">
              {!t.approved && (
                <button onClick={() => handleApprove(t.id)} title="Approve" className="text-gray-500 hover:text-green-400">
                  <ThumbsUp size={15} />
                </button>
              )}
              <button onClick={() => openEdit(t)} className="text-gray-500 hover:text-white">
                <Pencil size={16} />
              </button>
              <button onClick={() => handleDelete(t.id)} className="text-gray-500 hover:text-red-400">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <p className="text-gray-600 text-sm text-center py-8">No testimonials yet.</p>
        )}
      </div>
    </div>
  )
}
