'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { adminApi, clearTokens } from '@/lib/api'
import {
  LayoutDashboard,
  FolderOpen,
  Wrench,
  Briefcase,
  GraduationCap,
  Package,
  Mail,
  Settings,
  LogOut,
  ChevronRight,
  MessageSquare,
  HelpCircle,
  User,
  Building2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string; adminPath: string }
}) {
  const t = useTranslations('admin.nav')
  const pathname = usePathname()
  const router = useRouter()

  const base = `/${params.locale}/${params.adminPath}/dashboard`

  const navItems = [
    { label: t('dashboard'), href: base, icon: LayoutDashboard },
    { label: t('caseStudies'), href: `${base}/projects`, icon: FolderOpen },
    { label: t('services'), href: `${base}/services`, icon: Package },
    { label: t('skills'), href: `${base}/skills`, icon: Wrench },
    { label: t('experience'), href: `${base}/experience`, icon: Briefcase },
    { label: t('education'), href: `${base}/education`, icon: GraduationCap },
    { label: t('about'), href: `${base}/about`, icon: User },
    { label: t('companies'), href: `${base}/companies`, icon: Building2 },
    { label: t('testimonials'), href: `${base}/testimonials`, icon: MessageSquare },
    { label: t('faqs'), href: `${base}/faqs`, icon: HelpCircle },
    { label: t('submissions'), href: `${base}/messages`, icon: Mail },
    { label: t('settings'), href: `${base}/settings`, icon: Settings },
  ]

  const handleLogout = async () => {
    try {
      await adminApi.logout()
    } finally {
      clearTokens()
      router.push(`/${params.locale}/${params.adminPath}/login`)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg)' }}>
      <aside
        className="w-60 shrink-0 flex flex-col border-r"
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div className="px-5 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <Link href="/" className="heading-serif text-lg text-fg hover:text-accent transition-colors">
            HJ<span style={{ color: 'var(--accent)' }}>.</span>
            <span className="text-muted text-xs font-normal ml-2 font-sans">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive ? 'text-black' : 'text-muted-2 hover:text-fg hover:bg-surface-2'
                )}
                style={isActive ? { backgroundColor: 'var(--accent)' } : {}}
              >
                <item.icon size={16} />
                {item.label}
                {isActive && <ChevronRight size={12} className="ml-auto" />}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:text-red-400 transition-colors w-full"
          >
            <LogOut size={16} />
            {t('logout')}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
