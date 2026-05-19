'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, ChevronDown, ChevronUp, CheckCircle, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { publicApi } from '@/lib/api'
import type { Testimonial } from '@/lib/api'

export default function TestimonialsSection({ testimonials = [] }: { testimonials?: Testimonial[] }) {
  const t = useTranslations('testimonials')
  const [showForm, setShowForm] = useState(false)
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [form, setForm] = useState({ quote: '', authorName: '', authorTitle: '', authorCompany: '', linkedIn: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (form.quote.trim().length < 20) e.quote = t('form.quoteMin')
    if (!form.authorName.trim()) e.authorName = t('form.nameRequired')
    if (!form.authorTitle.trim()) e.authorTitle = t('form.titleRequired')
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)
    setFormError(null)
    try {
      await publicApi.submitTestimonial({
        quote: form.quote.trim(),
        authorName: form.authorName.trim(),
        authorTitle: form.authorTitle.trim(),
        authorCompany: form.authorCompany.trim() || undefined,
        linkedIn: form.linkedIn.trim() || undefined,
      })
      setSent(true)
    } catch {
      setFormError(t('form.error'))
    } finally {
      setSubmitting(false)
    }
  }

  if (testimonials.length === 0) return null

  return (
    <section className="section border-t border-border">
      <div className="container-main">
        <div className="mb-12">
          <span className="section-label">{t('label')}</span>
          <h2 className="display-md text-fg">{t('heading')}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.slice(0, 4).map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card"
            >
              <Quote size={20} className="mb-4" style={{ color: 'var(--accent)' }} />
              <p className="text-fg-2 text-sm leading-relaxed mb-6 italic">&ldquo;{testimonial.quote}&rdquo;</p>
              <div>
                <p className="text-fg font-medium text-sm">{testimonial.authorName}</p>
                <p className="text-muted text-xs">
                  {testimonial.authorTitle}
                  {testimonial.authorCompany && `, ${testimonial.authorCompany}`}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Submit review */}
        <div className="mt-12 border-t border-border pt-8">
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 text-sm text-muted hover:text-fg transition-colors"
          >
            {showForm ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            {t('form.toggle')}
          </button>

          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-6 max-w-xl">
                  {sent ? (
                    <div className="card text-center py-10">
                      <CheckCircle size={36} className="mx-auto mb-3" style={{ color: 'var(--accent)' }} />
                      <h3 className="text-fg font-semibold mb-1">{t('form.successTitle')}</h3>
                      <p className="text-muted text-sm">{t('form.successDesc')}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm text-muted-2 mb-1.5">{t('form.quote')} *</label>
                        <textarea
                          value={form.quote}
                          onChange={(e) => setForm({ ...form, quote: e.target.value })}
                          className="textarea-field"
                          placeholder={t('form.quotePlaceholder')}
                          rows={4}
                        />
                        {errors.quote && <p className="text-red-400 text-xs mt-1">{errors.quote}</p>}
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-muted-2 mb-1.5">{t('form.name')} *</label>
                          <input
                            value={form.authorName}
                            onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                            className="input-field"
                            placeholder={t('form.namePlaceholder')}
                          />
                          {errors.authorName && <p className="text-red-400 text-xs mt-1">{errors.authorName}</p>}
                        </div>
                        <div>
                          <label className="block text-sm text-muted-2 mb-1.5">{t('form.title')} *</label>
                          <input
                            value={form.authorTitle}
                            onChange={(e) => setForm({ ...form, authorTitle: e.target.value })}
                            className="input-field"
                            placeholder={t('form.titlePlaceholder')}
                          />
                          {errors.authorTitle && <p className="text-red-400 text-xs mt-1">{errors.authorTitle}</p>}
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-muted-2 mb-1.5">{t('form.company')}</label>
                          <input
                            value={form.authorCompany}
                            onChange={(e) => setForm({ ...form, authorCompany: e.target.value })}
                            className="input-field"
                            placeholder={t('form.companyPlaceholder')}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-muted-2 mb-1.5">{t('form.linkedIn')}</label>
                          <input
                            value={form.linkedIn}
                            onChange={(e) => setForm({ ...form, linkedIn: e.target.value })}
                            className="input-field"
                            placeholder="https://linkedin.com/in/..."
                          />
                        </div>
                      </div>
                      {formError && (
                        <p className="text-red-400 text-sm rounded-xl px-4 py-3" style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}>
                          {formError}
                        </p>
                      )}
                      <button type="submit" disabled={submitting} className="btn-accent inline-flex">
                        <Send size={14} />
                        {submitting ? t('form.sending') : t('form.submit')}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
