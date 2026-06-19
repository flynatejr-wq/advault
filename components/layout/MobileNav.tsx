'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Sparkles, FileText, Users, LayoutGrid, Link2, Settings, LogOut, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

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
                          onClick={() => setOpen(false)}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
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
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
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
