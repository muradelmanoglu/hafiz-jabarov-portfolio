import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ContactSection from '@/components/sections/ContactSection'
import FAQSection from '@/components/sections/FAQSection'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Hafiz Jabarov — let\'s talk about your project.',
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 md:pt-32">
        <div className="container-main mb-8">
          <span className="section-label">Get in touch</span>
          <h1 className="display-lg text-fg">Let&apos;s work together</h1>
        </div>
        <ContactSection />
        <FAQSection page="CONTACT" />
      </main>
      <Footer />
    </>
  )
}
