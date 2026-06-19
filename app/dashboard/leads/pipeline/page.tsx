'use client'
import { useState } from 'react'
import { useLeads } from '@/hooks/useLeads'
import { LeadCard } from '@/components/leads/LeadCard'
import type { Lead, LeadStage } from '@/types'
import { STAGE_LABELS } from '@/types'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'

const PIPELINE_STAGES: LeadStage[] = ['new', 'contacted', 'qualified', 'quoted', 'closed_won']

const STAGE_BORDER: Record<string, string> = {
  new: 'border-t-accent',
  contacted: 'border-t-warning',
  qualified: 'border-t-success',
  quoted: 'border-t-blue-400',
  closed_won: 'border-t-success',
}

function DraggableCard({ lead }: { lead: Lead }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: lead.id })
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      <LeadCard lead={lead} compact />
    </div>
  )
}

function DroppableColumn({
  stage,
  leads,
  borderClass,
}: {
  stage: LeadStage
  leads: Lead[]
  borderClass: string
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage })
  return (
    <div
      ref={setNodeRef}
      className={`w-64 shrink-0 flex flex-col rounded-card border-t-2 ${borderClass} bg-bg-secondary/50 transition-colors ${isOver ? 'bg-accent-subtle' : ''}`}
    >
      <div className="p-3 border-b border-white/[0.08] flex items-center justify-between">
        <span className="text-text-primary text-sm font-medium">{STAGE_LABELS[stage]}</span>
        <span className="text-text-secondary text-xs bg-white/[0.06] px-2 py-0.5 rounded-full">
          {leads.length}
        </span>
      </div>
      <div className="flex-1 p-2 space-y-2 min-h-[400px] overflow-y-auto">
        {leads.map(lead => (
          <DraggableCard key={lead.id} lead={lead} />
        ))}
        {leads.length === 0 && (
          <p className="text-text-tertiary text-xs text-center mt-6">Drop leads here</p>
        )}
      </div>
    </div>
  )
}

export default function PipelinePage() {
  const { leads, loading, updateStage } = useLeads()
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (!over) return
    const newStage = over.id as LeadStage
    const lead = leads.find(l => l.id === active.id)
    if (lead && lead.stage !== newStage) {
      await updateStage(lead.id, newStage)
    }
  }

  const activeLead = leads.find(l => l.id === activeId)
  const closedLost = leads.filter(l => l.stage === 'closed_lost')

  if (loading) {
    return (
      <div className="p-6 flex gap-4 overflow-x-auto">
        {PIPELINE_STAGES.map(s => (
          <div key={s} className="w-64 shrink-0 h-96 bg-bg-secondary rounded-card animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="heading-display">Pipeline</h1>
          <p className="text-text-secondary text-sm">{leads.length} total leads</p>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map(stage => (
            <DroppableColumn
              key={stage}
              stage={stage}
              leads={leads.filter(l => l.stage === stage)}
              borderClass={STAGE_BORDER[stage]}
            />
          ))}
        </div>
        {closedLost.length > 0 && (
          <details className="mt-4">
            <summary className="text-text-secondary text-sm cursor-pointer hover:text-text-primary select-none">
              Closed Lost ({closedLost.length})
            </summary>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
              {closedLost.map(l => <LeadCard key={l.id} lead={l} compact />)}
            </div>
          </details>
        )}
      </div>
      <DragOverlay>
        {activeLead && <LeadCard lead={activeLead} compact />}
      </DragOverlay>
    </DndContext>
  )
}
