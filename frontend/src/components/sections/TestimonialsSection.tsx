'use client'

import { useEffect, useState } from 'react'
import { publicApi, type Testimonial } from '@/lib/api'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function TestimonialsSection() {
  const t = useTranslations('testimonials')
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    publicApi.getTestimonials().then((res) => {
      if (res.data.data) setTestimonials(res.data.data)
    })
  }, [])

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
      </div>
    </section>
  )
}
