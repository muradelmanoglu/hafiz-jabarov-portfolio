'use client'

import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api'
import { FolderOpen, Wrench, Briefcase, Mail, Building2, BookOpen, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function DashboardPage({ params }: { params: { locale: string; adminPath: string } }) {
  const t = useTranslations('admin.dashboard')
  const [stats, setStats] = useState<Record<string, number> | null>(null)

  useEffect(() => {
    adminApi.getStats().then((res) => {
      if (res.data.data) setStats(res.data.data)
    })
  }, [])

  const base = `/${params.locale}/${params.adminPath}/dashboard`

  const statCards = [
    { label: t('stats.newSubmissions'), key: 'newSubmissions', icon: Mail, color: 'text-green-400' },
    { label: t('stats.caseStudies'), key: 'totalCaseStudies', icon: FolderOpen, color: 'text-blue-400' },
    { label: t('stats.services'), key: 'totalServices', icon: BookOpen, color: 'text-purple-400' },
    { label: t('stats.skills'), key: 'totalSkills', icon: Wrench, color: 'text-orange-400' },
    { label: t('stats.experience'), key: 'totalExperience', icon: Briefcase, color: 'text-cyan-400' },
    { label: t('stats.testimonials'), key: 'totalTestimonials', icon: Users, color: 'text-pink-400' },
    { label: t('stats.companies'), key: 'totalCompanies', icon: Building2, color: 'text-yellow-400' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">{t('title')}</h1>
      <p className="text-gray-500 mb-8">{t('subtitle')}</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats
          ? statCards.map((card) => (
              <div key={card.label} className="card">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-500 text-sm">{card.label}</span>
                  <card.icon className={card.color} size={18} />
                </div>
                <div className="text-3xl font-bold text-white">{stats[card.key] ?? 0}</div>
              </div>
            ))
          : Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-gray-800 rounded mb-3 w-24" />
                <div className="h-8 bg-gray-800 rounded w-12" />
              </div>
            ))}
      </div>

      <div className="card">
        <h2 className="text-white font-semibold mb-4">{t('quickLinks')}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: t('newCaseStudy'), href: `${base}/projects` },
            { label: t('editSkills'), href: `${base}/skills` },
            { label: t('viewSubmissions'), href: `${base}/messages` },
            { label: t('viewSite'), href: '/', target: '_blank' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.target}
              className="px-4 py-3 rounded-lg text-sm transition-colors"
              style={{ backgroundColor: 'var(--surface-2)', color: 'var(--fg-2)' }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
