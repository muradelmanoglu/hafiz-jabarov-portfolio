import type { Metadata } from 'next'
import { Fraunces } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import '../globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['400', '600', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Hafiz Jabarov — Senior Project Manager',
    template: '%s | Hafiz Jabarov',
  },
  description:
    'Senior Project Manager with 7+ years delivering e-commerce, SaaS and fintech products from 0→1 and 1→scale.',
  keywords: ['Project Manager', 'Product Manager', 'PM', 'E-Commerce', 'Agile', 'Hafiz Jabarov'],
  authors: [{ name: 'Hafiz Jabarov' }],
  openGraph: {
    type: 'website',
    url: 'https://hafizjabarov.com',
    siteName: 'Hafiz Jabarov',
    title: 'Hafiz Jabarov — Senior Project Manager',
    description:
      'Senior PM with 7+ years delivering e-commerce, SaaS and fintech products from 0→1 and 1→scale.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hafiz Jabarov — Senior Project Manager',
    description: 'Senior PM with 7+ years delivering products from 0→1 and 1→scale.',
  },
  robots: { index: true, follow: true },
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = params

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`dark ${fraunces.variable} ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className={GeistSans.className}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
