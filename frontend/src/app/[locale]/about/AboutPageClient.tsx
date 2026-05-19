'use client'

import { ArrowRight, Linkedin, Mail, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/navigation'
import type { Experience, Education, Skill } from '@/lib/api'

function fmtPeriod(start: string, end?: string, current?: boolean, locale?: string, presentText?: string) {
  const localeMap: Record<string, string> = { en: 'en-US', az: 'az-Latn-AZ', ru: 'ru-RU' }
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(localeMap[locale || 'en'] || 'en-US', { month: 'short', year: 'numeric' })
  return `${fmt(start)} — ${current ? (presentText || 'Present') : end ? fmt(end) : ''}`
}

interface Props {
  heading: string
  p1: string
  p2: string
  p3: string
  resumeUrl?: string
  linkedIn?: string
  email?: string
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  locale: string
}

export default function AboutPageClient({
  heading, p1, p2, p3, resumeUrl, linkedIn, email,
  experience, education, skills, locale,
}: Props) {
  const t = useTranslations('aboutPage')
  const tExp = useTranslations('experience')
  const presentText = tExp('present')

  const linkedInUrl = linkedIn || 'https://linkedin.com/in/hafizjabarov'
  const emailAddr = email || 'jabarovhafiz@gmail.com'

  return (
    <main className="pt-24 md:pt-32 pb-32">
      <div className="container-main max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <span className="section-label">{t('label')}</span>
          <h1 className="display-lg text-fg mb-6">{heading}</h1>
          <p className="text-lg text-muted-2 leading-relaxed mb-4">{p1}</p>
          <p className="text-muted-2 leading-relaxed mb-4">{p2}</p>
          <p className="text-muted-2 leading-relaxed mb-8">{p3}</p>
          <div className="flex flex-wrap gap-3">
            <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm">
              <Linkedin size={15} /> LinkedIn
            </a>
            <a href={`mailto:${emailAddr}`} className="btn-outline text-sm">
              <Mail size={15} /> Email
            </a>
            {resumeUrl && (
              <a
                href={resumeUrl}
                download={resumeUrl.startsWith('data:') ? 'CV.pdf' : undefined}
                target={resumeUrl.startsWith('data:') ? undefined : '_blank'}
                rel={resumeUrl.startsWith('data:') ? undefined : 'noopener noreferrer'}
                className="btn-outline text-sm"
              >
                <Download size={15} /> {t('downloadCv')}
              </a>
            )}
            <Link href="/contact" className="btn-accent text-sm">
              {t('letsWork')} <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {experience.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-20"
          >
            <h2 className="text-fg font-semibold text-xl mb-8 border-b border-border pb-4">{t('experience')}</h2>
            <div className="space-y-8">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 mb-2">
                    <div>
                      <h3 className="text-fg font-medium">{exp.role}</h3>
                      <p className="text-sm" style={{ color: 'var(--accent)' }}>{exp.companyName}</p>
                    </div>
                    <p className="text-muted text-xs font-mono shrink-0">
                      {fmtPeriod(exp.startDate, exp.endDate, exp.current, locale, presentText)}
                    </p>
                  </div>
                  {exp.summary && <p className="text-muted-2 text-sm mb-2">{exp.summary}</p>}
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="space-y-1">
                      {exp.bullets.map((b, i) => (
                        <li key={i} className="text-muted text-sm flex items-start gap-2">
                          <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {education.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-20"
          >
            <h2 className="text-fg font-semibold text-xl mb-8 border-b border-border pb-4">{t('education')}</h2>
            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 mb-1">
                    <div>
                      <h3 className="text-fg font-medium">{edu.program}</h3>
                      <p className="text-muted-2 text-sm">{edu.institution}</p>
                    </div>
                    <p className="text-muted text-xs font-mono shrink-0">
                      {fmtPeriod(edu.startDate, edu.endDate, false, locale)}
                    </p>
                  </div>
                  {edu.bullets && edu.bullets.length > 0 && (
                    <ul className="mt-2 space-y-0.5">
                      {edu.bullets.map((b, i) => (
                        <li key={i} className="text-muted text-sm flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: 'var(--border-2)' }} />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {skills.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-fg font-semibold text-xl mb-8 border-b border-border pb-4">{t('skills')}</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s.id} className="tag">{s.name}</span>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </main>
  )
}
