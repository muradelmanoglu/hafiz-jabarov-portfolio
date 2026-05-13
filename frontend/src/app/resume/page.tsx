'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { publicApi, type Experience, type Education, type Skill } from '@/lib/api'
import Link from 'next/link'
import { Download, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

function fmtPeriod(start: string, end?: string, current?: boolean) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  return `${fmt(start)} — ${current ? 'Present' : end ? fmt(end) : ''}`
}

const categoryLabels: Record<string, string> = {
  PROJECT_MANAGEMENT: 'Project Management',
  DOCUMENTATION: 'Documentation',
  ANALYTICS: 'Analytics',
  DESIGN: 'Design',
  SEO: 'SEO',
  TOOLS: 'Tools',
  OTHER: 'Other',
}

export default function ResumePage() {
  const [experience, setExperience] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [skills, setSkills] = useState<Skill[]>([])

  useEffect(() => {
    Promise.all([
      publicApi.getExperience(),
      publicApi.getEducation(),
      publicApi.getSkills(),
    ]).then(([expRes, eduRes, skillRes]) => {
      if (expRes.data.data) setExperience(expRes.data.data)
      if (eduRes.data.data) setEducation(eduRes.data.data)
      if (skillRes.data.data) setSkills(skillRes.data.data)
    })
  }, [])

  const skillsByCategory = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})

  return (
    <>
      <Navbar />
      <main className="pt-24 md:pt-32 pb-32">
        <div className="container-main max-w-3xl">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-16">
            <div>
              <span className="section-label">Resume</span>
              <h1 className="display-lg text-fg">Hafiz Jabarov</h1>
              <p className="text-muted-2 mt-1">Senior Project Manager</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <a
                href="/api/public/settings"
                className="btn-outline text-sm"
                download
              >
                <Download size={14} /> PDF
              </a>
              <Link href="/contact" className="btn-accent text-sm">
                Hire me <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Experience */}
          {experience.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <h2 className="text-fg font-semibold text-sm uppercase tracking-widest font-mono mb-6 pb-3 border-b border-border" style={{ color: 'var(--accent)' }}>
                Experience
              </h2>
              <div className="space-y-8">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 mb-2">
                      <div>
                        <h3 className="text-fg font-semibold">{exp.role}</h3>
                        <p className="text-muted-2 text-sm">{exp.companyName}</p>
                      </div>
                      <p className="text-muted text-xs font-mono shrink-0">
                        {fmtPeriod(exp.startDate, exp.endDate, exp.current)}
                      </p>
                    </div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="space-y-1 mt-2">
                        {exp.bullets.map((b, i) => (
                          <li key={i} className="text-muted-2 text-sm flex items-start gap-2">
                            <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <h2 className="text-fg font-semibold text-sm uppercase tracking-widest font-mono mb-6 pb-3 border-b border-border" style={{ color: 'var(--accent)' }}>
                Education
              </h2>
              <div className="space-y-6">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                      <div>
                        <h3 className="text-fg font-semibold">{edu.program}</h3>
                        <p className="text-muted-2 text-sm">{edu.institution}</p>
                      </div>
                      <p className="text-muted text-xs font-mono shrink-0">
                        {fmtPeriod(edu.startDate, edu.endDate)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Skills */}
          {Object.keys(skillsByCategory).length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-fg font-semibold text-sm uppercase tracking-widest font-mono mb-6 pb-3 border-b border-border" style={{ color: 'var(--accent)' }}>
                Skills & Tools
              </h2>
              <div className="space-y-4">
                {Object.entries(skillsByCategory).map(([cat, catSkills]) => (
                  <div key={cat} className="flex gap-4">
                    <p className="text-muted text-xs w-36 shrink-0 pt-0.5">
                      {categoryLabels[cat] || cat}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {catSkills.map((s) => (
                        <span key={s.id} className="tag text-xs">{s.name}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
