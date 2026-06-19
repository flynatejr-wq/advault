import Link from 'next/link'
import { cn, formatDate } from '@/lib/utils'
import type { Lead } from '@/types'
import { PRODUCT_LABELS } from '@/types'
import { LeadScoreBadge } from './LeadScoreBadge'
import { StageBadge } from './StageBadge'

interface Props { lead: Lead; compact?: boolean }

export function LeadCard({ lead, compact }: Props) {
  const isHot = (lead.score ?? 0) >= 8

  return (
    <Link
      href={`/dashboard/leads/${lead.id}`}
      className={cn(
        'block bg-bg-secondary border border-white/[0.08] rounded-card p-4 hover:border-white/20 transition-colors',
        isHot && 'border-l-2 border-l-[#FF6B35]'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-text-primary font-medium truncate">{lead.name}</span>
            {isHot && (
              <span className="text-xs font-semibold text-[#FF6B35] bg-[#FF6B35]/10 px-1.5 py-0.5 rounded">
                HOT
              </span>
            )}
          </div>
          <p className="text-text-secondary text-sm mt-0.5 truncate">{lead.email}</p>
          {!compact && (
            <p className="text-text-secondary text-xs mt-1">
              {PRODUCT_LABELS[lead.product_interest]}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <LeadScoreBadge score={lead.score} size="sm" />
          {!compact && <StageBadge stage={lead.stage} />}
        </div>
      </div>
      {!compact && (
        <p className="text-text-tertiary text-xs mt-3">{formatDate(lead.created_at)}</p>
      )}
    </Link>
  )
}
