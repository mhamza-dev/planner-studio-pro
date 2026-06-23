import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Copy, ChevronDown, ChevronRight, FolderPlus, Layers } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { usePlannerStore } from '@/store/plannerStore'
import type { Planner } from '@/types'
import { cn } from '@/utils/cn'

interface PagesPanelProps { planner: Planner }

export const PagesPanel: React.FC<PagesPanelProps> = ({ planner }) => {
  const {
    addPage, deletePage, duplicatePage, setActivePage, renamePage,
    activePageId, addSection, removeSection,
  } = usePlannerStore()

  const [editingPageId, setEditingPageId] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const [sectionsOpen, setSectionsOpen] = useState(false)

  const sorted = [...planner.pages].sort((a, b) => a.order - b.order)

  const startRename = (pageId: string, current: string) => {
    setEditingPageId(pageId)
    setEditingValue(current)
  }

  const commitRename = () => {
    if (editingPageId && editingValue.trim()) {
      renamePage(planner.id, editingPageId, editingValue.trim())
    }
    setEditingPageId(null)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-2.5 py-2 border-b border-border flex items-center justify-between shrink-0">
        <span className="text-xs font-semibold text-primary">Pages ({planner.pages.length})</span>
        <Button variant="ghost" size="icon-xs" onClick={() => addPage(planner.id)} title="Add page">
          <Plus size={13}/>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <AnimatePresence initial={false}>
          {sorted.map((page, i) => (
            <motion.div
              key={page.id}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <div
                onClick={() => setActivePage(page.id)}
                className={cn(
                  'group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors',
                  activePageId === page.id
                    ? 'bg-primary text-white'
                    : 'hover:bg-surface-raised text-ink-muted hover:text-primary',
                )}
              >
                {/* Mini paper thumbnail */}
                <div className={cn(
                  'w-8 h-11 rounded border shrink-0 flex flex-col items-stretch p-1 gap-0.5',
                  activePageId === page.id ? 'border-white/30 bg-white/10' : 'border-border bg-white',
                )}>
                  {[40, 80, 60, 80, 70, 40].map((w, j) => (
                    <div key={j} className={cn('rounded-sm', activePageId === page.id ? 'bg-white/40' : 'bg-ink-faint/30')}
                      style={{ height: '1.5px', width: `${w}%` }}/>
                  ))}
                </div>

                <div className="flex-1 min-w-0">
                  {editingPageId === page.id ? (
                    <input
                      autoFocus
                      value={editingValue}
                      onChange={e => setEditingValue(e.target.value)}
                      onBlur={commitRename}
                      onKeyDown={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') setEditingPageId(null) }}
                      onClick={e => e.stopPropagation()}
                      className="w-full text-xs bg-transparent border-b border-current outline-none font-medium"
                    />
                  ) : (
                    <div className="text-xs font-medium truncate" onDoubleClick={e => { e.stopPropagation(); startRename(page.id, page.title) }}>
                      {page.title}
                    </div>
                  )}
                  <div className={cn('text-[10px] mt-0.5', activePageId === page.id ? 'text-white/60' : 'text-ink-faint')}>
                    {page.blocks.filter(b => !b.hidden).length} blocks
                  </div>
                </div>

                {/* Actions (visible on hover / active) */}
                <div className={cn(
                  'flex items-center gap-0.5 transition-opacity',
                  activePageId === page.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                )}>
                  <button onClick={e => { e.stopPropagation(); duplicatePage(planner.id, page.id) }}
                    className={cn('p-0.5 rounded hover:opacity-70 transition-opacity', activePageId===page.id?'text-white':'text-ink-muted')}
                    title="Duplicate page"><Copy size={11}/></button>
                  <button onClick={e => { e.stopPropagation(); if (planner.pages.length > 1) deletePage(planner.id, page.id) }}
                    className={cn('p-0.5 rounded hover:opacity-70 transition-opacity', activePageId===page.id?'text-red-200':'text-red-400')}
                    disabled={planner.pages.length <= 1}
                    title="Delete page"><Trash2 size={11}/></button>
                </div>

                <span className={cn('text-[10px] shrink-0 tabular-nums', activePageId===page.id?'text-white/50':'text-ink-faint')}>{i+1}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sections */}
      <div className="border-t border-border shrink-0">
        <button onClick={() => setSectionsOpen(o => !o)}
          className="flex items-center gap-1.5 w-full px-3 py-2 text-xs font-medium text-ink-muted hover:text-primary transition-colors">
          {sectionsOpen ? <ChevronDown size={12}/> : <ChevronRight size={12}/>}
          <Layers size={12}/>
          Sections ({planner.sections.length})
        </button>
        {sectionsOpen && (
          <div className="px-2.5 pb-2 space-y-1">
            {planner.sections.map(s => (
              <div key={s.id} className="flex items-center gap-2 px-2 py-1 rounded-lg bg-surface-sunken">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }}/>
                <span className="text-xs text-primary flex-1 truncate">{s.name}</span>
                <button onClick={() => removeSection(planner.id, s.id)}
                  className="text-ink-faint hover:text-red-500 transition-colors p-0.5"><Trash2 size={10}/></button>
              </div>
            ))}
            <button onClick={() => { const n = prompt('Section name:'); if (n) addSection(planner.id, n) }}
              className="flex items-center gap-1 text-[10px] text-accent hover:underline px-1">
              <FolderPlus size={11}/> Add section
            </button>
          </div>
        )}
      </div>

      <div className="p-2 border-t border-border shrink-0">
        <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => addPage(planner.id)}>
          <Plus size={12}/> Add Page
        </Button>
      </div>
    </div>
  )
}
