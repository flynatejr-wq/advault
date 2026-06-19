const STEPS = [
  { n: 1, title: 'Fill the brief', desc: 'Enter your product, audience, tone, and call to action in under 2 minutes.' },
  { n: 2, title: 'Generate with AI', desc: 'Claude writes compliant, emotionally resonant copy across every channel instantly.' },
  { n: 3, title: 'Deploy & close', desc: 'Copy, paste, and launch. Track what works. Save every campaign to your history.' },
]

export function HowItWorks() {
  return (
    <section className="py-24 px-4" id="how-it-works">
      <div className="max-w-4xl mx-auto">
        <p className="text-label text-accent text-center mb-3">How it works</p>
        <h2 className="text-3xl font-semibold heading-display text-center text-text-primary mb-16">Three steps to launch-ready ads</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map(({ n, title, desc }) => (
            <div key={n} className="flex flex-col items-center text-center gap-4">
              <div className="w-10 h-10 rounded-full bg-accent-subtle border border-accent/30 flex items-center justify-center text-accent font-semibold text-sm">
                {n}
              </div>
              <h3 className="font-semibold text-text-primary">{title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
