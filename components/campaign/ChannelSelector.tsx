'use client'

import { Share2, Search, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Channel } from '@/types'

const CHANNELS: { id: Channel; label: string; description: string; icon: React.ElementType }[] = [
  { id: 'social', label: 'Social Media', description: 'Facebook, Instagram, X', icon: Share2 },
  { id: 'google', label: 'Google Search Ads', description: 'Headlines + descriptions', icon: Search },
  { id: 'email', label: 'Email', description: 'Subject, preview, body copy', icon: Mail },
]

interface ChannelSelectorProps {
  selected: Channel[]
  onChange: (channels: Channel[]) => void
  error?: string
}

export function ChannelSelector({ selected, onChange, error }: ChannelSelectorProps) {
  function toggle(ch: Channel) {
    if (selected.includes(ch)) {
      onChange(selected.filter((c) => c !== ch))
    } else {
      onChange([...selected, ch])
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {CHANNELS.map(({ id, label, description, icon: Icon }) => {
        const active = selected.includes(id)
        return (
          <button
            key={id}
            type="button"
            onClick={() => toggle(id)}
            className={cn(
              'flex items-center gap-4 p-5 rounded-card border text-left transition-all duration-150',
              active
                ? 'border-accent bg-accent-subtle'
                : 'border-white/[0.08] bg-bg-secondary hover:border-white/[0.15]'
            )}
          >
            <div className={cn('p-2.5 rounded-lg', active ? 'bg-accent/20' : 'bg-bg-tertiary')}>
              <Icon size={20} className={active ? 'text-accent' : 'text-text-secondary'} />
            </div>
            <div>
              <p className="font-medium text-sm text-text-primary">{label}</p>
              <p className="text-text-secondary text-xs mt-0.5">{description}</p>
            </div>
            <div className={cn('ml-auto w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all', active ? 'border-accent bg-accent' : 'border-text-tertiary')}>
              {active && <span className="block w-full h-full rounded-full bg-white scale-50" />}
            </div>
          </button>
        )
      })}
      {error && <p className="text-danger text-xs">{error}</p>}
    </div>
  )
}
