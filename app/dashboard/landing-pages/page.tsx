'use client'
import { useState } from 'react'
import { useLandingPages } from '@/hooks/useLandingPages'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { CreatePageModal } from '@/components/landing-pages/CreatePageModal'
import type { LandingPage } from '@/types'
import { PRODUCT_LABELS } from '@/types'
import { Copy, Check, Trash2, ExternalLink, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LandingPagesPage() {
  const { pages, loading, deletePage } = useLandingPages()
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<LandingPage | null>(null)
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  function copyLink(slug: string) {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const url = `${process.env.NEXT_PUBLIC_APP_URL ?? origin}/l/${slug}`
    navigator.clipboard.writeText(url)
    setCopiedSlug(slug)
    toast.success('Link copied')
    setTimeout(() => setCopiedSlug(null), 1500)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    await deletePage(deleteTarget.slug)
    setDeleteTarget(null)
    setDeleting(false)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="heading-display">Landing pages</h1>
          <p className="text-text-secondary text-sm mt-1">
            Share these links in your ads to collect leads
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create page
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-bg-secondary rounded-card animate-pulse" />
          ))}
        </div>
      ) : pages.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-3xl mb-3">🔗</p>
            <p className="text-text-primary font-medium">No landing pages yet</p>
            <p className="text-text-secondary text-sm mt-1">
              Create a landing page to start collecting leads from your ads.
            </p>
            <Button className="mt-4" onClick={() => setCreateOpen(true)}>
              Create your first page
            </Button>
          </div>
        </Card>
      ) : (
        <Card noPadding>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                {['Page', 'Product', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-text-secondary font-medium px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pages.map((page, i) => (
                <tr
                  key={page.id}
                  className={i < pages.length - 1 ? 'border-b border-white/[0.06]' : ''}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-text-primary font-mono text-xs">/l/{page.slug}</span>
                      <a
                        href={`/l/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-secondary hover:text-text-primary transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-text-secondary text-xs mt-0.5 truncate max-w-[200px]">
                      {page.headline}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {page.product_type ? PRODUCT_LABELS[page.product_type] : 'All products'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={page.active ? 'success' : 'default'}>
                      {page.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyLink(page.slug)}
                        className="text-text-secondary hover:text-text-primary transition-colors"
                        title="Copy link"
                      >
                        {copiedSlug === page.slug
                          ? <Check className="w-4 h-4 text-success" />
                          : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setDeleteTarget(page)}
                        className="text-text-secondary hover:text-danger transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <CreatePageModal open={createOpen} onClose={() => setCreateOpen(false)} />

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete landing page">
        <p className="text-text-secondary mt-4">
          Delete{' '}
          <span className="text-text-primary font-mono">/l/{deleteTarget?.slug}</span>?
          Existing leads from this page will not be affected.
        </p>
        <div className="flex gap-3 mt-6">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)} className="flex-1">
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting} className="flex-1">
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}
