'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const traits = [
  { label: 'Discovery first', desc: 'I always start with the problem, not the solution.' },
  { label: 'Delivery focused', desc: 'Strategy without execution is just a presentation.' },
  { label: 'Data-informed', desc: 'Opinions are useful; numbers are better.' },
  { label: 'Clear communicator', desc: 'Engineering and exec should hear the same thing.' },
]

export default function AboutSection() {
  return (
    <section className="section border-t border-border">
      <div className="container-main">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label">About</span>
            <h2 className="display-md text-fg mb-6">
              PM who&apos;s actually been in the room
            </h2>
            <div className="space-y-4 text-muted-2 leading-relaxed text-base">
              <p>
                Started as a product designer, crossed over into PM when I realised I spent
                more time arguing about what to build than designing how it should look.
                That was 7 years ago.
              </p>
              <p>
                Since then I&apos;ve shipped checkout systems, marketplace platforms, mobile
                apps and internal tools — mostly in e-commerce and fintech, always in fast-moving teams.
              </p>
              <p>
                I&apos;m based in Baku but work fully remotely across CET and GMT+4.
              </p>
            </div>
            <div className="mt-8">
              <Link href="/about" className="btn-outline text-sm">
                More about me <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

          {/* Traits */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {traits.map((t) => (
              <div key={t.label} className="card">
                <p className="text-fg font-medium text-sm mb-1">{t.label}</p>
                <p className="text-muted text-sm">{t.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
