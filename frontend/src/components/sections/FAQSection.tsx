'use client'

import { useEffect, useState } from 'react'
import { publicApi, type FAQ } from '@/lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

export default function FAQSection({ page }: { page?: 'HOME' | 'SERVICES' | 'CONTACT' }) {
  const [faqs, setFAQs] = useState<FAQ[]>([])
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    publicApi.getFAQs(page).then((res) => {
      if (res.data.data) setFAQs(res.data.data)
    })
  }, [page])

  if (faqs.length === 0) return null

  return (
    <section className="section border-t border-border">
      <div className="container-main max-w-3xl">
        <div className="mb-12">
          <span className="section-label">FAQ</span>
          <h2 className="display-md text-fg">Common questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="card overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between gap-4 text-left"
              >
                <span className="text-fg font-medium text-sm">{faq.question}</span>
                {open === faq.id ? (
                  <Minus size={16} className="text-muted shrink-0" />
                ) : (
                  <Plus size={16} className="text-muted shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {open === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="text-muted-2 text-sm leading-relaxed pt-4 border-t border-border mt-4">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
