'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

type Tab = 'signin' | 'signup'

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()

    try {
      if (tab === 'signin') {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password })
        if (err) throw err
      } else {
        const { error: err } = await supabase.auth.signUp({ email, password })
        if (err) throw err
      }
      router.push('/dashboard/new')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="flex items-center gap-2 glow-accent rounded-lg px-3 py-2">
            <Zap size={20} className="text-accent" fill="currentColor" />
            <span className="text-lg font-semibold heading-display">AdVault</span>
          </div>
          <p className="text-text-secondary text-sm">AI-powered life insurance campaigns</p>
        </div>

        {/* Card */}
        <div className="bg-bg-secondary border border-white/[0.08] rounded-card p-6">
          {/* Tabs */}
          <div className="flex bg-bg-tertiary rounded-lg p-1 mb-6">
            {(['signin', 'signup'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError('') }}
                className={`flex-1 py-1.5 text-sm rounded-md transition-all duration-150 ${
                  tab === t ? 'bg-bg-secondary text-text-primary font-medium' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {t === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
              hint={tab === 'signup' ? 'At least 8 characters' : undefined}
            />

            {error && (
              <p className="text-danger text-sm bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full mt-2" loading={loading}>
              {tab === 'signin' ? 'Sign in' : 'Create account'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
