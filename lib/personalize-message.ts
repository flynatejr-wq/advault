import { anthropic } from './anthropic'

export async function personalizeMessage(
  body: string,
  lead: { name: string; product_interest: string; score: number | null }
): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 400,
    messages: [{
      role: 'user',
      content: `Personalize this follow-up message for ${lead.name} who is interested in ${lead.product_interest} life insurance (lead score: ${lead.score ?? 'unknown'}/10). Keep the same meaning and length. Only return the personalized message text, nothing else.\n\nOriginal:\n${body}`,
    }],
  })
  const block = message.content[0]
  return block.type === 'text' ? block.text : body
}
