import { createServerClient } from '@/lib/supabase/server'
import { PublicLeadForm } from './PublicLeadForm'
import { notFound } from 'next/navigation'

export default async function PublicLandingPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { utm_campaign?: string; utm_source?: string }
}) {
  const supabase = await createServerClient()
  const { data: page } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('slug', params.slug)
    .eq('active', true)
    .single()

  if (!page) notFound()

  return (
    <main className="min-h-screen bg-bg-primary flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <span className="text-accent font-bold text-xl tracking-tight">AdVault</span>
          <h1 className="heading-display mt-6">{page.headline}</h1>
          {page.subheadline && (
            <p className="text-text-secondary mt-3">{page.subheadline}</p>
          )}
        </div>
        <PublicLeadForm
          agentUserId={page.user_id}
          productType={page.product_type}
          ctaText={page.cta_text}
          slug={params.slug}
          utmCampaign={searchParams.utm_campaign}
          utmSource={searchParams.utm_source}
        />
        <p className="text-center text-text-tertiary text-xs mt-8">
          Powered by <span className="text-accent">AdVault</span>
        </p>
      </div>
    </main>
  )
}
