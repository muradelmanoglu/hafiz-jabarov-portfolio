'use client'

import { useEffect, useState } from 'react'
import { adminApi, publicApi, type Experience } from '@/lib/api'
import { Plus, Pencil, Trash2, Check } from 'lucide-react'

const emptyForm = (): Partial<Experience> => ({
  companyName: '',
  role: '',
  summary: '',
  startDate: '',
  current: false,
  orderWeight: 0,
})

function fmtDate(d?: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [editing, setEditing] = useState<Partial<Experience> | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => { fetchExperience() }, [])

  const fetchExperience = async () => {
    const res = await publicApi.getExperience()
    if (res.data.data) setExperiences(res.data.data)
  }

  const handleSave = async () => {
    if (!editing) return
    if (editingId) {
      await adminApi.updateExperience(editingId, editing)
    } else {
      await adminApi.createExperience(editing)
    }
    setEditing(null)
    setEditingId(null)
    fetchExperience()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this experience entry?')) return
    await adminApi.deleteExperience(id)
    fetchExperience()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Experience</h1>
          <p className="text-gray-500 text-sm mt-1">{experiences.length} entries</p>
        </div>
        <button
          onClick={() => { setEditing(emptyForm()); setEditingId(null) }}
          className="btn-accent flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> New
        </button>
      </div>

      {editing && (
        <div className="card mb-6">
          <h2 className="text-white font-semibold mb-4">{editingId ? 'Edit' : 'New experience'}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Company name *</label>
              <input
                value={editing.companyName || ''}
                onChange={(e) => setEditing({ ...editing, companyName: e.target.value })}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Role *</label>
              <input
                value={editing.role || ''}
                onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Start date</label>
              <input
                type="date"
                value={editing.startDate || ''}
                onChange={(e) => setEditing({ ...editing, startDate: e.target.value })}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">End date</label>
              <input
                type="date"
                value={editing.endDate || ''}
                onChange={(e) => setEditing({ ...editing, endDate: e.target.value })}
                className="admin-input"
                disabled={editing.current}
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
              <label className="block text-xs text-gray-500 mb-1">Order weight</label>
              <input
                type="number"
                value={editing.orderWeight || 0}
                onChange={(e) => setEditing({ ...editing, orderWeight: +e.target.value })}
                className="admin-input"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Summary</label>
              <textarea
                value={editing.summary || ''}
                onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
                rows={3}
                className="admin-input resize-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="current"
                checked={editing.current || false}
                onChange={(e) =>
                  setEditing({ ...editing, current: e.target.checked, endDate: e.target.checked ? '' : editing.endDate })
                }
                className="w-4 h-4"
              />
              <label htmlFor="current" className="text-gray-400 text-sm">Current position</label>
            </div>
          </div>
          <div className="flex gap-3 mt-5 pt-4 border-t border-gray-800">
            <button onClick={handleSave} className="btn-accent flex items-center gap-2 text-sm">
              <Check size={16} /> Save
            </button>
            <button
              onClick={() => { setEditing(null); setEditingId(null) }}
              className="btn-outline text-sm"
            >
              Cancel
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
                  <span className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded-full">Now</span>
                )}
              </div>
              <p className="text-gray-600 text-xs">
                {fmtDate(exp.startDate)} — {exp.current ? 'Present' : fmtDate(exp.endDate)}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => { setEditing({ ...exp }); setEditingId(exp.id) }}
                className="text-gray-500 hover:text-white"
              >
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
