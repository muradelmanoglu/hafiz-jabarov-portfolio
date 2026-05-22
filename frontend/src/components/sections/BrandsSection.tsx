'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Company } from '@/lib/api'

export default function BrandsSection({ companies = [] }: { companies?: Company[] }) {
  const t = useTranslations('brands')

  const logos = companies.filter((c) => c.logoUrl)
  if (logos.length === 0) return null

  // Duplicate for seamless marquee loop
  const track = [...logos, ...logos]

  return (
    <section className="border-t border-border py-10 overflow-hidden">
      <div className="container-main mb-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs text-muted uppercase tracking-widest text-center"
        >
          {t('label')}
        </motion.p>
      </div>

      <div className="relative">
        <motion.div
          className="flex gap-12 items-center"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: logos.length * 3,
            ease: 'linear',
            repeat: Infinity,
          }}
          style={{ width: 'max-content' }}
        >
          {track.map((company, i) => (
            <div
              key={`${company.id}-${i}`}
              className="flex-shrink-0 flex items-center justify-center w-32 h-14"
            >
              {company.website ? (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full relative opacity-50 hover:opacity-100 transition-opacity duration-300"
                  title={company.name}
                >
                  <Image
                    src={company.logoUrl!}
                    alt={company.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </a>
              ) : (
                <div
                  className="w-full h-full relative opacity-50"
                  title={company.name}
                >
                  <Image
                    src={company.logoUrl!}
                    alt={company.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
