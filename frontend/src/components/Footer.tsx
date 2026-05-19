'use client'

import { useEffect, useState } from 'react'
import { Linkedin, Github, Mail, CalendarDays, Instagram, Twitter, ExternalLink } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/navigation'
import { publicApi, type SiteSettings, type SocialLink } from '@/lib/api'

// Detect a standard icon from platform name / URL
function detectIcon(label: string, url: string) {
  const l = label.toLowerCase()
  const u = url.toLowerCase()
  if (l.includes('linkedin') || u.includes('linkedin')) return Linkedin
  if (l.includes('github') || u.includes('github')) return Github
  if (l.includes('twitter') || l.includes(' x') || u.includes('twitter') || u.includes('x.com')) return Twitter
  if (l.includes('instagram') || u.includes('instagram')) return Instagram
  if (l.includes('calendly') || u.includes('calendly')) return CalendarDays
  return ExternalLink
}

export default function Footer() {
  const t = useTranslations('footer')
  const tn = useTranslations('nav')
  const [settings, setSettings] = useState<Partial<SiteSettings>>({})

  useEffect(() => {
    publicApi.getSettings().then((res) => {
      if (res.data.data) setSettings(res.data.data)
    }).catch(() => {})
  }, [])

  const footerLinks = [
    { label: tn('work'), href: '/work' },
    { label: tn('services'), href: '/services' },
    { label: tn('about'), href: '/about' },
    { label: tn('resume'), href: '/resume' },
    { label: tn('contact'), href: '/contact' },
  ]

  // Predefined social links
  const predefinedLinks: { url: string; icon: typeof Linkedin; label: string }[] = [
    { url: settings.linkedIn || '', icon: Linkedin, label: 'LinkedIn' },
    { url: settings.github || '', icon: Github, label: 'GitHub' },
    { url: settings.twitter || '', icon: Twitter, label: 'Twitter' },
    { url: settings.instagram || '', icon: Instagram, label: 'Instagram' },
    { url: settings.email ? `mailto:${settings.email}` : '', icon: Mail, label: 'Email' },
    { url: settings.calendly || '', icon: CalendarDays, label: 'Book a call' },
  ].filter((s) => !!s.url)

  // Custom social links added by admin
  const customLinks: SocialLink[] = (() => {
    try { return JSON.parse(settings.customSocialLinksJson || '[]') } catch { return [] }
  })()

  const allSocialLinks = [
    ...predefinedLinks,
    ...customLinks.filter((c) => !!c.url).map((c) => ({
      url: c.url,
      icon: detectIcon(c.label, c.url),
      label: c.label,
    })),
  ]

  return (
    <footer className="border-t border-border mt-auto">
      <div className="container-main py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <Link href="/" className="heading-serif text-xl text-fg hover:text-accent transition-colors">
              HJ<span style={{ color: 'var(--accent)' }}>.</span>
            </Link>
            <p className="text-muted text-sm mt-1 max-w-xs">{t('tagline')}</p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted text-sm hover:text-fg-2 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {allSocialLinks.length > 0 && (
            <div className="flex items-center gap-4">
              {allSocialLinks.map(({ url, icon: Icon, label }) => (
                <a
                  key={label}
                  href={url}
                  target={url.startsWith('mailto:') ? undefined : '_blank'}
                  rel={url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  className="text-muted hover:text-fg transition-colors"
                  aria-label={label}
                  title={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="divider mt-8 mb-6" />

        <p className="text-muted text-xs text-center">
          &copy; {new Date().getFullYear()} Hafiz Jabarov. {t('rights')} {t('builtWith')}
        </p>
      </div>
    </footer>
  )
}
