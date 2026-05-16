'use client'

import { useEffect, useState } from 'react'
import { publicApi, type Experience } from '@/lib/api'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'

export default function ExperienceSection() {
  const t = useTranslations('experience')
  const locale = useLocale()
  const [experiences, setExperiences] = useState<Experience[]>([])

  useEffect(() => {
    publicApi.getExperience().then((res) => {
      if (res.data.data) setExperiences(res.data.data)
    })
  }, [])

  const localeMap: Record<string, string> = { en: 'en-US', az: 'az-Latn-AZ', ru: 'ru-RU' }

  function formatPeriod(startDate: string, endDate?: string, current?: boolean): string {
    const fmt = (d: string) => {
      const [year, month] = d.split('-')
      return new Date(Number(year), Number(month) - 1).toLocaleDateString(
        localeMap[locale] || 'en-US',
        { month: 'short', year: 'numeric' }
      )
    }
    return `${fmt(startDate)} — ${current ? t('present') : endDate ? fmt(endDate) : ''}`
  }

  return (
    <section className="section border-t border-border">
      <div className="container-main">
        <div className="mb-12">
          <span className="section-label">{t('label')}</span>
          <h2 className="display-md text-fg">{t('heading')}</h2>
        </div>

        <div className="space-y-8 max-w-3xl">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="flex gap-6"
            >
              <div className="flex flex-col items-center">
                <div
                  className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: exp.current ? 'var(--accent)' : 'var(--border-2)' }}
                />
                {i < experiences.length - 1 && (
                  <div className="w-px flex-1 mt-2" style={{ backgroundColor: 'var(--border)' }} />
                )}
              </div>

              <div className="pb-8">
                <p className="text-muted text-xs mb-1 font-mono">
                  {formatPeriod(exp.startDate, exp.endDate, exp.current)}
                </p>
                <h3 className="text-fg font-semibold text-base">{exp.role}</h3>
                <p className="text-accent text-sm mb-3">{exp.companyName}</p>
                {exp.summary && (
                  <p className="text-muted-2 text-sm leading-relaxed mb-3">{exp.summary}</p>
                )}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="space-y-1">
                    {exp.bullets.map((b, bi) => (
                      <li key={bi} className="text-muted text-sm flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
