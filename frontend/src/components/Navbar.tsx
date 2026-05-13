'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Resume', href: '/resume' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        scrolled
          ? 'bg-bg/90 backdrop-blur-xl border-b border-border'
          : 'bg-transparent'
      )}
    >
      <div className="container-main">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="heading-serif text-xl text-fg hover:text-accent transition-colors"
          >
            HJ<span style={{ color: 'var(--accent)' }}>.</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'text-fg'
                    : 'text-muted hover:text-fg-2'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link href="/contact" className="btn-accent text-xs py-2 px-5">
              Let&apos;s talk
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-muted-2 hover:text-fg transition-colors p-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-bg/95 backdrop-blur-xl">
          <div className="container-main py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block text-base font-medium transition-colors py-1',
                  pathname === link.href ? 'text-fg' : 'text-muted-2 hover:text-fg'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/contact" className="btn-accent inline-flex mt-2 text-sm">
              Let&apos;s talk
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
