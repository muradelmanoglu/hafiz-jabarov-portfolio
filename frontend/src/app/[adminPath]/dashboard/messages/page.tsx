'use client'

import { useEffect, useState } from 'react'
import { adminApi, type ContactSubmission } from '@/lib/api'
import { Trash2, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-green-900/50 text-green-400',
  READ: 'bg-gray-800 text-gray-400',
  REPLIED: 'bg-blue-900/50 text-blue-400',
  SPAM: 'bg-red-900/50 text-red-400',
  ARCHIVED: 'bg-yellow-900/50 text-yellow-400',
}

const STATUSES = ['NEW', 'READ', 'REPLIED', 'SPAM', 'ARCHIVED'] as const

export default function MessagesPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [selected, setSelected] = useState<ContactSubmission | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchSubmissions() }, [])

  const fetchSubmissions = async () => {
    setLoading(true)
    try {
      const res = await adminApi.getSubmissions()
      if (res.data.data?.content) setSubmissions(res.data.data.content)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = async (sub: ContactSubmission) => {
    setSelected(sub)
    if (sub.status === 'NEW') {
      await adminApi.updateSubmissionStatus(sub.id, 'READ')
      setSubmissions((prev) =>
        prev.map((s) => (s.id === sub.id ? { ...s, status: 'READ' } : s))
      )
    }
  }

  const handleStatusChange = async (id: number, status: string) => {
    await adminApi.updateSubmissionStatus(id, status)
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status: status as ContactSubmission['status'] } : s)))
    if (selected?.id === id) setSelected((s) => s ? { ...s, status: status as ContactSubmission['status'] } : s)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this submission?')) return
    await adminApi.deleteSubmission(id)
    setSubmissions((prev) => prev.filter((s) => s.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  if (loading) return <div className="text-gray-500">Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Submissions</h1>
      <p className="text-gray-500 mb-6">
        {submissions.filter((s) => s.status === 'NEW').length} new messages
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* List */}
        <div className="space-y-2">
          {submissions.length === 0 && <p className="text-gray-600 text-sm">No submissions yet.</p>}
          {submissions.map((sub) => (
            <div
              key={sub.id}
              onClick={() => handleSelect(sub)}
              className={cn(
                'card cursor-pointer hover:border-gray-600 transition-all',
                selected?.id === sub.id && 'border-accent',
                sub.status === 'NEW' && 'border-l-2 border-l-green-500'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye size={14} className="text-gray-600 shrink-0" />
                    <span className="font-medium text-sm text-white truncate">{sub.name}</span>
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-full shrink-0',
                        STATUS_COLORS[sub.status] || 'bg-gray-800 text-gray-400'
                      )}
                    >
                      {sub.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs truncate">{sub.projectType.replace('_', ' ')}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(sub.id) }}
                  className="text-gray-700 hover:text-red-400 transition-colors shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Detail */}
        {selected ? (
          <div className="card">
            <div className="mb-4 pb-4 border-b border-gray-800">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="text-white font-semibold">{selected.name}</h2>
                <select
                  value={selected.status}
                  onChange={(e) => handleStatusChange(selected.id, e.target.value)}
                  className="admin-input text-xs w-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <p className="text-gray-500 text-sm">{selected.email}</p>
              {selected.company && <p className="text-gray-600 text-xs mt-0.5">{selected.company}</p>}
              <div className="flex gap-4 mt-2 text-xs text-gray-600">
                <span>{selected.projectType.replace('_', ' ')}</span>
                {selected.budgetRange && <span>{selected.budgetRange.replace('_', ' ')}</span>}
              </div>
              <p className="text-gray-700 text-xs mt-1">
                {new Date(selected.submittedAt).toLocaleString('en-US')}
              </p>
            </div>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">{selected.message}</p>
            <div className="mt-6 pt-4 border-t border-gray-800">
              <a href={`mailto:${selected.email}`} className="btn-accent text-sm inline-flex">
                Reply by email
              </a>
            </div>
          </div>
        ) : (
          <div className="card flex items-center justify-center text-gray-700 text-sm h-48">
            Select a submission
          </div>
        )}
      </div>
    </div>
  )
}
