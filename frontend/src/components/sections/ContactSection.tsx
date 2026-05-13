'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { publicApi, type ContactFormData } from '@/lib/api'
import { Send, CheckCircle, CalendarDays } from 'lucide-react'
import { motion } from 'framer-motion'

const PROJECT_TYPES = [
  { value: 'FRACTIONAL_PM', label: 'Fractional PM' },
  { value: 'ECOMMERCE_DELIVERY', label: 'E-Commerce Delivery' },
  { value: 'DELIVERY_AUDIT', label: 'Delivery Audit' },
  { value: 'DESIGN_COACHING', label: 'Design Coaching' },
  { value: 'TEAM_SETUP', label: 'Team Setup' },
  { value: 'OTHER', label: 'Other' },
]

const BUDGET_RANGES = [
  { value: 'UNDER_2K', label: 'Under $2,000' },
  { value: 'TWO_TO_FIVE_K', label: '$2,000 – $5,000' },
  { value: 'FIVE_TO_TEN_K', label: '$5,000 – $10,000' },
  { value: 'OVER_TEN_K', label: '$10,000+' },
  { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
]

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
  company: z.string().max(100).optional(),
  projectType: z.string().min(1, 'Please select a project type'),
  budgetRange: z.string().optional(),
  message: z.string().min(20, 'Message must be at least 20 characters').max(1000),
})

type FormData = z.infer<typeof schema>

export default function ContactSection() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      setError('Something went wrong. Please try again or email me directly.')
    }
  }

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
            <span className="section-label">Contact</span>
            <h2 className="display-md text-fg mb-6">Let&apos;s work together</h2>
            <p className="text-muted-2 leading-relaxed mb-8">
              If you have a product challenge, a team that needs structure, or just want to explore
              whether I&apos;m a fit — I&apos;d love to hear from you.
            </p>
            <a
              href="https://calendly.com/hafizjabarov"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline inline-flex"
            >
              <CalendarDays size={16} />
              Book a free 30-min call
            </a>
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
                <h3 className="text-fg text-xl font-semibold mb-2">Message sent!</h3>
                <p className="text-muted text-sm mb-6">I&apos;ll get back to you within 1 business day.</p>
                <button onClick={() => setSent(false)} className="btn-outline text-sm">
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-2 mb-1.5">Name *</label>
                    <input {...register('name')} className="input-field" placeholder="Your name" />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-muted-2 mb-1.5">Email *</label>
                    <input {...register('email')} type="email" className="input-field" placeholder="you@company.com" />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-muted-2 mb-1.5">Company</label>
                  <input {...register('company')} className="input-field" placeholder="Optional" />
                </div>

                <div>
                  <label className="block text-sm text-muted-2 mb-1.5">Project type *</label>
                  <select {...register('projectType')} className="input-field">
                    <option value="">Select...</option>
                    {PROJECT_TYPES.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                  {errors.projectType && <p className="text-red-400 text-xs mt-1">{errors.projectType.message}</p>}
                </div>

                <div>
                  <label className="block text-sm text-muted-2 mb-1.5">Budget range</label>
                  <select {...register('budgetRange')} className="input-field">
                    <option value="">Prefer not to say</option>
                    {BUDGET_RANGES.map((b) => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-muted-2 mb-1.5">Message *</label>
                  <textarea
                    {...register('message')}
                    className="textarea-field"
                    placeholder="Tell me about the challenge you're trying to solve..."
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
                  {isSubmitting ? 'Sending...' : 'Send message'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
