'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdBlockProps {
  label: string
  value: string
  maxLength?: number
  multiline?: boolean
}

export function AdBlock({ label, value, maxLength, multiline }: AdBlockProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const overLimit = maxLength !== undefined && value.length > maxLength

  return (
    <div className="bg-bg-tertiary border border-white/[0.08] rounded-lg p-3 group">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-label">{label}</span>
        <div className="flex items-center gap-2">
          {maxLength !== undefined && (
            <span className={cn('text-xs tabular-nums', overLimit ? 'text-danger' : 'text-text-tertiary')}>
              {value.length}/{maxLength}
            </span>
          )}
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-all duration-150"
          >
            {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <p className={cn('text-text-primary text-sm', multiline && 'whitespace-pre-wrap')}>{value}</p>
    </div>
  )
}
