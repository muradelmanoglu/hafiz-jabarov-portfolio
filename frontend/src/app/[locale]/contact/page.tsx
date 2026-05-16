'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ContactSection from '@/components/sections/ContactSection'
import FAQSection from '@/components/sections/FAQSection'
import { useTranslations } from 'next-intl'

export default function ContactPage() {
  const t = useTranslations('contact')

  return (
    <>
      <Navbar />
      <main className="pt-24 md:pt-32">
        <div className="container-main mb-8">
          <span className="section-label">{t('pageLabel')}</span>
          <h1 className="display-lg text-fg">{t('pageHeading')}</h1>
        </div>
        <ContactSection />
        <FAQSection page="CONTACT" />
      </main>
      <Footer />
    </>
  )
}
