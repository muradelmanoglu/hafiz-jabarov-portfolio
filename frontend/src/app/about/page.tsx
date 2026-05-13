'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { publicApi, type Experience, type Education, type Skill } from '@/lib/api'
import Link from 'next/link'
import { ArrowRight, Linkedin, Mail } from 'lucide-react'
import { motion } from 'framer-motion'

function fmtPeriod(start: string, end?: string, current?: boolean) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  return `${fmt(start)} — ${current ? 'Present' : end ? fmt(end) : ''}`
}

export default function AboutPage() {
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

  return (
    <>
      <Navbar />
      <main className="pt-24 md:pt-32 pb-32">
        <div className="container-main max-w-3xl">
          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-20"
          >
            <span className="section-label">About</span>
            <h1 className="display-lg text-fg mb-6">Hafiz Jabarov</h1>
            <p className="text-lg text-muted-2 leading-relaxed mb-4">
              Senior Project Manager based in Baku. I&apos;ve spent the last 7 years helping product
              teams ship things — from checkout flows to full platform overhauls.
            </p>
            <p className="text-muted-2 leading-relaxed mb-4">
              Before PM, I was a product designer. That background still shapes how I work:
              I care about the user experience of the product and the team building it.
            </p>
            <p className="text-muted-2 leading-relaxed mb-8">
              Outside of work I read obsessively (mostly product books, some fiction), run twice a week,
              and occasionally take on mentoring calls for junior PMs.
            </p>
            <div className="flex gap-4">
              <a
                href="https://linkedin.com/in/hafizjabarov"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-sm"
              >
                <Linkedin size={15} /> LinkedIn
              </a>
              <a href="mailto:jabarovhafiz@gmail.com" className="btn-outline text-sm">
                <Mail size={15} /> Email
              </a>
              <Link href="/contact" className="btn-accent text-sm">
                Let&apos;s work together <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

          {/* Experience */}
          {experience.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-20"
            >
              <h2 className="text-fg font-semibold text-xl mb-8 border-b border-border pb-4">
                Experience
              </h2>
              <div className="space-y-8">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 mb-2">
                      <div>
                        <h3 className="text-fg font-medium">{exp.role}</h3>
                        <p className="text-sm" style={{ color: 'var(--accent)' }}>{exp.companyName}</p>
                      </div>
                      <p className="text-muted text-xs font-mono shrink-0">
                        {fmtPeriod(exp.startDate, exp.endDate, exp.current)}
                      </p>
                    </div>
                    {exp.summary && <p className="text-muted-2 text-sm mb-2">{exp.summary}</p>}
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="space-y-1">
                        {exp.bullets.map((b, i) => (
                          <li key={i} className="text-muted text-sm flex items-start gap-2">
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
              className="mb-20"
            >
              <h2 className="text-fg font-semibold text-xl mb-8 border-b border-border pb-4">
                Education
              </h2>
              <div className="space-y-6">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 mb-1">
                      <div>
                        <h3 className="text-fg font-medium">{edu.program}</h3>
                        <p className="text-muted-2 text-sm">{edu.institution}</p>
                      </div>
                      <p className="text-muted text-xs font-mono shrink-0">
                        {fmtPeriod(edu.startDate, edu.endDate)}
                      </p>
                    </div>
                    {edu.bullets && edu.bullets.length > 0 && (
                      <ul className="mt-2 space-y-0.5">
                        {edu.bullets.map((b, i) => (
                          <li key={i} className="text-muted text-sm flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: 'var(--border-2)' }} />
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

          {/* Skills summary */}
          {skills.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-fg font-semibold text-xl mb-8 border-b border-border pb-4">
                Skills & Tools
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span key={s.id} className="tag">{s.name}</span>
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
