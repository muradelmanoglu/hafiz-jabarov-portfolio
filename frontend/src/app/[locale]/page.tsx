import { setRequestLocale, getTranslations } from 'next-intl/server'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import BrandsSection from '@/components/sections/BrandsSection'
import AboutSection from '@/components/sections/AboutSection'
import FeaturedWorkSection from '@/components/sections/ProjectsSection'
import ServicesSection from '@/components/sections/ServicesSection'
import ExperienceSection from '@/components/sections/ExperienceSection'
import SkillsSection from '@/components/sections/SkillsSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import FAQSection from '@/components/sections/FAQSection'
import ContactSection from '@/components/sections/ContactSection'
import Footer from '@/components/Footer'
import { fetchPublic } from '@/lib/server-api'
import type {
  SiteSettings, CaseStudy, PortfolioService, Experience,
  Skill, Testimonial, FAQ, Company,
} from '@/lib/api'

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)

  const [settings, caseStudies, services, experiences, skills, testimonials, faqs, companies] = await Promise.all([
    fetchPublic<Partial<SiteSettings>>('/settings'),
    fetchPublic<CaseStudy[]>('/case-studies/featured'),
    fetchPublic<PortfolioService[]>(`/services?lang=${locale}`),
    fetchPublic<Experience[]>(`/experience?lang=${locale}`),
    fetchPublic<Skill[]>('/skills'),
    fetchPublic<Testimonial[]>('/testimonials'),
    fetchPublic<FAQ[]>(`/faqs?page=HOME&lang=${locale}`),
    fetchPublic<Company[]>('/companies'),
  ])

  const baseSettings = settings ?? {}
  // Apply locale-specific translations over the base EN settings
  const s: Partial<SiteSettings> = (() => {
    if (locale === 'en' || !baseSettings.settingsTranslationsJson) return baseSettings
    try {
      const allTranslations = JSON.parse(baseSettings.settingsTranslationsJson)
      const localeTranslations: Record<string, string> = allTranslations[locale] || {}
      const merged = { ...baseSettings }
      for (const [key, val] of Object.entries(localeTranslations)) {
        if (val) (merged as Record<string, unknown>)[key] = val
      }
      return merged
    } catch {
      return baseSettings
    }
  })()

  return (
    <>
      <Navbar />
      <main>
        <HeroSection settings={s} />
        <BrandsSection companies={companies ?? []} />
        <AboutSection settings={s} />
        <FeaturedWorkSection caseStudies={caseStudies ?? []} />
        <ServicesSection services={services ?? []} />
        <ExperienceSection experiences={experiences ?? []} />
        <SkillsSection skills={skills ?? []} />
        <TestimonialsSection testimonials={testimonials ?? []} />
        <FAQSection faqs={faqs ?? []} />
        <ContactSection settings={s} />
      </main>
      <Footer settings={s} />
    </>
  )
}
