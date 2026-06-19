'use client'

import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import type { GenerateRequest, GeneratedOutput } from '@/types'

interface UseGenerateReturn {
  output: GeneratedOutput | null
  streaming: boolean
  streamText: string
  generate: (req: GenerateRequest) => Promise<GeneratedOutput | null>
  reset: () => void
}

export function useGenerate(): UseGenerateReturn {
  const [output, setOutput] = useState<GeneratedOutput | null>(null)
  const [streaming, setStreaming] = useState(false)
  const [streamText, setStreamText] = useState('')

  const generate = useCallback(async (req: GenerateRequest): Promise<GeneratedOutput | null> => {
    setStreaming(true)
    setOutput(null)
    setStreamText('')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      })

      if (!res.ok) {
        const err = await res.json() as { error: string }
        throw new Error(err.error ?? 'Generation failed')
      }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        accumulated += chunk
        setStreamText(accumulated)
      }

      const parsed = JSON.parse(accumulated.trim()) as GeneratedOutput
      setOutput(parsed)
      return parsed
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Generation failed')
      return null
    } finally {
      setStreaming(false)
    }
  }, [])

  const reset = useCallback(() => {
    setOutput(null)
    setStreamText('')
  }, [])

  return { output, streaming, streamText, generate, reset }
}
