import { getTranslations } from 'next-intl/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AboutPageClient from './AboutPageClient'
import type { Experience, Education, Skill, SiteSettings } from '@/lib/api'

async function fetchPublic<T>(path: string): Promise<T | null> {
  const base = process.env.BACKEND_URL || 'http://localhost:8080'
  try {
    const res = await fetch(`${base}/api/public${path}`, { next: { revalidate: 30 } })
    if (!res.ok) return null
    const json = await res.json()
    return (json.data ?? null) as T
  } catch {
    return null
  }
}

export default async function AboutPage({ params }: { params: { locale: string } }) {
  const { locale } = params

  const [settings, experience, education, skills] = await Promise.all([
    fetchPublic<Partial<SiteSettings>>('/settings'),
    fetchPublic<Experience[]>(`/experience?lang=${locale}`),
    fetchPublic<Education[]>(`/education?lang=${locale}`),
    fetchPublic<Skill[]>('/skills'),
  ])

  const s = settings || {}

  // Resolve multilingual about text — same priority as AboutSection
  const aboutTrans = (() => {
    try { return JSON.parse(s.aboutTranslationsJson || '{}') } catch { return {} }
  })()
  const locTrans = (locale !== 'en' && aboutTrans[locale]) ? aboutTrans[locale] : {}

  const t = await getTranslations({ locale, namespace: 'aboutPage' })

  const heading = locTrans.heading || s.aboutHeading || t('heading')
  const p1 = locTrans.p1 || s.aboutP1 || t('p1')
  const p2 = locTrans.p2 || s.aboutP2 || t('p2')
  const p3 = locTrans.p3 || s.aboutP3 || t('p3')

  return (
    <>
      <Navbar />
      <AboutPageClient
        heading={heading}
        p1={p1}
        p2={p2}
        p3={p3}
        resumeUrl={s.resumeUrl}
        linkedIn={s.linkedIn}
        email={s.email}
        experience={experience || []}
        education={education || []}
        skills={skills || []}
        locale={locale}
      />
      <Footer />
    </>
  )
}
