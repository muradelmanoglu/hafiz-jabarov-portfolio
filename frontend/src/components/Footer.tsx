import { Linkedin, Github, Mail, CalendarDays, Instagram, Twitter, ExternalLink } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/navigation'
import { fetchPublic } from '@/lib/server-api'
import type { SiteSettings, SocialLink } from '@/lib/api'

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

export default async function Footer({ settings: propSettings }: { settings?: Partial<SiteSettings> }) {
  const t = await getTranslations('footer')
  const tn = await getTranslations('nav')

  const settings = propSettings ?? (await fetchPublic<Partial<SiteSettings>>('/settings')) ?? {}

  const footerLinks = [
    { label: tn('work'), href: '/work' },
    { label: tn('services'), href: '/services' },
    { label: tn('about'), href: '/about' },
    { label: tn('contact'), href: '/contact' },
  ]

  const predefinedLinks: { url: string; Icon: typeof Linkedin; label: string }[] = [
    { url: settings.linkedIn || '', Icon: Linkedin, label: 'LinkedIn' },
    { url: settings.github || '', Icon: Github, label: 'GitHub' },
    { url: settings.twitter || '', Icon: Twitter, label: 'Twitter' },
    { url: settings.instagram || '', Icon: Instagram, label: 'Instagram' },
    { url: settings.email ? `mailto:${settings.email}` : '', Icon: Mail, label: 'Email' },
    { url: settings.calendly || '', Icon: CalendarDays, label: 'Book a call' },
  ].filter((s) => !!s.url)

  const customLinks: SocialLink[] = (() => {
    try { return JSON.parse(settings.customSocialLinksJson || '[]') } catch { return [] }
  })()

  const allSocialLinks = [
    ...predefinedLinks,
    ...customLinks.filter((c) => !!c.url).map((c) => ({
      url: c.url,
      Icon: detectIcon(c.label, c.url),
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
              {allSocialLinks.map(({ url, Icon, label }) => (
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
