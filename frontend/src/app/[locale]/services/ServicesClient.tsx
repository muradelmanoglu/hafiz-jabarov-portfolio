'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import type { PortfolioService } from '@/lib/api'

export default function ServicesClient({
  services,
  locale,
}: {
  services: PortfolioService[]
  locale: string
}) {
  const t = useTranslations('services')
  const [activeFilter, setActiveFilter] = useState('All')

  const categories = useMemo(() => {
    const set = new Set<string>()
    services.forEach((s) => { if (s.category) set.add(s.category) })
    return ['All', ...Array.from(set)]
  }, [services])

  const filtered = useMemo(
    () => activeFilter === 'All' ? services : services.filter((s) => s.category === activeFilter),
    [services, activeFilter]
  )

  return (
    <div className="container-main">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="section-label">{t('label')}</span>
          <h1 className="display-lg text-fg mb-2">{t('heading')}</h1>
          <p className="text-muted-2 max-w-lg text-sm">{t('pageDesc')}</p>
        </div>

        {categories.length > 2 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                  activeFilter === cat
                    ? 'text-black'
                    : 'text-muted-2 hover:text-fg border border-border hover:border-border-2'
                )}
                style={activeFilter === cat ? { backgroundColor: 'var(--accent)' } : {}}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6 mb-32">
        <AnimatePresence mode="popLayout">
          {filtered.map((service, i) => (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="card"
            >
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h2 className="text-fg font-semibold text-lg">{service.title}</h2>
                    {service.category && <span className="tag text-xs">{service.category}</span>}
                  </div>
                  <p className="text-muted-2 text-sm leading-relaxed mb-4">{service.longDescription}</p>

                  {service.deliverables && service.deliverables.length > 0 && (
                    <div>
                      <p className="text-muted text-xs uppercase tracking-widest mb-2 font-mono">{t('deliverables')}</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                        {service.deliverables.map((d) => (
                          <li key={d} className="text-muted-2 text-sm flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="md:w-56 shrink-0 flex flex-col gap-3">
                  <div className="card" style={{ backgroundColor: 'var(--surface-2)' }}>
                    <p className="text-muted text-xs mb-0.5">{t('duration')}</p>
                    <p className="text-fg-2 text-sm font-medium">{service.engagementDuration}</p>
                  </div>
                  {service.startingRate && service.startingRateVisible && (
                    <div className="card" style={{ backgroundColor: 'var(--surface-2)' }}>
                      <p className="text-muted text-xs mb-0.5">{t('startingFrom')}</p>
                      <p className="text-fg-2 text-sm font-medium">{service.startingRate}</p>
                    </div>
                  )}
                  <Link href="/contact" className="btn-accent justify-center text-sm">
                    {service.ctaText}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
