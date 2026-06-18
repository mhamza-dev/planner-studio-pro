import React from 'react'
import { motion } from 'framer-motion'
import { Download, Trash2, FileText, FileImage, Clock } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/Misc'
import { useExportStore } from '@/store/exportStore'
import type { ExportFormat } from '@/types'
import { cn } from '@/utils/cn'

const FORMAT_ICONS: Record<ExportFormat, React.ReactNode> = {
  pdf: <FileText size={16} />,
  png: <FileImage size={16} />,
  jpg: <FileImage size={16} />,
}

const FORMAT_COLORS: Record<ExportFormat, string> = {
  pdf: 'text-red-600 bg-red-50',
  png: 'text-blue-600 bg-blue-50',
  jpg: 'text-amber-600 bg-amber-50',
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '—'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  if (diff < 60000) return 'just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`
  return new Date(isoString).toLocaleDateString()
}

export default function DownloadsPage() {
  const { downloads, deleteDownload } = useExportStore()

  return (
    <div className="flex flex-col h-full">
      <TopBar
        title="Downloads"
        subtitle={`${downloads.length} exported file${downloads.length !== 1 ? 's' : ''}`}
        actions={
          downloads.length > 0 ? (
            <Button variant="ghost" size="sm" onClick={() => {}}>
              Clear all
            </Button>
          ) : undefined
        }
      />

      <div className="flex-1 overflow-auto p-6">
        {downloads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <EmptyState
              icon={<Download size={32} />}
              title="No downloads yet"
              description="Export a planner from the Builder to see your download history here."
            />
          </div>
        ) : (
          <div className="space-y-2 max-w-2xl">
            {downloads.map((dl, i) => (
              <motion.div
                key={dl.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 bg-paper rounded-xl border border-border p-4 group hover:shadow-card transition-all"
              >
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', FORMAT_COLORS[dl.format])}>
                  {FORMAT_ICONS[dl.format]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-primary truncate">{dl.plannerName}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="secondary" size="sm">{dl.format.toUpperCase()}</Badge>
                    <span className="text-xs text-secondary flex items-center gap-1">
                      <Clock size={10} />
                      {timeAgo(dl.createdAt)}
                    </span>
                    {dl.fileSize > 0 && (
                      <span className="text-xs text-secondary">{formatBytes(dl.fileSize)}</span>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => deleteDownload(dl.id)}
                  className="opacity-0 group-hover:opacity-100 text-secondary hover:text-red-500 transition-all"
                  aria-label="Remove from history"
                >
                  <Trash2 size={14} />
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
