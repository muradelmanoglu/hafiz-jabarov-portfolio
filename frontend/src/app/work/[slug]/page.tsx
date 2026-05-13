'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { publicApi, type CaseStudy } from '@/lib/api'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Users, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>()
  const [cs, setCs] = useState<CaseStudy | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    publicApi.getCaseStudy(slug).then((res) => {
      if (res.data.data) setCs(res.data.data)
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container-main pt-32 pb-20 text-center text-muted">Loading...</div>
        <Footer />
      </>
    )
  }

  if (!cs) {
    return (
      <>
        <Navbar />
        <div className="container-main pt-32 pb-20 text-center">
          <p className="text-muted mb-4">Case study not found.</p>
          <Link href="/work" className="btn-outline text-sm">← Back to work</Link>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 md:pt-32 pb-32">
        <div className="container-main max-w-3xl">
          {/* Back */}
          <Link href="/work" className="btn-ghost text-sm mb-8 inline-flex pl-0">
            <ArrowLeft size={14} /> Back to work
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {cs.domain && <span className="tag">{cs.domain}</span>}
              {cs.tags?.map((t) => <span key={t} className="tag">{t}</span>)}
            </div>

            <h1 className="display-lg text-fg mb-4">{cs.title}</h1>
            <p className="text-muted-2 text-lg leading-relaxed">{cs.summary}</p>

            {/* Meta */}
            <div className="flex flex-wrap gap-6 mt-6 text-sm text-muted">
              {cs.company && <span>{cs.company.name}</span>}
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                {formatDate(cs.startDate)}{cs.endDate ? ` — ${formatDate(cs.endDate)}` : ' — Present'}
              </span>
              {cs.teamSize && (
                <span className="flex items-center gap-1"><Users size={13} /> {cs.teamSize} people</span>
              )}
              {cs.role && <span className="text-fg-2">{cs.role}</span>}
              {cs.externalUrl && (
                <a href={cs.externalUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-accent hover:underline">
                  <ExternalLink size={13} /> View project
                </a>
              )}
            </div>
          </motion.div>

          {/* Metrics */}
          {cs.outcomeMetrics && cs.outcomeMetrics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            >
              {cs.outcomeMetrics.map((m) => (
                <div key={m.label} className="card text-center py-4">
                  <p className="heading-serif text-2xl font-bold mb-1" style={{ color: 'var(--accent)' }}>
                    {m.value}
                  </p>
                  <p className="text-muted text-xs">{m.label}</p>
                </div>
              ))}
            </motion.div>
          )}

          {/* Body sections */}
          {[
            { label: 'The problem', content: cs.problem },
            { label: 'My role', content: cs.myRole },
            { label: 'Approach', content: cs.approach },
            { label: 'Outcome', content: cs.outcome },
            { label: 'Reflection', content: cs.reflection },
          ].filter((s) => s.content).map((section, i) => (
            <motion.section
              key={section.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="mb-10"
            >
              <h2 className="text-fg font-semibold text-base mb-3">{section.label}</h2>
              <p className="text-muted-2 leading-relaxed whitespace-pre-line">{section.content}</p>
            </motion.section>
          ))}

          {/* Tools */}
          {cs.tools && cs.tools.length > 0 && (
            <div className="border-t border-border pt-8 mt-8">
              <p className="text-sm text-muted mb-3">Tools used</p>
              <div className="flex flex-wrap gap-2">
                {cs.tools.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
