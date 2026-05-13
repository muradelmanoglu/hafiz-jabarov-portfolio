'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { adminApi, clearTokens } from '@/lib/api'
import {
  LayoutDashboard,
  FolderOpen,
  Wrench,
  Briefcase,
  Mail,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = (adminPath: string) => [
  { label: 'Dashboard', href: `/${adminPath}/dashboard`, icon: LayoutDashboard },
  { label: 'Case Studies', href: `/${adminPath}/dashboard/projects`, icon: FolderOpen },
  { label: 'Skills', href: `/${adminPath}/dashboard/skills`, icon: Wrench },
  { label: 'Experience', href: `/${adminPath}/dashboard/experience`, icon: Briefcase },
  { label: 'Submissions', href: `/${adminPath}/dashboard/messages`, icon: Mail },
  { label: 'Settings', href: `/${adminPath}/dashboard/settings`, icon: Settings },
]

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { adminPath: string }
}) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await adminApi.logout()
    } finally {
      clearTokens()
      router.push(`/${params.adminPath}/login`)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Sidebar */}
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
          {navItems(params.adminPath).map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'text-black'
                    : 'text-muted-2 hover:text-fg hover:bg-surface-2'
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
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
