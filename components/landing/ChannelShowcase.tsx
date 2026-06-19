const SAMPLES = [
  {
    channel: 'Social',
    label: 'Facebook Ad',
    type: 'social' as const,
    headline: 'Your family deserves protection — starting at $12/mo',
    body: 'Life happens fast. As a parent, you want to know your kids will be taken care of no matter what. Our no-exam term life policy starts at just $12/month. Get your free quote in 60 seconds.',
    cta: 'Get your free quote →',
  },
  {
    channel: 'Google',
    label: 'Search Ad',
    type: 'google' as const,
    headlines: ['Term Life From $12/Mo', 'No Medical Exam Required', 'Instant Online Approval'],
    description: 'Protect your family today. No exam, no hassle, coverage from $12/mo. Get your free quote in 60 seconds.',
  },
  {
    channel: 'Email',
    label: 'Email Campaign',
    type: 'email' as const,
    subject: "A quick question about your family's future",
    preview: "If something happened to you tomorrow, would they be okay?",
    snippet: "We know it's not easy to think about. But the families who act today...",
  },
]

export function ChannelShowcase() {
  return (
    <section className="py-24 px-4 bg-bg-secondary/30" id="demo">
      <div className="max-w-5xl mx-auto">
        <p className="text-label text-accent text-center mb-3">Sample output</p>
        <h2 className="text-3xl font-semibold heading-display text-center text-text-primary mb-4">
          Real copy, generated in seconds
        </h2>
        <p className="text-text-secondary text-center mb-12 max-w-lg mx-auto text-sm">
          Every campaign includes copy for all three channels, ready to paste and launch.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SAMPLES.map((sample) => (
            <div key={sample.channel} className="bg-bg-secondary border border-white/[0.08] rounded-card p-5 flex flex-col gap-3">
              <span className="text-label text-accent">{sample.channel}</span>
              <p className="text-text-secondary text-xs">{sample.label}</p>
              {sample.type === 'social' && (
                <>
                  <p className="font-semibold text-text-primary text-sm">{sample.headline}</p>
                  <p className="text-text-secondary text-xs leading-relaxed">{sample.body}</p>
                  <span className="text-accent text-xs font-medium">{sample.cta}</span>
                </>
              )}
              {sample.type === 'google' && (
                <div className="flex flex-col gap-1.5">
                  {sample.headlines!.map((h, i) => (
                    <div key={i} className="bg-bg-tertiary rounded px-2 py-1 text-xs text-text-primary font-medium">{h}</div>
                  ))}
                  <p className="text-text-tertiary text-xs mt-1 leading-relaxed">{sample.description}</p>
                </div>
              )}
              {sample.type === 'email' && (
                <div className="flex flex-col gap-2">
                  <div className="bg-bg-tertiary rounded px-2 py-1.5">
                    <p className="text-text-tertiary text-[10px] uppercase tracking-wider mb-0.5">Subject</p>
                    <p className="text-text-primary text-xs font-medium">{sample.subject}</p>
                  </div>
                  <div className="bg-bg-tertiary rounded px-2 py-1.5">
                    <p className="text-text-tertiary text-[10px] uppercase tracking-wider mb-0.5">Preview</p>
                    <p className="text-text-secondary text-xs">{sample.preview}</p>
                  </div>
                  <p className="text-text-tertiary text-xs leading-relaxed">{sample.snippet}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
