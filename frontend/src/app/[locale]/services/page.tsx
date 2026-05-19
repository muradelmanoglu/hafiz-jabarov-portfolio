'use client'

import { useEffect, useState, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FAQSection from '@/components/sections/FAQSection'
import { publicApi, type PortfolioService, type SiteSettings } from '@/lib/api'
import { Link } from '@/lib/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function ServicesPage() {
  const t = useTranslations('services')
  const [services, setServices] = useState<PortfolioService[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [activeFilter, setActiveFilter] = useState('All')

  useEffect(() => {
    publicApi.getServices().then((res) => {
      if (res.data.data) setServices(res.data.data)
    })
    publicApi.getSettings().then((res) => {
      if (res.data.data) setSettings(res.data.data)
    })
  }, [])

  // Build unique category list
  const categories = useMemo(() => {
    const set = new Set<string>()
    services.forEach((s) => { if (s.category) set.add(s.category) })
    return ['All', ...Array.from(set)]
  }, [services])

  const filtered = useMemo(
    () => activeFilter === 'All' ? services : services.filter((s) => s.category === activeFilter),
    [services, activeFilter]
  )

  const calendlyUrl = settings?.calendly || 'https://calendly.com/hafizjabarov'

  return (
    <>
      <Navbar />
      <main className="pt-24 md:pt-32">
        <div className="container-main">
          <div className="mb-20">
            <span className="section-label">{t('label')}</span>
            <h1 className="display-lg text-fg mb-4">{t('heading')}</h1>
            <p className="text-muted-2 max-w-lg">{t('pageDesc')}</p>
          </div>

          {/* Filter tabs — only show if multiple categories */}
          {categories.length > 2 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                    activeFilter === cat
                      ? 'border-transparent text-bg'
                      : 'border-border text-muted-2 hover:border-accent hover:text-fg'
                  }`}
                  style={activeFilter === cat ? { backgroundColor: 'var(--accent)', borderColor: 'var(--accent)' } : {}}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

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
                        {service.category && (
                          <span className="tag text-xs">{service.category}</span>
                        )}
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

        <FAQSection page="SERVICES" />

        <section className="section border-t border-border">
          <div className="container-main text-center">
            <h2 className="display-md text-fg mb-4">{t('notSure')}</h2>
            <p className="text-muted-2 mb-8 max-w-md mx-auto">{t('notSureDesc')}</p>
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent inline-flex"
            >
              <CalendarDays size={16} />
              {t('bookFreeCall')}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
