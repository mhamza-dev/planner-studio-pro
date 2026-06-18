import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Copy } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { usePlannerStore } from '@/store/plannerStore'
import type { Planner } from '@/types'
import { cn } from '@/utils/cn'

interface PagesPanelProps {
  planner: Planner
}

export const PagesPanel: React.FC<PagesPanelProps> = ({ planner }) => {
  const { addPage, deletePage, setActivePage, activePageId, duplicatePlanner } = usePlannerStore()

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border flex items-center justify-between flex-shrink-0">
        <span className="text-xs font-semibold text-primary">Pages ({planner.pages.length})</span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => addPage(planner.id)}
          aria-label="Add page"
        >
          <Plus size={14} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {[...planner.pages].sort((a, b) => a.order - b.order).map((page, i) => (
          <motion.button
            key={page.id}
            layout
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            onClick={() => setActivePage(page.id)}
            className={cn(
              'w-full text-left flex items-center gap-2 p-2 rounded-lg text-xs transition-colors group',
              activePageId === page.id
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-background text-secondary hover:text-primary'
            )}
          >
            {/* Mini thumbnail */}
            <div
              className="w-8 h-11 rounded border border-border bg-white flex-shrink-0 flex items-center justify-center"
              style={{ fontSize: '6px', color: '#6B7280' }}
            >
              <div className="space-y-0.5 w-full px-1">
                <div className="h-0.5 bg-current rounded opacity-40" />
                <div className="h-0.5 bg-current rounded opacity-30" />
                <div className="h-0.5 bg-current rounded opacity-20" />
                <div className="h-0.5 bg-current rounded opacity-10" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{page.title}</div>
              <div className="text-[10px] opacity-60">{page.blocks.length} blocks</div>
            </div>

            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5">
              <button
                onClick={e => { e.stopPropagation(); deletePage(planner.id, page.id) }}
                className="p-0.5 rounded hover:text-red-500 transition-colors"
                aria-label="Delete page"
                disabled={planner.pages.length === 1}
              >
                <Trash2 size={11} />
              </button>
            </div>

            <span className="text-[10px] opacity-40 flex-shrink-0">{i + 1}</span>
          </motion.button>
        ))}
      </div>

      <div className="p-2 border-t border-border flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={() => addPage(planner.id)}
        >
          <Plus size={13} />
          Add Page
        </Button>
      </div>
    </div>
  )
}
