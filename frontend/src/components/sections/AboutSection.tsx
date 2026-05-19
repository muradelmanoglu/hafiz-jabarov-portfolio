'use client'

import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/lib/navigation'
import { publicApi, type SiteSettings } from '@/lib/api'

export default function AboutSection() {
  const t = useTranslations('about')
  const locale = useLocale()
  const [settings, setSettings] = useState<Partial<SiteSettings>>(() => {
    if (typeof window === 'undefined') return {}
    try { return JSON.parse(localStorage.getItem('site_settings_cache') || '{}') } catch { return {} }
  })

  useEffect(() => {
    publicApi.getSettings().then((res) => {
      if (res.data.data) {
        setSettings(res.data.data)
        try { localStorage.setItem('site_settings_cache', JSON.stringify(res.data.data)) } catch {}
      }
    }).catch(() => {})
  }, [])

  // Resolve about text: check locale-specific translations, fall back to EN fields, then i18n file
  const aboutTrans = (() => {
    try { return JSON.parse(settings.aboutTranslationsJson || '{}') } catch { return {} }
  })()

  const locTrans = (locale !== 'en' && aboutTrans[locale]) ? aboutTrans[locale] : {}

  const heading = locTrans.heading || settings.aboutHeading || t('heading')
  const p1 = locTrans.p1 || settings.aboutP1 || t('p1')
  const p2 = locTrans.p2 || settings.aboutP2 || t('p2')
  const p3 = locTrans.p3 || settings.aboutP3 || t('p3')

  const traits = [
    { label: t('traits.t1'), desc: t('traits.t1desc') },
    { label: t('traits.t2'), desc: t('traits.t2desc') },
    { label: t('traits.t3'), desc: t('traits.t3desc') },
    { label: t('traits.t4'), desc: t('traits.t4desc') },
  ]

  return (
    <section className="section border-t border-border">
      <div className="container-main">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label">{t('label')}</span>
            <h2 className="display-md text-fg mb-6">{heading}</h2>
            <div className="space-y-4 text-muted-2 leading-relaxed text-base">
              <p>{p1}</p>
              <p>{p2}</p>
              <p>{p3}</p>
            </div>
            <div className="mt-8">
              <Link href="/about" className="btn-outline text-sm">
                {t('cta')} <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {traits.map((trait) => (
              <div key={trait.label} className="card">
                <p className="text-fg font-medium text-sm mb-1">{trait.label}</p>
                <p className="text-muted text-sm">{trait.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
