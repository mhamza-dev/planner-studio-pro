import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ArrowRight, PenTool, BookOpen, Download, Settings, BarChart3, ShoppingBag, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { useUIStore } from '@/store/uiStore'
import { usePlannerStore } from '@/store/plannerStore'
import { PLANNER_TYPE_LABELS } from '@/lib/defaults'
import type { PlannerType } from '@/types'

interface CommandItem {
  id: string; label: string; description?: string
  icon: React.ReactNode; category: string; shortcut?: string
  action: () => void
}

export const CommandPalette: React.FC = () => {
  const { commandPaletteOpen, setCommandPaletteOpen, setCreateModalOpen, setExportModalOpen } = useUIStore()
  const { planners, setActivePlanner } = usePlannerStore()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (commandPaletteOpen) { setQuery(''); setActiveIndex(0); setTimeout(() => inputRef.current?.focus(), 50) }
  }, [commandPaletteOpen])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCommandPaletteOpen(!commandPaletteOpen) }
      if (e.key === 'Escape') setCommandPaletteOpen(false)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [commandPaletteOpen, setCommandPaletteOpen])

  const allItems = useMemo((): CommandItem[] => [
    { id: 'new', label: 'New Planner', description: 'Create a new planner', icon: <Plus size={14}/>, category: 'Actions', shortcut: 'N', action: () => { setCreateModalOpen(true); setCommandPaletteOpen(false) } },
    { id: 'export', label: 'Export Planner', description: 'Export current planner', icon: <Download size={14}/>, category: 'Actions', action: () => { setExportModalOpen(true); setCommandPaletteOpen(false) } },
    { id: 'nav-dash', label: 'Go to Dashboard', icon: <PenTool size={14}/>, category: 'Navigation', shortcut: 'G D', action: () => { navigate('/'); setCommandPaletteOpen(false) } },
    { id: 'nav-builder', label: 'Go to Builder', icon: <PenTool size={14}/>, category: 'Navigation', shortcut: 'G B', action: () => { navigate('/builder'); setCommandPaletteOpen(false) } },
    { id: 'nav-templates', label: 'Browse Templates', icon: <BookOpen size={14}/>, category: 'Navigation', action: () => { navigate('/templates'); setCommandPaletteOpen(false) } },
    { id: 'nav-analytics', label: 'View Analytics', icon: <BarChart3 size={14}/>, category: 'Navigation', action: () => { navigate('/analytics'); setCommandPaletteOpen(false) } },
    { id: 'nav-etsy', label: 'Etsy Tools', icon: <ShoppingBag size={14}/>, category: 'Navigation', action: () => { navigate('/etsy'); setCommandPaletteOpen(false) } },
    { id: 'nav-settings', label: 'Settings', icon: <Settings size={14}/>, category: 'Navigation', shortcut: 'G S', action: () => { navigate('/settings'); setCommandPaletteOpen(false) } },
    ...planners.map(p => ({
      id: `planner-${p.id}`, label: p.name,
      description: `${PLANNER_TYPE_LABELS[p.type as PlannerType] ?? p.type} · ${p.pages.length} pages`,
      icon: <PenTool size={14}/>, category: 'Planners',
      action: () => { setActivePlanner(p.id); navigate('/builder'); setCommandPaletteOpen(false) },
    })),
  ], [planners, navigate, setActivePlanner, setCommandPaletteOpen, setCreateModalOpen, setExportModalOpen])

  const filtered = query
    ? allItems.filter(i => i.label.toLowerCase().includes(query.toLowerCase()) || i.description?.toLowerCase().includes(query.toLowerCase()))
    : allItems

  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  const flatFiltered = Object.values(grouped).flat()

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, flatFiltered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter') { e.preventDefault(); flatFiltered[activeIndex]?.action() }
  }

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4">
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.12}}
            className="absolute inset-0 bg-primary/20 backdrop-blur-sm" onClick={() => setCommandPaletteOpen(false)}/>
          <motion.div initial={{opacity:0,scale:0.96,y:-8}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.96,y:-8}}
            transition={{duration:0.18,ease:[0.16,1,0.3,1]}}
            className="relative w-full max-w-lg bg-paper rounded-2xl border border-border shadow-modal overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search size={16} className="text-ink-faint shrink-0"/>
              <input ref={inputRef} value={query} onChange={e => { setQuery(e.target.value); setActiveIndex(0) }}
                onKeyDown={handleKey} placeholder="Search commands, planners, pages…"
                className="flex-1 text-sm text-primary placeholder:text-ink-faint bg-transparent focus:outline-none"/>
              <kbd className="text-[10px] text-ink-faint border border-border rounded px-1.5 py-0.5 font-mono">ESC</kbd>
            </div>

            <div className="max-h-80 overflow-y-auto py-2">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint px-4 py-1.5">{category}</p>
                  {items.map(item => {
                    const globalIndex = flatFiltered.indexOf(item)
                    return (
                      <button key={item.id} onClick={item.action}
                        onMouseEnter={() => setActiveIndex(globalIndex)}
                        className={cn(
                          'flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors',
                          globalIndex === activeIndex ? 'bg-surface-raised' : 'hover:bg-surface-raised/50'
                        )}
                      >
                        <span className="text-ink-muted shrink-0">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-primary truncate">{item.label}</div>
                          {item.description && <div className="text-xs text-ink-muted truncate">{item.description}</div>}
                        </div>
                        {item.shortcut
                          ? <kbd className="text-[10px] text-ink-faint border border-border rounded px-1.5 py-0.5 font-mono shrink-0">{item.shortcut}</kbd>
                          : <ArrowRight size={13} className="text-ink-faint shrink-0"/>
                        }
                      </button>
                    )
                  })}
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-10 text-ink-muted">
                  <Search size={20}/>
                  <p className="text-sm">No results for "{query}"</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
