'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Sparkles, FileText, Users, LayoutGrid, Link2, Settings, LogOut, Zap, GitBranch, BarChart2, CalendarDays, Briefcase, UserCog } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

function isActive(pathname: string, href: string): boolean {
  if (href === '/dashboard/new') return pathname === href
  if (href === '/dashboard/leads') return pathname === href
  if (href === '/dashboard/leads/pipeline') return pathname === href
  return pathname.startsWith(href)
}

const navSections = [
  {
    label: 'ADS',
    items: [
      { label: 'New campaign', href: '/dashboard/new', icon: Sparkles },
      { label: 'Campaigns', href: '/dashboard/campaigns', icon: FileText },
    ],
  },
  {
    label: 'LEADS',
    items: [
      { label: 'All leads', href: '/dashboard/leads', icon: Users },
      { label: 'Pipeline', href: '/dashboard/leads/pipeline', icon: LayoutGrid },
      { label: 'Landing pages', href: '/dashboard/landing-pages', icon: Link2 },
    ],
  },
  {
    label: 'AUTOMATION',
    items: [
      { label: 'Sequences', href: '/dashboard/sequences', icon: GitBranch },
    ],
  },
  {
    label: 'INSIGHTS',
    items: [
      { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart2 },
    ],
  },
  {
    label: 'SCHEDULE',
    items: [
      { label: 'Calendar', href: '/dashboard/calendar', icon: CalendarDays },
    ],
  },
  {
    label: 'CLIENTS',
    items: [
      { label: 'Clients', href: '/dashboard/clients', icon: Briefcase },
    ],
  },
  {
    label: 'AGENCY',
    items: [
      { label: 'Team', href: '/dashboard/team', icon: UserCog },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [email, setEmail] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email)
    })
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-60 flex-shrink-0 h-screen bg-bg-secondary border-r border-white/[0.08] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5 glow-accent rounded-lg w-fit px-2 py-1">
          <Zap size={18} className="text-accent" fill="currentColor" />
          <span className="font-semibold text-text-primary tracking-tight">AdVault</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col">
        {navSections.map(({ label, items }) => (
          <div key={label}>
            <p className="text-text-tertiary font-semibold tracking-widest text-[10px] px-3 py-1 mt-4 mb-1 uppercase">
              {label}
            </p>
            <div className="flex flex-col gap-0.5">
              {items.map(({ label: itemLabel, href, icon: Icon }) => {
                const active = isActive(pathname, href)
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150',
                      active
                        ? 'bg-accent-subtle border-l-2 border-accent pl-[10px] text-text-primary'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                    )}
                  >
                    <Icon size={16} />
                    {itemLabel}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}

        {/* Settings — standalone */}
        <div className="mt-auto pt-2">
          <Link
            href="/dashboard/settings"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150',
              isActive(pathname, '/dashboard/settings')
                ? 'bg-accent-subtle border-l-2 border-accent pl-[10px] text-text-primary'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
            )}
          >
            <Settings size={16} />
            Settings
          </Link>
        </div>
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/[0.08]">
        <p className="text-text-tertiary text-xs px-3 mb-2 truncate">{email}</p>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:text-danger hover:bg-danger/10 transition-all duration-150 w-full"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
