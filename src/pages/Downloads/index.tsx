import React from 'react'
import { motion } from 'framer-motion'
import { Download, Trash2, FileText, FileImage, Clock, HardDrive, Package } from 'lucide-react'
import { TopBar } from '@/components/layout/index'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/index'
import { EmptyState } from '@/components/ui/index'
import { useExportStore } from '@/store/exportStore'
import type { ExportFormat } from '@/types'
import { cn } from '@/utils/cn'

const FORMAT_ICON: Record<ExportFormat, React.ReactNode> = {
  pdf: <FileText size={16}/>,
  png: <FileImage size={16}/>,
  jpg: <FileImage size={16}/>,
}
const FORMAT_COLOR: Record<ExportFormat, string> = {
  pdf: 'bg-red-50 text-red-600',
  png: 'bg-blue-50 text-blue-600',
  jpg: 'bg-amber-50 text-amber-600',
}

function timeAgo(iso: string) {
  const d = Date.now() - new Date(iso).getTime()
  if (d < 60000) return 'just now'
  if (d < 3600000) return `${Math.floor(d/60000)}m ago`
  if (d < 86400000) return `${Math.floor(d/3600000)}h ago`
  if (d < 604800000) return `${Math.floor(d/86400000)}d ago`
  return new Date(iso).toLocaleDateString()
}

function fmtBytes(b: number) {
  if (!b) return '—'
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${(b/1024).toFixed(1)} KB`
  return `${(b/1048576).toFixed(1)} MB`
}

export default function DownloadsPage() {
  const { downloads, deleteDownload } = useExportStore()

  const totalExports = downloads.length
  const byFormat = downloads.reduce<Record<string,number>>((a,d) => { a[d.format]=(a[d.format]||0)+1; return a }, {})

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title="Downloads"
        subtitle={`${totalExports} export${totalExports !== 1 ? 's' : ''} in history`}
        actions={
          downloads.length > 0 ? (
            <Button variant="ghost" size="sm" onClick={() => downloads.forEach(d => deleteDownload(d.id))}>
              Clear all
            </Button>
          ) : undefined
        }
      />

      <div className="flex-1 overflow-auto p-6">
        {downloads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <EmptyState
              icon={<Download size={32}/>}
              title="No exports yet"
              description="Export a planner from the Builder to see your download history here."
            />
          </div>
        ) : (
          <div className="max-w-2xl space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {(['pdf','png','jpg'] as ExportFormat[]).map(fmt => (
                <div key={fmt} className="bg-paper rounded-xl border border-border p-4 text-center shadow-xs">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2', FORMAT_COLOR[fmt])}>
                    {FORMAT_ICON[fmt]}
                  </div>
                  <div className="text-xl font-bold text-primary">{byFormat[fmt] ?? 0}</div>
                  <div className="text-xs text-ink-muted uppercase tracking-wide">{fmt}</div>
                </div>
              ))}
            </div>

            {/* List */}
            <div className="space-y-2">
              {downloads.map((dl, i) => (
                <motion.div key={dl.id}
                  initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-4 bg-paper rounded-xl border border-border p-4 group hover:shadow-sm transition-all"
                >
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', FORMAT_COLOR[dl.format])}>
                    {FORMAT_ICON[dl.format]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-primary truncate">{dl.plannerName}</div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <Badge variant="secondary" size="xs">{dl.format.toUpperCase()}</Badge>
                      {dl.pageCount > 0 && (
                        <span className="text-[10px] text-ink-faint flex items-center gap-1">
                          <Package size={9}/> {dl.pageCount} page{dl.pageCount !== 1 ? 's' : ''}
                        </span>
                      )}
                      <span className="text-[10px] text-ink-faint flex items-center gap-1">
                        <Clock size={9}/> {timeAgo(dl.createdAt)}
                      </span>
                      {dl.fileSize > 0 && (
                        <span className="text-[10px] text-ink-faint flex items-center gap-1">
                          <HardDrive size={9}/> {fmtBytes(dl.fileSize)}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost" size="icon-xs"
                    onClick={() => deleteDownload(dl.id)}
                    className="opacity-0 group-hover:opacity-100 text-ink-faint hover:text-red-500 hover:bg-red-50 transition-all"
                    title="Remove from history"
                  >
                    <Trash2 size={13}/>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
