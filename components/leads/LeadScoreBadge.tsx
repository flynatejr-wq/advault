import { cn } from '@/lib/utils'

interface Props { score: number | null; size?: 'sm' | 'md' }

export function LeadScoreBadge({ score, size = 'md' }: Props) {
  const color =
    score === null ? 'bg-white/10 text-text-secondary'
    : score >= 9 ? 'bg-accent text-white'
    : score >= 7 ? 'bg-success/20 text-success'
    : score >= 4 ? 'bg-warning/20 text-warning'
    : 'bg-danger/20 text-danger'

  const dim = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm'

  return (
    <span className={cn('inline-flex items-center justify-center rounded-full font-bold', color, dim)}>
      {score ?? '—'}
    </span>
  )
}
