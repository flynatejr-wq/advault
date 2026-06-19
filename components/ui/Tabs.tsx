'use client'

import { createContext, useContext, useState } from 'react'
import { cn } from '@/lib/utils'

interface TabsContextValue {
  active: string
  setActive: (tab: string) => void
}

const TabsContext = createContext<TabsContextValue>({ active: '', setActive: () => {} })

interface TabsProps {
  defaultTab: string
  children: React.ReactNode
  className?: string
}

export function Tabs({ defaultTab, children, className }: TabsProps) {
  const [active, setActive] = useState(defaultTab)
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex gap-1 bg-bg-tertiary rounded-lg p-1', className)}>
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const { active, setActive } = useContext(TabsContext)
  return (
    <button
      onClick={() => setActive(value)}
      className={cn(
        'flex-1 px-3 py-1.5 text-sm rounded-md transition-all duration-150',
        active === value
          ? 'bg-bg-secondary text-text-primary font-medium shadow-sm'
          : 'text-text-secondary hover:text-text-primary'
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children }: { value: string; children: React.ReactNode }) {
  const { active } = useContext(TabsContext)
  if (active !== value) return null
  return <div>{children}</div>
}
