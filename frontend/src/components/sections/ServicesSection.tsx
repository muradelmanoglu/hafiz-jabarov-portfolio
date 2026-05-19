'use client'

import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/navigation'
import type { PortfolioService } from '@/lib/api'

export default function ServicesSection({ services = [] }: { services?: PortfolioService[] }) {
  const t = useTranslations('services')

  const featured = services.filter((s) => s.featured).slice(0, 3)

  return (
    <section className="section border-t border-border">
      <div className="container-main">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="section-label">{t('label')}</span>
            <h2 className="display-md text-fg">{t('heading')}</h2>
          </div>
          <Link href="/services" className="btn-ghost text-sm whitespace-nowrap">
            {t('viewAll')} <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card card-hover flex flex-col"
            >
              <div className="flex-1">
                <h3 className="text-fg font-semibold text-base mb-2">{service.title}</h3>
                <p className="text-muted text-sm leading-relaxed mb-4">{service.shortDescription}</p>
                {service.deliverables && service.deliverables.length > 0 && (
                  <ul className="space-y-1 mb-4">
                    {service.deliverables.slice(0, 3).map((d) => (
                      <li key={d} className="text-muted text-xs flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
                        {d}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="divider my-4" />
              <div className="flex items-center justify-between">
                {service.startingRate && service.startingRateVisible && (
                  <p className="text-muted-2 text-xs">{service.startingRate}</p>
                )}
                <p className="text-muted text-xs">{service.engagementDuration}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
