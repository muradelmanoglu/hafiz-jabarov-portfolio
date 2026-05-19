import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ContactSection from '@/components/sections/ContactSection'
import FAQSection from '@/components/sections/FAQSection'
import { fetchPublic } from '@/lib/server-api'
import { getTranslations } from 'next-intl/server'
import type { SiteSettings, FAQ } from '@/lib/api'

export default async function ContactPage({ params }: { params: { locale: string } }) {
  const { locale } = params
  const [settings, faqs, t] = await Promise.all([
    fetchPublic<Partial<SiteSettings>>('/settings'),
    fetchPublic<FAQ[]>(`/faqs?page=CONTACT&lang=${locale}`),
    getTranslations({ locale, namespace: 'contact' }),
  ])

  const s = settings ?? {}

  return (
    <>
      <Navbar />
      <main className="pt-24 md:pt-32">
        <div className="container-main mb-8">
          <span className="section-label">{t('pageLabel')}</span>
          <h1 className="display-lg text-fg">{t('pageHeading')}</h1>
        </div>
        <ContactSection settings={s} />
        <FAQSection faqs={faqs ?? []} />
      </main>
      <Footer settings={s} />
    </>
  )
}
