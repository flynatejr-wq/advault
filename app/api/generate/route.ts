import { NextResponse } from 'next/server'
import { anthropic } from '@/lib/anthropic'
import type { GenerateRequest, Channel } from '@/types'

const SYSTEM_PROMPT = `You are a direct-response copywriter specializing in life insurance lead generation. You write emotionally resonant, compliance-aware ad copy that drives quote requests. Return only valid JSON — no markdown, no preamble, no explanation.`

function buildUserPrompt(req: GenerateRequest): string {
  const channelInstructions = req.channels.map((ch: Channel) => {
    if (ch === 'social') return `"social": { "facebook_headline": "...", "facebook_body": "...", "instagram_caption": "...", "x_post": "..." }`
    if (ch === 'google') return `"google": { "headline1": "max 30 chars", "headline2": "max 30 chars", "headline3": "max 30 chars", "description1": "max 90 chars", "description2": "max 90 chars" }`
    if (ch === 'email') return `"email": { "subject_line": "...", "preview_text": "...", "body": "3-4 short paragraphs" }`
    return ''
  }).join(',\n  ')

  return `Generate ad copy for a life insurance campaign with these details:
- Product: ${req.product}
- Target audience: ${req.audience}
- Key selling points: ${req.sellingPoints || 'None provided'}
- Call to action: ${req.cta}
- Tone: ${req.tone}

Return a JSON object with ONLY these keys (no others):
{
  ${channelInstructions}
}

Make the copy emotionally resonant, specific to the audience, and compliance-aware (no guarantees of coverage, no misleading claims). The CTA "${req.cta}" must appear naturally in each ad.`
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as GenerateRequest

    if (!body.product || !body.audience || !body.tone || !body.channels?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserPrompt(body) }],
    })

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(new TextEncoder().encode(chunk.delta.text))
            }
          }
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (err) {
    console.error('[generate]', err)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
