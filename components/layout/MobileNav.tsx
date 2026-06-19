'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Plus, LayoutGrid, Settings, LogOut, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { label: 'New Campaign', href: '/dashboard/new', icon: Plus },
  { label: 'Campaigns', href: '/dashboard/campaigns', icon: LayoutGrid },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      <div className="flex items-center justify-between px-4 h-14 bg-bg-secondary border-b border-white/[0.08] md:hidden">
        <div className="flex items-center gap-2 glow-accent rounded-lg px-2 py-1">
          <Zap size={16} className="text-accent" fill="currentColor" />
          <span className="font-semibold text-sm">AdVault</span>
        </div>
        <button onClick={() => setOpen(true)} className="text-text-secondary p-1">
          <Menu size={20} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute top-0 left-0 w-64 h-full bg-bg-secondary border-r border-white/[0.08] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/[0.08]">
              <span className="font-semibold text-text-primary">AdVault</span>
              <button onClick={() => setOpen(false)} className="text-text-secondary p-1">
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 p-3 flex flex-col gap-0.5">
              {navItems.map(({ label, href, icon: Icon }) => {
                const isActive = pathname.startsWith(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                      isActive
                        ? 'bg-accent-subtle text-text-primary'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                    )}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                )
              })}
            </nav>
            <div className="p-3 border-t border-white/[0.08]">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:text-danger hover:bg-danger/10 w-full transition-all"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
