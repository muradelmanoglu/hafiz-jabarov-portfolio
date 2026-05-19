'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/navigation'
import { ArrowLeft, ExternalLink, Users, Calendar } from 'lucide-react'
import type { CaseStudy } from '@/lib/api'

function formatDate(d: string, locale: string) {
  const localeMap: Record<string, string> = { en: 'en-US', az: 'az-Latn-AZ', ru: 'ru-RU' }
  return new Date(d).toLocaleDateString(localeMap[locale] || 'en-US', { month: 'short', year: 'numeric' })
}

export default function CaseStudyClient({ cs, locale }: { cs: CaseStudy; locale: string }) {
  const t = useTranslations('work')

  const sectionLabels: Record<string, string> = {
    problem: t('sections.problem'),
    myRole: t('sections.myRole'),
    approach: t('sections.approach'),
    outcome: t('sections.outcome'),
    reflection: t('sections.reflection'),
  }

  return (
    <main className="pt-24 md:pt-32 pb-32">
      <div className="container-main max-w-3xl">
        <Link href="/work" className="btn-ghost text-sm mb-8 inline-flex pl-0">
          <ArrowLeft size={14} /> {t('backToWork')}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-2 mb-4">
            {cs.domain && <span className="tag">{cs.domain}</span>}
            {cs.tags?.map((tag) => <span key={tag} className="tag">{tag}</span>)}
          </div>

          <h1 className="display-lg text-fg mb-4">{cs.title}</h1>
          <p className="text-muted-2 text-lg leading-relaxed">{cs.summary}</p>

          <div className="flex flex-wrap gap-6 mt-6 text-sm text-muted">
            {cs.company && <span>{cs.company.name}</span>}
            <span className="flex items-center gap-1">
              <Calendar size={13} />
              {formatDate(cs.startDate, locale)}{cs.endDate ? ` — ${formatDate(cs.endDate, locale)}` : ` — ${t('present')}`}
            </span>
            {cs.teamSize && (
              <span className="flex items-center gap-1"><Users size={13} /> {cs.teamSize} {t('people')}</span>
            )}
            {cs.role && <span className="text-fg-2">{cs.role}</span>}
            {cs.externalUrl && (
              <a href={cs.externalUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-accent hover:underline">
                <ExternalLink size={13} /> {t('viewProject')}
              </a>
            )}
          </div>
        </motion.div>

        {cs.outcomeMetrics && cs.outcomeMetrics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {cs.outcomeMetrics.map((m) => (
              <div key={m.label} className="card text-center py-4">
                <p className="heading-serif text-2xl font-bold mb-1" style={{ color: 'var(--accent)' }}>
                  {m.value}
                </p>
                <p className="text-muted text-xs">{m.label}</p>
              </div>
            ))}
          </motion.div>
        )}

        {[
          { key: 'problem', content: cs.problem },
          { key: 'myRole', content: cs.myRole },
          { key: 'approach', content: cs.approach },
          { key: 'outcome', content: cs.outcome },
          { key: 'reflection', content: cs.reflection },
        ].filter((s) => s.content).map((section, i) => (
          <motion.section
            key={section.key}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="mb-10"
          >
            <h2 className="text-fg font-semibold text-base mb-3">{sectionLabels[section.key]}</h2>
            <p className="text-muted-2 leading-relaxed whitespace-pre-line">{section.content}</p>
          </motion.section>
        ))}

        {cs.tools && cs.tools.length > 0 && (
          <div className="border-t border-border pt-8 mt-8">
            <p className="text-sm text-muted mb-3">{t('toolsUsed')}</p>
            <div className="flex flex-wrap gap-2">
              {cs.tools.map((tool) => <span key={tool} className="tag">{tool}</span>)}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
