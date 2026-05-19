'use client'

import { useEffect, useState } from 'react'
import { adminApi, publicApi, type Skill } from '@/lib/api'
import { Plus, Pencil, Trash2, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'

const CATEGORIES: Skill['category'][] = [
  'PROJECT_MANAGEMENT', 'DOCUMENTATION', 'ANALYTICS', 'DESIGN', 'SEO', 'TOOLS', 'OTHER',
]
const PROFICIENCIES: Skill['proficiency'][] = ['FAMILIAR', 'PROFICIENT', 'EXPERT']

const emptyForm = (): Partial<Skill> => ({
  name: '',
  category: 'TOOLS',
  proficiency: 'PROFICIENT',
  yearsUsed: undefined,
  customCategory: undefined,
  orderWeight: 0,
})

export default function SkillsPage() {
  const t = useTranslations('admin.skills')
  const [skills, setSkills] = useState<Skill[]>([])
  const [editing, setEditing] = useState<Partial<Skill> | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => { fetchSkills() }, [])

  const fetchSkills = async () => {
    const res = await publicApi.getSkills()
    if (res.data.data) setSkills(res.data.data)
  }

  const handleSave = async () => {
    if (!editing) return
    if (editingId) {
      await adminApi.updateSkill(editingId, editing)
    } else {
      await adminApi.createSkill(editing)
    }
    setEditing(null)
    setEditingId(null)
    fetchSkills()
  }

  const handleDelete = async (id: number) => {
    if (!confirm(t('deleteConfirm'))) return
    await adminApi.deleteSkill(id)
    fetchSkills()
  }

  const displayCategory = (skill: Skill) =>
    skill.category === 'OTHER' && skill.customCategory
      ? skill.customCategory
      : skill.category.replace(/_/g, ' ')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{skills.length} {t('title').toLowerCase()}</p>
        </div>
        <button
          onClick={() => { setEditing(emptyForm()); setEditingId(null) }}
          className="btn-accent flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> {t('newSkill')}
        </button>
      </div>

      {editing && (
        <div className="card mb-6">
          <h2 className="text-white font-semibold mb-4">{editingId ? t('editSkill') : t('newSkill')}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">{t('name')} *</label>
              <input
                value={editing.name || ''}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">{t('category')}</label>
              <select
                value={editing.category || 'TOOLS'}
                onChange={(e) => setEditing({ ...editing, category: e.target.value as Skill['category'], customCategory: undefined })}
                className="admin-input"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            {editing.category === 'OTHER' && (
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">{t('customCategory')}</label>
                <input
                  value={editing.customCategory || ''}
                  onChange={(e) => setEditing({ ...editing, customCategory: e.target.value })}
                  className="admin-input"
                  placeholder={t('customCategoryPlaceholder')}
                />
              </div>
            )}
            <div>
              <label className="block text-xs text-gray-500 mb-1">{t('proficiency')}</label>
              <select
                value={editing.proficiency || 'PROFICIENT'}
                onChange={(e) => setEditing({ ...editing, proficiency: e.target.value as Skill['proficiency'] })}
                className="admin-input"
              >
                {PROFICIENCIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">{t('yearsUsed')}</label>
              <input
                type="number"
                value={editing.yearsUsed || ''}
                onChange={(e) => setEditing({ ...editing, yearsUsed: e.target.value ? +e.target.value : undefined })}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">{t('orderWeight')}</label>
              <input
                type="number"
                value={editing.orderWeight || 0}
                onChange={(e) => setEditing({ ...editing, orderWeight: +e.target.value })}
                className="admin-input"
              />
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {skills.map((skill) => (
          <div key={skill.id} className="card flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium text-sm">{skill.name}</span>
                <span className="text-xs text-gray-600 shrink-0">#{skill.orderWeight}</span>
              </div>
              <div className="flex gap-2 mt-1">
                <span className="text-xs text-gray-600">{displayCategory(skill)}</span>
                <span className="text-xs text-gray-600">·</span>
                <span className="text-xs text-gray-600">{skill.proficiency}</span>
                {skill.yearsUsed && <span className="text-xs text-gray-600">· {skill.yearsUsed}y</span>}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => { setEditing({ ...skill }); setEditingId(skill.id) }} className="text-gray-500 hover:text-white">
                <Pencil size={15} />
              </button>
              <button onClick={() => handleDelete(skill.id)} className="text-gray-500 hover:text-red-400">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
