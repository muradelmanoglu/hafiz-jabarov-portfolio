'use client'

import Link from 'next/link'
import { ArrowRight, CalendarDays } from 'lucide-react'
import { motion } from 'framer-motion'

const stats = [
  { value: '7+', label: 'Years PM experience' },
  { value: '30+', label: 'Products shipped' },
  { value: '$50M+', label: 'Revenue influenced' },
  { value: '15+', label: 'Teams led' },
]

export default function HeroSection() {
  return (
    <section className="section min-h-screen flex flex-col justify-center pt-20 md:pt-28">
      <div className="container-main">
        {/* Availability badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-8"
        >
          <span className="dot-available" />
          <span className="text-sm text-muted-2">Available for new engagements</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="display-xl text-fg mb-6 max-w-4xl"
        >
          I turn complex{' '}
          <em className="not-italic" style={{ color: 'var(--accent)' }}>
            problems
          </em>{' '}
          into shipped products
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-2 max-w-xl mb-10 leading-relaxed"
        >
          Senior PM with 7+ years delivering e-commerce, SaaS and fintech products
          from 0→1 and 1→scale.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap gap-4 mb-20"
        >
          <Link href="/work" className="btn-accent">
            View my work <ArrowRight size={16} />
          </Link>
          <a
            href="https://calendly.com/hafizjabarov"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            <CalendarDays size={16} />
            Book a call
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-border"
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="heading-serif text-3xl md:text-4xl text-fg mb-1">{stat.value}</p>
              <p className="text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
