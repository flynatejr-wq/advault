'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Plus, LayoutGrid, Settings, LogOut, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

const navItems = [
  { label: 'New Campaign', href: '/dashboard/new', icon: Plus },
  { label: 'Campaigns', href: '/dashboard/campaigns', icon: LayoutGrid },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
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
      <nav className="flex-1 p-3 flex flex-col gap-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150',
                isActive
                  ? 'bg-accent-subtle text-text-primary border-l-2 border-accent pl-[10px]'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
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
