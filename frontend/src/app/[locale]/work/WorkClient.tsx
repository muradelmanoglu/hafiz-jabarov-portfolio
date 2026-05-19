'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/navigation'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CaseStudy } from '@/lib/api'

export default function WorkClient({ caseStudies }: { caseStudies: CaseStudy[] }) {
  const t = useTranslations('work')
  const [activeFilter, setActiveFilter] = useState('All')

  const domains = useMemo(() => {
    const set = new Set<string>()
    caseStudies.forEach((cs) => { if (cs.domain) set.add(cs.domain) })
    return ['All', ...Array.from(set)]
  }, [caseStudies])

  const filtered = useMemo(
    () => activeFilter === 'All' ? caseStudies : caseStudies.filter((cs) => cs.domain === activeFilter),
    [caseStudies, activeFilter]
  )

  return (
    <div className="container-main">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="section-label">{t('pageLabel')}</span>
          <h1 className="display-lg text-fg mb-2">{t('pageHeading')}</h1>
          <p className="text-muted-2 max-w-lg text-sm">{t('pageDesc')}</p>
        </div>

        {domains.length > 2 && (
          <div className="flex flex-wrap gap-2">
            {domains.map((d) => (
              <button
                key={d}
                onClick={() => setActiveFilter(d)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                  activeFilter === d
                    ? 'text-black'
                    : 'text-muted-2 hover:text-fg border border-border hover:border-border-2'
                )}
                style={activeFilter === d ? { backgroundColor: 'var(--accent)' } : {}}
              >
                {d}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6 pb-32">
        <AnimatePresence mode="popLayout">
          {filtered.map((cs, i) => (
            <motion.div
              key={cs.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <Link href={`/work/${cs.slug}`} className="group block">
                <div className="card card-hover flex flex-col md:flex-row gap-6 md:items-center">
                  <span
                    className="heading-serif text-5xl font-bold shrink-0 w-14"
                    style={{ color: 'var(--border-2)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {cs.domain && <span className="tag">{cs.domain}</span>}
                      {cs.company && <span className="tag">{cs.company.name}</span>}
                      {cs.tags?.slice(0, 2).map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                    <h2 className="text-lg font-semibold text-fg mb-1">{cs.title}</h2>
                    <p className="text-muted text-sm line-clamp-2">{cs.summary}</p>
                  </div>

                  {cs.outcomeMetrics && cs.outcomeMetrics.length > 0 && (
                    <div className="hidden md:flex gap-6 shrink-0">
                      {cs.outcomeMetrics.slice(0, 2).map((m) => (
                        <div key={m.label} className="text-right">
                          <p className="heading-serif text-xl font-bold" style={{ color: 'var(--accent)' }}>
                            {m.value}
                          </p>
                          <p className="text-muted text-xs">{m.label}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <ArrowRight
                    size={18}
                    className="shrink-0 text-muted group-hover:text-fg group-hover:translate-x-1 transition-all"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="text-center text-muted py-16">{t('notFound')}</p>
        )}
      </div>
    </div>
  )
}
