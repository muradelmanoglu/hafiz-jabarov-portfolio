'use client'

import { useEffect, useState } from 'react'
import { adminApi, api, type Company } from '@/lib/api'
import { Plus, Pencil, Trash2, Check, Upload, X, Building2 } from 'lucide-react'
import Image from 'next/image'

const emptyForm = (): Partial<Company> => ({
  name: '',
  website: '',
  location: '',
  logoUrl: '',
  description: '',
})

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [editing, setEditing] = useState<Partial<Company> | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => { fetchCompanies() }, [])

  const fetchCompanies = async () => {
    const res = await adminApi.getCompanies()
    if (res.data.data) setCompanies(res.data.data)
  }

  const handleSave = async () => {
    if (!editing || !editing.name?.trim()) return
    if (editingId) {
      await adminApi.updateCompany(editingId, editing)
    } else {
      await adminApi.createCompany(editing)
    }
    setEditing(null)
    setEditingId(null)
    fetchCompanies()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bu şirkəti silmək istəyirsiniz?')) return
    await adminApi.deleteCompany(id)
    fetchCompanies()
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setUploading(true)
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
        setEditing((prev) => ({ ...prev, logoUrl: res.data.data }))
      } else {
        alert('Upload failed')
      }
    } catch {
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Brendlər</h1>
          <p className="text-gray-500 text-sm mt-1">{companies.length} şirkət</p>
        </div>
        <button
          onClick={() => { setEditing(emptyForm()); setEditingId(null) }}
          className="btn-accent flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> Yeni şirkət
        </button>
      </div>

      {editing && (
        <div className="card mb-6">
          <h2 className="text-white font-semibold mb-4">
            {editingId ? 'Şirkəti redaktə et' : 'Yeni şirkət'}
          </h2>

          {/* Logo upload */}
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-2">Logo</label>
            <div className="flex items-center gap-4">
              {editing.logoUrl ? (
                <div className="relative w-24 h-12 bg-gray-800 rounded flex items-center justify-center overflow-hidden">
                  <Image src={editing.logoUrl} alt="logo" fill className="object-contain p-1" unoptimized />
                  <button
                    onClick={() => setEditing({ ...editing, logoUrl: '' })}
                    className="absolute top-0.5 right-0.5 bg-red-500 rounded-full p-0.5 text-white"
                  >
                    <X size={10} />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-12 bg-gray-800 rounded flex items-center justify-center">
                  <Building2 size={20} className="text-gray-600" />
                </div>
              )}
              <label className={`btn-outline text-xs px-3 py-2 cursor-pointer flex items-center gap-1.5 ${uploading ? 'opacity-50' : ''}`}>
                <Upload size={12} />
                {uploading ? 'Yüklənir...' : 'Logo yüklə'}
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploading} />
              </label>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Ad *</label>
              <input
                value={editing.name || ''}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="admin-input"
                placeholder="Şirkətin adı"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Vebsayt</label>
              <input
                value={editing.website || ''}
                onChange={(e) => setEditing({ ...editing, website: e.target.value })}
                className="admin-input"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Şəhər / Ölkə</label>
              <input
                value={editing.location || ''}
                onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                className="admin-input"
                placeholder="Bakı, Azərbaycan"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Qeyd (isteğe bağlı)</label>
              <input
                value={editing.description || ''}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className="admin-input"
                placeholder="Qısa qeyd..."
              />
            </div>
          </div>

          <div className="flex gap-3 mt-5 pt-4 border-t border-gray-800">
            <button onClick={handleSave} className="btn-accent flex items-center gap-2 text-sm">
              <Check size={16} /> Yadda saxla
            </button>
            <button onClick={() => { setEditing(null); setEditingId(null) }} className="btn-outline text-sm">
              Ləğv et
            </button>
          </div>
        </div>
      )}

      {companies.length === 0 && !editing && (
        <div className="card text-center py-12 text-gray-500 text-sm">
          Hələ heç bir şirkət yoxdur. "Yeni şirkət" düyməsini basın.
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {companies.map((company) => (
          <div key={company.id} className="card flex items-center gap-3">
            <div className="w-14 h-10 shrink-0 bg-gray-800 rounded flex items-center justify-center overflow-hidden">
              {company.logoUrl ? (
                <div className="relative w-full h-full">
                  <Image src={company.logoUrl} alt={company.name} fill className="object-contain p-1" unoptimized />
                </div>
              ) : (
                <Building2 size={16} className="text-gray-600" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white font-medium text-sm truncate">{company.name}</p>
              {company.website && (
                <p className="text-xs text-gray-500 truncate">{company.website}</p>
              )}
              {company.location && (
                <p className="text-xs text-gray-600 truncate">{company.location}</p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => { setEditing({ ...company }); setEditingId(company.id) }}
                className="text-gray-500 hover:text-white"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => handleDelete(company.id)}
                className="text-gray-500 hover:text-red-400"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
