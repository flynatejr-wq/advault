const AGENCIES = ['Summit Life Group', 'ProvidenceAds', 'Apex Insurance Marketing', 'BluePeak Advisors']

export function SocialProof() {
  return (
    <section className="border-y border-white/[0.06] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <p className="text-center text-text-tertiary text-xs uppercase tracking-widest mb-6">Trusted by independent agencies</p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {AGENCIES.map((name) => (
            <span key={name} className="text-text-tertiary font-medium text-sm opacity-60 hover:opacity-100 transition-opacity">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
