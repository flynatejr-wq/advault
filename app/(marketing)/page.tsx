import Link from 'next/link'
import { Zap } from 'lucide-react'
import { Hero } from '@/components/landing/Hero'
import { SocialProof } from '@/components/landing/SocialProof'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { ChannelShowcase } from '@/components/landing/ChannelShowcase'
import { Pricing } from '@/components/landing/Pricing'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Fixed nav */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/[0.06] bg-bg-primary/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 glow-accent rounded-lg px-2 py-1">
            <Zap size={16} className="text-accent" fill="currentColor" />
            <span className="font-semibold text-sm">AdVault</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="#pricing" className="text-text-secondary text-sm hover:text-text-primary transition-colors hidden sm:block">
              Pricing
            </Link>
            <Link href="/login">
              <button className="text-sm bg-accent text-white px-4 py-1.5 rounded-btn hover:bg-accent-hover transition-colors font-medium">
                Sign in
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <Hero />
        <SocialProof />
        <HowItWorks />
        <ChannelShowcase />
        <Pricing />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-accent" fill="currentColor" />
            <span className="text-sm font-medium text-text-secondary">AdVault</span>
          </div>
          <p className="text-text-tertiary text-xs">© {new Date().getFullYear()} AdVault. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-text-tertiary text-xs hover:text-text-secondary transition-colors">Privacy</Link>
            <Link href="/terms" className="text-text-tertiary text-xs hover:text-text-secondary transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
