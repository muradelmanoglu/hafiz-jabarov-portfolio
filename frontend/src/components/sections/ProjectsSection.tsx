'use client'

import { useEffect, useState } from 'react'
import { publicApi, type CaseStudy } from '@/lib/api'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/lib/navigation'

export default function FeaturedWorkSection() {
  const t = useTranslations('work')
  const locale = useLocale()
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])

  useEffect(() => {
    publicApi.getFeaturedCaseStudies().then((res) => {
      if (res.data.data) setCaseStudies(res.data.data)
    })
  }, [])

  return (
    <section className="section border-t border-border">
      <div className="container-main">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="section-label">{t('label')}</span>
            <h2 className="display-md text-fg">{t('heading')}</h2>
          </div>
          <Link href="/work" className="btn-ghost text-sm whitespace-nowrap">
            {t('viewAll')} <ArrowRight size={14} />
          </Link>
        </div>

        <div className="space-y-6">
          {caseStudies.map((cs, i) => (
            <motion.div
              key={cs.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link href={`/work/${cs.slug}`} className="group block">
                <div className="card card-hover flex flex-col md:flex-row gap-6 md:items-center">
                  <span
                    className="heading-serif text-4xl md:text-5xl font-bold shrink-0 w-12 text-center transition-colors"
                    style={{ color: 'var(--border-2)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {cs.domain && <span className="tag">{cs.domain}</span>}
                      {cs.tags?.slice(0, 2).map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                    <h3 className="text-lg font-semibold text-fg mb-1 group-hover:text-fg transition-colors">
                      {cs.title}
                    </h3>
                    <p className="text-muted text-sm line-clamp-2">{cs.summary}</p>
                  </div>

                  {cs.outcomeMetrics && cs.outcomeMetrics.length > 0 && (
                    <div className="flex gap-6 shrink-0">
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

                  <ArrowRight size={18} className="shrink-0 text-muted group-hover:text-fg group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}

          {caseStudies.length === 0 && (
            <div className="text-center text-muted py-16">{t('loadingCaseStudies')}</div>
          )}
        </div>
      </div>
    </section>
  )
}
