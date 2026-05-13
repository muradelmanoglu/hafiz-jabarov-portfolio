'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FAQSection from '@/components/sections/FAQSection'
import { publicApi, type PortfolioService } from '@/lib/api'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CalendarDays } from 'lucide-react'

export default function ServicesPage() {
  const [services, setServices] = useState<PortfolioService[]>([])

  useEffect(() => {
    publicApi.getServices().then((res) => {
      if (res.data.data) setServices(res.data.data)
    })
  }, [])

  return (
    <>
      <Navbar />
      <main className="pt-24 md:pt-32">
        <div className="container-main">
          {/* Header */}
          <div className="mb-20">
            <span className="section-label">Services</span>
            <h1 className="display-lg text-fg mb-4">How I can help</h1>
            <p className="text-muted-2 max-w-lg">
              Focused engagements designed for startups and scale-ups that need senior PM
              capacity without the overhead.
            </p>
          </div>

          {/* Services */}
          <div className="space-y-6 mb-32">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="card"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h2 className="text-fg font-semibold text-lg mb-2">{service.title}</h2>
                    <p className="text-muted-2 text-sm leading-relaxed mb-4">{service.longDescription}</p>

                    {service.deliverables && service.deliverables.length > 0 && (
                      <div>
                        <p className="text-muted text-xs uppercase tracking-widest mb-2 font-mono">Deliverables</p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                          {service.deliverables.map((d) => (
                            <li key={d} className="text-muted-2 text-sm flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="md:w-56 shrink-0 flex flex-col gap-3">
                    <div className="card" style={{ backgroundColor: 'var(--surface-2)' }}>
                      <p className="text-muted text-xs mb-0.5">Duration</p>
                      <p className="text-fg-2 text-sm font-medium">{service.engagementDuration}</p>
                    </div>
                    {service.startingRate && service.startingRateVisible && (
                      <div className="card" style={{ backgroundColor: 'var(--surface-2)' }}>
                        <p className="text-muted text-xs mb-0.5">Starting from</p>
                        <p className="text-fg-2 text-sm font-medium">{service.startingRate}</p>
                      </div>
                    )}
                    <Link href="/contact" className="btn-accent justify-center text-sm">
                      {service.ctaText}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <FAQSection page="SERVICES" />

        {/* CTA */}
        <section className="section border-t border-border">
          <div className="container-main text-center">
            <h2 className="display-md text-fg mb-4">Not sure which service fits?</h2>
            <p className="text-muted-2 mb-8 max-w-md mx-auto">
              Book a free 30-minute call. We&apos;ll figure out the right engagement together.
            </p>
            <a
              href="https://calendly.com/hafizjabarov"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent inline-flex"
            >
              <CalendarDays size={16} />
              Book a free call
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
