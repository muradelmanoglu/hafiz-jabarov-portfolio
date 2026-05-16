'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { publicApi, type CaseStudy } from '@/lib/api'
import { Link } from '@/lib/navigation'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

export default function WorkPage() {
  const t = useTranslations('work')
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    publicApi.getCaseStudies().then((res) => {
      if (res.data.data) setCaseStudies(res.data.data)
      setLoading(false)
    })
  }, [])

  return (
    <>
      <Navbar />
      <main className="pt-24 md:pt-32">
        <div className="container-main">
          <div className="mb-16">
            <span className="section-label">{t('pageLabel')}</span>
            <h1 className="display-lg text-fg mb-4">{t('pageHeading')}</h1>
            <p className="text-muted-2 max-w-lg">{t('pageDesc')}</p>
          </div>

          {loading ? (
            <div className="text-center text-muted py-20">{t('loading')}</div>
          ) : (
            <div className="space-y-6 pb-32">
              {caseStudies.map((cs, i) => (
                <motion.div
                  key={cs.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
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
                          {cs.tags?.slice(0, 2).map((t) => (
                            <span key={t} className="tag">{t}</span>
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
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
