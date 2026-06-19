import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const PLANS = [
  {
    name: 'Starter',
    price: '$29',
    period: '/mo',
    description: 'Perfect for solo agents',
    features: ['50 campaigns/month', 'All 3 channels', 'Campaign history', 'Copy to clipboard'],
    cta: 'Get started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$79',
    period: '/mo',
    description: 'For teams and agencies',
    features: ['Unlimited campaigns', 'All 3 channels', 'A/B variants', 'Priority support', 'Team workspace'],
    cta: 'Start Pro',
    highlight: true,
  },
]

export function Pricing() {
  return (
    <section className="py-24 px-4" id="pricing">
      <div className="max-w-3xl mx-auto">
        <p className="text-label text-accent text-center mb-3">Pricing</p>
        <h2 className="text-3xl font-semibold heading-display text-center text-text-primary mb-4">Simple, transparent pricing</h2>
        <p className="text-text-secondary text-center mb-12 text-sm">No setup fees. Cancel anytime.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'bg-bg-secondary border rounded-card p-6 flex flex-col gap-5',
                plan.highlight ? 'border-accent shadow-[0_0_40px_rgba(123,97,255,0.15)]' : 'border-white/[0.08]'
              )}
            >
              {plan.highlight && (
                <span className="text-label text-accent">Most popular</span>
              )}
              <div>
                <h3 className="text-lg font-semibold text-text-primary">{plan.name}</h3>
                <p className="text-text-secondary text-sm">{plan.description}</p>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold heading-display text-text-primary">{plan.price}</span>
                <span className="text-text-secondary text-sm mb-1">{plan.period}</span>
              </div>
              <ul className="flex flex-col gap-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-text-secondary">
                    <Check size={14} className="text-success flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="mt-auto">
                <Button
                  className="w-full"
                  variant={plan.highlight ? 'primary' : 'ghost'}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
