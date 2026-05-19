'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { publicApi, type ContactFormData, type SiteSettings, type SocialLink } from '@/lib/api'
import { Send, CheckCircle, CalendarDays, Linkedin, Github, Twitter, Instagram, Mail, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

type FormData = {
  name: string
  email: string
  company?: string
  projectType: string
  budgetRange?: string
  message: string
}

function detectIcon(label: string, url: string) {
  const l = label.toLowerCase()
  const u = url.toLowerCase()
  if (l.includes('linkedin') || u.includes('linkedin')) return Linkedin
  if (l.includes('github') || u.includes('github')) return Github
  if (l.includes('twitter') || l.includes(' x') || u.includes('twitter') || u.includes('x.com')) return Twitter
  if (l.includes('instagram') || u.includes('instagram')) return Instagram
  if (l.includes('calendly') || u.includes('calendly')) return CalendarDays
  return ExternalLink
}

export default function ContactSection() {
  const t = useTranslations('contact')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [settings, setSettings] = useState<Partial<SiteSettings>>({})

  useEffect(() => {
    publicApi.getSettings().then((res) => {
      if (res.data.data) setSettings(res.data.data)
    }).catch(() => {})
  }, [])

  const calendlyUrl = settings.calendly || 'https://calendly.com/hafizjabarov'

  const schema = z.object({
    name: z.string().min(2, t('validation.nameMin')).max(100),
    email: z.string().email(t('validation.emailInvalid')),
    company: z.string().max(100).optional(),
    projectType: z.string().min(1, t('validation.projectTypeRequired')),
    budgetRange: z.string().optional(),
    message: z.string().min(20, t('validation.messageMin')).max(1000),
  })

  const PROJECT_TYPES = [
    { value: 'FRACTIONAL_PM', label: t('projectTypes.FRACTIONAL_PM') },
    { value: 'ECOMMERCE_DELIVERY', label: t('projectTypes.ECOMMERCE_DELIVERY') },
    { value: 'DELIVERY_AUDIT', label: t('projectTypes.DELIVERY_AUDIT') },
    { value: 'DESIGN_COACHING', label: t('projectTypes.DESIGN_COACHING') },
    { value: 'TEAM_SETUP', label: t('projectTypes.TEAM_SETUP') },
    { value: 'OTHER', label: t('projectTypes.OTHER') },
  ]

  const BUDGET_RANGES = [
    { value: 'UNDER_1K', label: t('budgetRanges.UNDER_1K') },
    { value: 'FROM_1K_TO_5K', label: t('budgetRanges.FROM_1K_TO_5K') },
    { value: 'FROM_5K_TO_10K', label: t('budgetRanges.FROM_5K_TO_10K') },
    { value: 'FROM_10K_TO_25K', label: t('budgetRanges.FROM_10K_TO_25K') },
    { value: 'ABOVE_25K', label: t('budgetRanges.ABOVE_25K') },
  ]

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setError(null)
    try {
      await publicApi.submitContact(data as ContactFormData)
      setSent(true)
      reset()
    } catch {
      setError(t('form.errorGeneric'))
    }
  }

  // Build social links list (predefined + custom)
  const predefinedLinks: { url: string; icon: typeof Linkedin; label: string }[] = [
    { url: settings.linkedIn || '', icon: Linkedin, label: 'LinkedIn' },
    { url: settings.github || '', icon: Github, label: 'GitHub' },
    { url: settings.twitter || '', icon: Twitter, label: 'Twitter' },
    { url: settings.instagram || '', icon: Instagram, label: 'Instagram' },
    { url: settings.email ? `mailto:${settings.email}` : '', icon: Mail, label: 'Email' },
  ].filter((s) => !!s.url)

  const customLinks: SocialLink[] = (() => {
    try { return JSON.parse(settings.customSocialLinksJson || '[]') } catch { return [] }
  })()

  const allSocialLinks = [
    ...predefinedLinks,
    ...customLinks.filter((c) => !!c.url).map((c) => ({
      url: c.url,
      icon: detectIcon(c.label, c.url),
      label: c.label,
    })),
  ]

  return (
    <section className="section border-t border-border">
      <div className="container-main">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-label">{t('label')}</span>
            <h2 className="display-md text-fg mb-6">{t('heading')}</h2>
            <p className="text-muted-2 leading-relaxed mb-8">{t('desc')}</p>
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline inline-flex"
            >
              <CalendarDays size={16} />
              {t('bookCall')}
            </a>

            {/* Social links */}
            {allSocialLinks.length > 0 && (
              <div className="flex items-center gap-4 mt-6">
                {allSocialLinks.map(({ url, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={url}
                    target={url.startsWith('mailto:') ? undefined : '_blank'}
                    rel={url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                    className="text-muted hover:text-fg transition-colors"
                    aria-label={label}
                    title={label}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {sent ? (
              <div className="card text-center py-12">
                <CheckCircle size={40} className="mx-auto mb-4" style={{ color: 'var(--accent)' }} />
                <h3 className="text-fg text-xl font-semibold mb-2">{t('form.successTitle')}</h3>
                <p className="text-muted text-sm mb-6">{t('form.successDesc')}</p>
                <button onClick={() => setSent(false)} className="btn-outline text-sm">
                  {t('form.sendAnother')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-2 mb-1.5">{t('form.name')} *</label>
                    <input {...register('name')} className="input-field" placeholder={t('form.namePlaceholder')} />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-muted-2 mb-1.5">{t('form.email')} *</label>
                    <input {...register('email')} type="email" className="input-field" placeholder={t('form.emailPlaceholder')} />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-muted-2 mb-1.5">{t('form.company')}</label>
                  <input {...register('company')} className="input-field" placeholder={t('form.companyPlaceholder')} />
                </div>

                <div>
                  <label className="block text-sm text-muted-2 mb-1.5">{t('form.projectType')} *</label>
                  <select {...register('projectType')} className="input-field">
                    <option value="">{t('form.projectTypePlaceholder')}</option>
                    {PROJECT_TYPES.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                  {errors.projectType && <p className="text-red-400 text-xs mt-1">{errors.projectType.message}</p>}
                </div>

                <div>
                  <label className="block text-sm text-muted-2 mb-1.5">{t('form.budgetRange')}</label>
                  <select {...register('budgetRange')} className="input-field">
                    <option value="">{t('form.budgetDefault')}</option>
                    {BUDGET_RANGES.map((b) => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-muted-2 mb-1.5">{t('form.message')} *</label>
                  <textarea
                    {...register('message')}
                    className="textarea-field"
                    placeholder={t('form.messagePlaceholder')}
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                </div>

                {error && (
                  <p className="text-red-400 text-sm rounded-xl px-4 py-3" style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}>
                    {error}
                  </p>
                )}

                <button type="submit" disabled={isSubmitting} className="btn-accent w-full justify-center">
                  <Send size={15} />
                  {isSubmitting ? t('form.sending') : t('form.send')}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
