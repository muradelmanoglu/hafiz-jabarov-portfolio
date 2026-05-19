'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/navigation'
import { publicApi, type SiteSettings } from '@/lib/api'

const DEFAULT_STATS = [
  { value: '7+', labelKey: 'stats.yearsExp' },
  { value: '30+', labelKey: 'stats.products' },
  { value: '$50M+', labelKey: 'stats.revenue' },
  { value: '15+', labelKey: 'stats.teams' },
]

export default function HeroSection() {
  const t = useTranslations('hero')
  const [settings, setSettings] = useState<Partial<SiteSettings>>({})

  useEffect(() => {
    publicApi.getSettings().then((res) => {
      if (res.data.data) setSettings(res.data.data)
    }).catch(() => {})
  }, [])

  const stats = settings.headlineMetrics && settings.headlineMetrics.length > 0
    ? settings.headlineMetrics.map((m) => ({ value: m.value, label: m.label }))
    : DEFAULT_STATS.map((s) => ({ value: s.value, label: t(s.labelKey) }))

  const calendlyUrl = settings.calendly || 'https://calendly.com/hafizjabarov'

  return (
    <section className="section min-h-screen flex flex-col justify-center pt-20 md:pt-28">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-8"
        >
          <span className="dot-available" />
          <span className="text-sm text-muted-2">{t('available')}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="display-xl text-fg mb-6 max-w-4xl"
        >
          {t('headline1')}{' '}
          <em className="not-italic" style={{ color: 'var(--accent)' }}>
            {t('headlineAccent')}
          </em>{' '}
          {t('headline2')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-2 max-w-xl mb-10 leading-relaxed"
        >
          {t('subheadline')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap gap-4 mb-20"
        >
          <Link href="/work" className="btn-accent">
            {t('viewWork')} <ArrowRight size={16} />
          </Link>
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            <CalendarDays size={16} />
            {t('bookCall')}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-border"
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="heading-serif text-3xl md:text-4xl text-fg mb-1">{stat.value}</p>
              <p className="text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
