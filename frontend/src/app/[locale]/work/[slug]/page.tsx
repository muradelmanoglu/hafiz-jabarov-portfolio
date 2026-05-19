import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Link } from '@/lib/navigation'
import { fetchPublic } from '@/lib/server-api'
import { getTranslations } from 'next-intl/server'
import type { CaseStudy } from '@/lib/api'
import CaseStudyClient from './CaseStudyClient'

export default async function CaseStudyPage({ params }: { params: { locale: string; slug: string } }) {
  const { locale, slug } = params
  const [cs, t] = await Promise.all([
    fetchPublic<CaseStudy>(`/case-studies/${slug}?lang=${locale}`),
    getTranslations({ locale, namespace: 'work' }),
  ])

  if (!cs) {
    return (
      <>
        <Navbar />
        <div className="container-main pt-32 pb-20 text-center">
          <p className="text-muted mb-4">{t('notFound')}</p>
          <Link href="/work" className="btn-outline text-sm">← {t('backToWork')}</Link>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <CaseStudyClient cs={cs} locale={locale} />
      <Footer />
    </>
  )
}
