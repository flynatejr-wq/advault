'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { AnalyticsKPIs, LeadsOverTime, LeadsByProduct, PipelineFunnel } from '@/types'

export default function AnalyticsPage() {
  const [kpis, setKpis] = useState<AnalyticsKPIs | null>(null)
  const [leadsOverTime, setLeadsOverTime] = useState<LeadsOverTime[]>([])
  const [byProduct, setByProduct] = useState<LeadsByProduct[]>([])
  const [funnel, setFunnel] = useState<PipelineFunnel[]>([])
  const [days, setDays] = useState(30)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch('/api/analytics/kpis').then(r => r.json()),
      fetch(`/api/analytics/leads-over-time?days=${days}`).then(r => r.json()),
      fetch('/api/analytics/leads-by-product').then(r => r.json()),
      fetch('/api/analytics/pipeline-funnel').then(r => r.json()),
    ]).then(([k, lot, bp, pf]) => {
      setKpis(k)
      setLeadsOverTime(lot)
      setByProduct(bp)
      setFunnel(pf)
      setLoading(false)
    })
  }, [days])

  const kpiCards = kpis ? [
    { label: 'Total Leads', value: kpis.total_leads.toLocaleString() },
    { label: 'This Month', value: kpis.leads_this_month.toLocaleString() },
    { label: 'Conversion Rate', value: `${kpis.conversion_rate}%` },
    { label: 'Total Revenue', value: `$${kpis.total_revenue.toLocaleString()}` },
    { label: 'Avg Deal Value', value: `$${kpis.avg_deal_value.toLocaleString()}` },
    { label: 'Hot Leads', value: kpis.hot_leads.toLocaleString() },
  ] : []

  const maxFunnelCount = funnel.reduce((m, f) => Math.max(m, f.count), 1)

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Analytics</h1>
        <select
          value={days}
          onChange={e => setDays(Number(e.target.value))}
          className="text-sm bg-surface-raised border border-border rounded-lg px-3 py-1.5 text-text-primary"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {loading ? (
        <div className="text-text-tertiary">Loading analytics...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {kpiCards.map(card => (
              <div key={card.label} className="bg-surface-raised border border-border rounded-xl p-5">
                <p className="text-xs text-text-tertiary uppercase tracking-wider mb-1">{card.label}</p>
                <p className="text-2xl font-bold text-text-primary">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-surface-raised border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-text-secondary mb-4">Leads Over Time</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={leadsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} />
                <Tooltip contentStyle={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: 8 }} />
                <Line type="monotone" dataKey="count" stroke="var(--color-accent)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-raised border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-text-secondary mb-4">Leads by Product</h2>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={byProduct} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} />
                  <YAxis type="category" dataKey="product" tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} width={120} />
                  <Tooltip contentStyle={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: 8 }} />
                  <Bar dataKey="count" fill="var(--color-accent)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-surface-raised border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-text-secondary mb-4">Pipeline Funnel</h2>
              <div className="space-y-2">
                {funnel.map(f => (
                  <div key={f.stage}>
                    <div className="flex justify-between text-xs text-text-tertiary mb-0.5">
                      <span>{f.stage}</span>
                      <span>{f.count}</span>
                    </div>
                    <div className="h-5 bg-surface rounded overflow-hidden">
                      <div
                        className="h-full bg-accent rounded transition-all"
                        style={{ width: `${maxFunnelCount > 0 ? (f.count / maxFunnelCount) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
