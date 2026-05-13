import Link from 'next/link'
import { Linkedin, Github, Mail, CalendarDays } from 'lucide-react'

const footerLinks = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Resume', href: '/resume' },
  { label: 'Contact', href: '/contact' },
]

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="container-main py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="heading-serif text-xl text-fg hover:text-accent transition-colors"
            >
              HJ<span style={{ color: 'var(--accent)' }}>.</span>
            </Link>
            <p className="text-muted text-sm mt-1 max-w-xs">
              Senior Project Manager · Available for new engagements
            </p>
          </div>

          {/* Nav */}
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

          {/* Social */}
          <div className="flex items-center gap-4">
            <a
              href="https://linkedin.com/in/hafizjabarov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-fg transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://github.com/hafizjabarov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-fg transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="mailto:jabarovhafiz@gmail.com"
              className="text-muted hover:text-fg transition-colors"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
            <a
              href="https://calendly.com/hafizjabarov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-fg transition-colors"
              aria-label="Book a call"
            >
              <CalendarDays size={18} />
            </a>
          </div>
        </div>

        <div className="divider mt-8 mb-6" />

        <p className="text-muted text-xs text-center">
          &copy; {new Date().getFullYear()} Hafiz Jabarov. All rights reserved.
          Built with Next.js &amp; Spring Boot.
        </p>
      </div>
    </footer>
  )
}
