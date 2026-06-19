import { anthropic } from './anthropic'
import type { LeadSubmitRequest, VettingResult, LeadProductType } from '@/types'
import { PRODUCT_LABELS } from '@/types'

const PRODUCT_DESCRIPTIONS: Record<LeadProductType, string> = {
  mortgage_protection: 'covers mortgage payments if the policyholder dies, ensuring the family keeps the home',
  iul: 'builds cash value tied to a market index with a floor, providing both protection and growth',
  final_expense: 'covers burial and end-of-life costs, typically $5k–$25k face value, simplified underwriting',
  term_life: 'pure death benefit for a set term (10/20/30 years), most affordable option',
  whole_life: 'permanent coverage with guaranteed cash value growth, higher premiums',
}

export async function vetLead(lead: LeadSubmitRequest): Promise<VettingResult> {
  const productLabel = PRODUCT_LABELS[lead.product_interest]
  const productDesc = PRODUCT_DESCRIPTIONS[lead.product_interest]

  const prompt = `You are an expert life insurance sales coach scoring a lead for a life insurance agent.

Lead details:
- Name: ${lead.name}
- Product interest: ${productLabel} (${productDesc})
- Coverage amount desired: ${lead.coverage_amount ?? 'not specified'}
- Age: ${lead.age ?? 'not specified'}
- Health status: ${lead.health_status ?? 'not specified'}
- Urgency: ${lead.urgency ?? 'not specified'}

Score this lead from 1-10 based on:
- Urgency (immediately = high score, just researching = lower)
- Coverage amount (higher = more motivated)
- Age and health (younger/healthier = easier to insure, older/poor health = harder but still valuable for final expense)
- Specificity of interest (specific product = higher intent)

Also write a personalized 5-step call script the agent should use when calling this lead. The script should:
1. Open with their name and reference their specific interest
2. Confirm the details they submitted
3. Ask 2-3 qualifying questions
4. Explain the product benefit specific to their situation
5. Close with a next step (meeting, quote, etc.)

Return ONLY valid JSON in this exact format:
{
  "score": <number 1-10>,
  "score_reason": "<one sentence explaining the score>",
  "ai_script": "<full call script, use \\n for line breaks between steps>"
}`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 800,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('AI vetting returned invalid JSON')

  const result = JSON.parse(jsonMatch[0]) as VettingResult
  return result
}
