'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/lib/navigation'
import { routing } from '@/i18n/routing'

const LOCALE_LABELS: Record<string, string> = { en: 'EN', az: 'AZ', ru: 'RU' }

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const navLinks = [
    { label: t('work'), href: '/work' },
    { label: t('services'), href: '/services' },
    { label: t('about'), href: '/about' },
    { label: t('resume'), href: '/resume' },
    { label: t('contact'), href: '/contact' },
  ]

  useEffect(() => {
    setScrolled(window.scrollY > 20)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setLangOpen(false)
  }, [pathname])

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/') || '/')
    setLangOpen(false)
  }

  const isActive = (href: string) => {
    const withLocale = `/${locale}${href}`
    return pathname === withLocale || pathname.startsWith(withLocale + '/')
  }

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        scrolled ? 'bg-bg/30 backdrop-blur-xl' : 'bg-transparent'
      )}
    >
      <div className="container-main">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="heading-serif text-xl text-fg hover:text-accent transition-colors">
            HJ<span style={{ color: 'var(--accent)' }}>.</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  isActive(link.href) ? 'text-fg' : 'text-muted hover:text-fg-2'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/contact" className="btn-accent text-xs py-2 px-5">
              {t('letsTalk')}
            </Link>
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-xs text-muted hover:text-fg transition-colors px-2 py-1.5 rounded-md border border-border hover:border-border-2"
              >
                <Globe size={13} />
                {LOCALE_LABELS[locale]}
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-surface border border-border rounded-lg overflow-hidden shadow-lg z-50 min-w-[80px]">
                  {(routing.locales as readonly string[]).map((loc) => (
                    <button
                      key={loc}
                      onClick={() => switchLocale(loc)}
                      className={cn(
                        'w-full px-3 py-2 text-xs text-left transition-colors',
                        loc === locale ? 'text-fg font-medium' : 'text-muted hover:text-fg hover:bg-surface-2'
                      )}
                    >
                      {LOCALE_LABELS[loc]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            className="md:hidden text-muted-2 hover:text-fg transition-colors p-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-border bg-bg/95 backdrop-blur-xl">
          <div className="container-main py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block text-base font-medium transition-colors py-1',
                  isActive(link.href) ? 'text-fg' : 'text-muted-2 hover:text-fg'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/contact" className="btn-accent inline-flex mt-2 text-sm">
              {t('letsTalk')}
            </Link>
            <div className="flex gap-2 pt-2 border-t border-border">
              {(routing.locales as readonly string[]).map((loc) => (
                <button
                  key={loc}
                  onClick={() => switchLocale(loc)}
                  className={cn(
                    'px-3 py-1 text-xs rounded-md border transition-colors',
                    loc === locale
                      ? 'border-accent text-fg font-medium'
                      : 'border-border text-muted hover:text-fg'
                  )}
                >
                  {LOCALE_LABELS[loc]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
