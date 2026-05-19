import { getTranslations } from 'next-intl/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FAQSection from '@/components/sections/FAQSection'
import { fetchPublic } from '@/lib/server-api'
import type { PortfolioService, SiteSettings, FAQ } from '@/lib/api'
import ServicesClient from './ServicesClient'
import { CalendarDays } from 'lucide-react'

export default async function ServicesPage({ params }: { params: { locale: string } }) {
  const { locale } = params

  const [services, settings, faqs, t] = await Promise.all([
    fetchPublic<PortfolioService[]>(`/services?lang=${locale}`),
    fetchPublic<Partial<SiteSettings>>('/settings'),
    fetchPublic<FAQ[]>(`/faqs?page=SERVICES&lang=${locale}`),
    getTranslations({ locale, namespace: 'services' }),
  ])

  const s = settings ?? {}
  const calendlyUrl = s.calendly || 'https://calendly.com/hafizjabarov'

  return (
    <>
      <Navbar />
      <main className="pt-24 md:pt-32">
        <ServicesClient services={services ?? []} locale={locale} />
        <FAQSection faqs={faqs ?? []} />
        <section className="section border-t border-border">
          <div className="container-main text-center">
            <h2 className="display-md text-fg mb-4">{t('notSure')}</h2>
            <p className="text-muted-2 mb-8 max-w-md mx-auto">{t('notSureDesc')}</p>
            <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" className="btn-accent inline-flex">
              <CalendarDays size={16} />
              {t('bookFreeCall')}
            </a>
          </div>
        </section>
      </main>
      <Footer settings={s} />
    </>
  )
}
