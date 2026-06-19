import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 pt-20 pb-16">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-3xl mx-auto">
        <p className="text-label text-accent mb-5">AI-Powered Life Insurance Advertising</p>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold heading-display text-text-primary mb-6 leading-tight">
          Stop writing ads.<br />
          Start closing{' '}
          <span className="text-accent">leads.</span>
        </h1>

        <p className="text-text-secondary text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Generate high-converting Facebook, Google, and email campaigns for life insurance in under 60 seconds — powered by Claude AI.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto px-8">Start free</Button>
          </Link>
          <a href="#demo">
            <Button size="lg" variant="ghost" className="w-full sm:w-auto px-8">See a sample</Button>
          </a>
        </div>
      </div>
    </section>
  )
}
