import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function PortalPage({ params }: { params: { token: string } }) {
  const supabase = createClient()

  const { data: portal } = await supabase
    .from('client_portals')
    .select('*, client_documents(*), leads(name, email)')
    .eq('portal_token', params.token)
    .eq('active', true)
    .single()

  if (!portal) notFound()

  const lead = portal.leads as { name: string; email: string }

  return (
    <div className="min-h-screen bg-surface py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary">Welcome, {lead.name}</h1>
          <p className="text-text-secondary mt-1 text-sm">Your insurance policy information</p>
        </div>

        <div className="bg-surface-raised border border-border rounded-xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-text-secondary mb-4 uppercase tracking-wider">Policy Details</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Policy Type', value: portal.policy_type },
              { label: 'Policy Number', value: portal.policy_number },
              { label: 'Carrier', value: portal.carrier },
              { label: 'Coverage Amount', value: portal.coverage_amount },
              { label: 'Monthly Premium', value: portal.monthly_premium },
              { label: 'Policy Start Date', value: portal.policy_start_date },
            ].filter(f => f.value).map(field => (
              <div key={field.label}>
                <p className="text-xs text-text-tertiary">{field.label}</p>
                <p className="text-sm font-medium text-text-primary mt-0.5">{field.value}</p>
              </div>
            ))}
          </div>
          {portal.notes && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-text-tertiary mb-1">Notes</p>
              <p className="text-sm text-text-secondary">{portal.notes}</p>
            </div>
          )}
        </div>

        {portal.client_documents && portal.client_documents.length > 0 && (
          <div className="bg-surface-raised border border-border rounded-xl p-6">
            <h2 className="text-sm font-semibold text-text-secondary mb-4 uppercase tracking-wider">Documents</h2>
            <div className="space-y-3">
              {(portal.client_documents as Array<{ id: string; name: string; description: string | null; file_url: string; file_type: string | null }>).map(doc => (
                <a
                  key={doc.id}
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border border-border rounded-lg hover:border-accent/50 transition-colors"
                >
                  <div className="w-8 h-8 bg-accent/10 rounded flex items-center justify-center text-accent text-xs font-bold">
                    {doc.file_type?.toUpperCase().slice(0, 3) || 'DOC'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{doc.name}</p>
                    {doc.description && <p className="text-xs text-text-tertiary">{doc.description}</p>}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
