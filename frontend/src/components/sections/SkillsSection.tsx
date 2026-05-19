'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import type { Skill } from '@/lib/api'

const categoryLabels: Record<string, string> = {
  PROJECT_MANAGEMENT: 'Project Mgmt',
  DOCUMENTATION: 'Documentation',
  ANALYTICS: 'Analytics',
  DESIGN: 'Design',
  SEO: 'SEO',
  TOOLS: 'Tools',
  OTHER: 'Other',
}

const proficiencyDots: Record<string, number> = {
  FAMILIAR: 1,
  PROFICIENT: 2,
  EXPERT: 3,
}

export default function SkillsSection({ skills = [] }: { skills?: Skill[] }) {
  const t = useTranslations('skills')
  const [activeCategory, setActiveCategory] = useState<string>('ALL')

  const getCategoryLabel = (cat: string) => {
    if (cat === 'OTHER') {
      const otherSkill = skills.find((s) => s.category === 'OTHER' && s.customCategory)
      return otherSkill?.customCategory || categoryLabels['OTHER']
    }
    return categoryLabels[cat] || cat
  }

  const categories = ['ALL', ...Array.from(new Set(skills.map((s) => s.category)))]
  const filtered = activeCategory === 'ALL' ? skills : skills.filter((s) => s.category === activeCategory)

  return (
    <section className="section border-t border-border">
      <div className="container-main">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="section-label">{t('label')}</span>
            <h2 className="display-md text-fg">{t('heading')}</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                  activeCategory === cat
                    ? 'text-black'
                    : 'text-muted-2 hover:text-fg border border-border hover:border-border-2'
                )}
                style={activeCategory === cat ? { backgroundColor: 'var(--accent)' } : {}}
              >
                {cat === 'ALL' ? t('all') : getCategoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filtered.map((skill, i) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="card flex flex-col gap-2 py-4 px-3"
            >
              <span className="text-fg-2 font-medium text-sm">{skill.name}</span>
              <div className="flex items-center gap-1 mt-auto">
                {[1, 2, 3].map((dot) => (
                  <div
                    key={dot}
                    className="w-1.5 h-1.5 rounded-full transition-colors"
                    style={{
                      backgroundColor:
                        dot <= (proficiencyDots[skill.proficiency] || 0)
                          ? 'var(--accent)'
                          : 'var(--border-2)',
                    }}
                  />
                ))}
                {skill.yearsUsed && (
                  <span className="text-muted text-xs ml-1">{skill.yearsUsed}y</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
