import { cn } from '@/lib/utils'
import type { LeadStage } from '@/types'
import { STAGE_LABELS } from '@/types'

const STAGE_COLORS: Record<LeadStage, string> = {
  new: 'bg-accent-subtle text-accent',
  contacted: 'bg-warning/15 text-warning',
  qualified: 'bg-success/15 text-success',
  quoted: 'bg-blue-500/15 text-blue-400',
  closed_won: 'bg-success/20 text-success border border-success/30',
  closed_lost: 'bg-white/5 text-text-secondary',
}

interface Props { stage: LeadStage }

export function StageBadge({ stage }: Props) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', STAGE_COLORS[stage])}>
      {STAGE_LABELS[stage]}
    </span>
  )
}
