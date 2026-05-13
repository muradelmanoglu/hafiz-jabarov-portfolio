'use client'

import { useEffect, useState } from 'react'
import { publicApi, type Testimonial } from '@/lib/api'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

export default function TestimonialsSection() {
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
          <span className="section-label">Testimonials</span>
          <h2 className="display-md text-fg">What clients say</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.slice(0, 4).map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card"
            >
              <Quote size={20} className="mb-4" style={{ color: 'var(--accent)' }} />
              <p className="text-fg-2 text-sm leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
              <div>
                <p className="text-fg font-medium text-sm">{t.authorName}</p>
                <p className="text-muted text-xs">
                  {t.authorTitle}
                  {t.authorCompany && `, ${t.authorCompany}`}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
