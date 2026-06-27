import React, { useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {
  ChevronLeft, Download, ZoomIn, ZoomOut, Maximize2,
  Layers, Undo2, Redo2, Grid3X3, Settings2, Blocks,
  FileSliders, Keyboard, Focus, Eye, EyeOff, Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/index'
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/index'
import { Spinner as LoadSpinner, EmptyState } from '@/components/ui/index'
import { usePlannerStore } from '@/store/plannerStore'
import { useUIStore } from '@/store/uiStore'
import { BuilderCanvas } from '@/features/builder/BuilderCanvas'
import { BlockPalette } from '@/features/builder/BlockPalette'
import { BlockProperties } from '@/features/builder/BlockProperties'
import { PlannerConfigPanel } from '@/features/builder/PlannerConfigPanel'
import { PagesPanel } from '@/features/builder/PagesPanel'
import { ExportModal } from '@/features/export/ExportModal'
import { CreatePlannerModal } from '@/features/dashboard/CreatePlannerModal'
import { DEFAULT_BLOCK_STYLE, getDefaultBlockConfig } from '@/lib/defaults'
import type { BlockType } from '@/types'
import { cn } from '@/utils/cn'

export default function BuilderPage() {
  const navigate = useNavigate()
  const {
    getActivePlanner, getActivePage, setSelectedBlock, selectedBlockId,
    addBlock, undo, redo, canUndo, canRedo, isDirty, markSaved,
    setActivePage, activePageId,
  } = usePlannerStore()
  const {
    previewZoom, setPreviewZoom, showGrid, setShowGrid,
    exportModalOpen, setExportModalOpen, setCreateModalOpen,
    activeTab, setActiveTab, focusMode, toggleFocusMode,
    setShortcutsModalOpen, toast,
  } = useUIStore()

  const planner = getActivePlanner()
  const page = getActivePage()
  const pageRefs = useRef<HTMLElement[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const pageAnchorRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const isScrollingFromPanel = useRef(false)
  const selectedBlockPage = selectedBlockId && planner
    ? planner.pages.find(pg => pg.blocks.some(b => b.id === selectedBlockId))
    : null
  const selectedBlock = selectedBlockPage?.blocks.find(b => b.id === selectedBlockId) ?? null
  const sortedPages = planner ? [...planner.pages].sort((a, b) => a.order - b.order) : []

  // Auto-save every 30s when dirty
  useEffect(() => {
    if (!isDirty) return
    const t = setTimeout(() => markSaved(), 30000)
    return () => clearTimeout(t)
  }, [isDirty, markSaved])

  // Keyboard shortcuts
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey
      if (!planner) return
      if (meta && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(planner.id) }
      if (meta && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(planner.id) }
      if (meta && e.key === 'e') { e.preventDefault(); setExportModalOpen(true) }
      if (meta && e.key === '=') { e.preventDefault(); setPreviewZoom(previewZoom + 10) }
      if (meta && e.key === '-') { e.preventDefault(); setPreviewZoom(previewZoom - 10) }
      if (e.key === 'Escape') setSelectedBlock(null)
      if (e.key === '?' && !meta) setShortcutsModalOpen(true)
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [planner, undo, redo, previewZoom, setPreviewZoom, setSelectedBlock, setExportModalOpen, setShortcutsModalOpen])

  // Scroll canvas to active page when selected from the pages panel
  useEffect(() => {
    if (!activePageId || !scrollRef.current) return
    const anchor = pageAnchorRefs.current.get(activePageId)
    if (!anchor) return

    const container = scrollRef.current
    const containerRect = container.getBoundingClientRect()
    const anchorRect = anchor.getBoundingClientRect()
    const visible = anchorRect.top >= containerRect.top + 40 && anchorRect.bottom <= containerRect.bottom - 40
    if (!visible) {
      isScrollingFromPanel.current = true
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' })
      window.setTimeout(() => { isScrollingFromPanel.current = false }, 600)
    }
  }, [activePageId])

  // Update active page while scrolling through stacked canvases
  useEffect(() => {
    if (!planner || !scrollRef.current) return
    const container = scrollRef.current

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingFromPanel.current) return
        const best = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        const pageId = best?.target.getAttribute('data-page-id')
        if (pageId && pageId !== usePlannerStore.getState().activePageId) setActivePage(pageId)
      },
      { root: container, threshold: [0.35, 0.5, 0.65] },
    )

    sortedPages.forEach(pg => {
      const anchor = pageAnchorRefs.current.get(pg.id)
      if (anchor) observer.observe(anchor)
    })

    return () => observer.disconnect()
  }, [planner?.id, sortedPages.length, setActivePage])

  const handleAddBlock = useCallback((blockType: BlockType) => {
    if (!planner || !page) return
    addBlock(planner.id, page.id, {
      type: blockType,
      label: blockType.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      order: page.blocks.length,
      style: { ...DEFAULT_BLOCK_STYLE },
      config: getDefaultBlockConfig(blockType),
      locked: false, hidden: false,
    })
  }, [planner, page, addBlock])

  if (!planner) {
    return (
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center px-6 border-b border-white/70 bg-white/80 backdrop-blur-xl toolbar-shadow">
          <h1 className="text-lg font-bold text-primary font-display">Builder</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={<Blocks size={32}/>}
            title="No planner open"
            description="Create a new planner or open one from the Dashboard to start building."
            action={
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                  <ChevronLeft size={14}/> Dashboard
                </Button>
                <Button size="sm" onClick={() => setCreateModalOpen(true)}>
                  <Plus size={14}/> New Planner
                </Button>
              </div>
            }
          />
        </div>
        <CreatePlannerModal/>
      </div>
    )
  }

  const canUndoNow = canUndo(planner.id)
  const canRedoNow = canRedo(planner.id)

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={cn('flex flex-col h-full overflow-hidden', focusMode && 'focus-mode')}>

        {/* ── Toolbar ─────────────────────────────────────────────────────── */}
        {!focusMode && (
          <div className="h-16 flex items-center gap-1.5 px-4 border-b border-white/70 bg-white/85 backdrop-blur-xl shrink-0 toolbar-shadow">
            <Tooltip content="Dashboard"><Button variant="ghost" size="icon-sm" onClick={() => navigate('/')}><ChevronLeft size={15}/></Button></Tooltip>
            <div className="w-px h-6 bg-border mx-1"/>

            {/* Planner name — editable */}
            <div className="min-w-0">
              <input
                value={planner.name}
                onChange={e => usePlannerStore.getState().renamePlanner(planner.id, e.target.value)}
                className="text-sm font-bold text-primary bg-transparent border-b border-transparent hover:border-border focus:border-accent focus:outline-none px-1 max-w-[220px] truncate font-display"
              />
              <div className="text-[10px] text-ink-faint px-1 capitalize">{planner.type.replace(/-/g, ' ')}</div>
            </div>

            {/* Auto-save indicator */}
            <span className="text-[10px] text-ink-faint ml-1">
              {isDirty ? '● unsaved' : '✓ saved'}
            </span>

            <div className="flex-1"/>

            {/* Undo/Redo */}
            <Tooltip content="Undo (Ctrl+Z)">
              <Button variant="ghost" size="icon-sm" onClick={() => undo(planner.id)} disabled={!canUndoNow}>
                <Undo2 size={14}/>
              </Button>
            </Tooltip>
            <Tooltip content="Redo (Ctrl+Y)">
              <Button variant="ghost" size="icon-sm" onClick={() => redo(planner.id)} disabled={!canRedoNow}>
                <Redo2 size={14}/>
              </Button>
            </Tooltip>

            <div className="w-px h-6 bg-border mx-1"/>

            {/* Zoom */}
            <Tooltip content="Zoom out"><Button variant="ghost" size="icon-sm" onClick={() => setPreviewZoom(previewZoom - 10)} disabled={previewZoom <= 25}><ZoomOut size={14}/></Button></Tooltip>
            <button onClick={() => setPreviewZoom(100)} className="text-xs font-mono text-ink-muted hover:text-primary w-12 text-center py-1 rounded hover:bg-surface-raised transition-colors">{previewZoom}%</button>
            <Tooltip content="Zoom in"><Button variant="ghost" size="icon-sm" onClick={() => setPreviewZoom(previewZoom + 10)} disabled={previewZoom >= 200}><ZoomIn size={14}/></Button></Tooltip>
            <Tooltip content="Reset zoom"><Button variant="ghost" size="icon-sm" onClick={() => setPreviewZoom(100)}><Maximize2 size={13}/></Button></Tooltip>

            <div className="w-px h-6 bg-border mx-1"/>

            {/* Canvas toggles */}
            <Tooltip content="Toggle grid">
              <Button variant={showGrid ? 'secondary' : 'ghost'} size="icon-sm" onClick={() => setShowGrid(!showGrid)}><Grid3X3 size={14}/></Button>
            </Tooltip>
            <Tooltip content="Focus mode">
              <Button variant="ghost" size="icon-sm" onClick={toggleFocusMode}><Focus size={14}/></Button>
            </Tooltip>
            <Tooltip content="Keyboard shortcuts (?)">
              <Button variant="ghost" size="icon-sm" onClick={() => setShortcutsModalOpen(true)}><Keyboard size={14}/></Button>
            </Tooltip>

            <div className="w-px h-6 bg-border mx-1"/>
            <Button size="sm" variant="accent" onClick={() => setExportModalOpen(true)}><Download size={14}/> Export</Button>
          </div>
        )}

        {/* ── 3-panel layout ─────────────────────────────────────────────── */}
        <div className="flex-1 flex overflow-hidden">

          {/* Left: Blocks + Pages */}
          {!focusMode && (
            <div className="w-60 shrink-0 border-r border-white/70 bg-white/75 backdrop-blur-xl flex flex-col overflow-hidden shadow-xs">
              <Tabs value={activeTab} onChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <div className="px-3 py-2 border-b border-white/70 shrink-0">
                  <TabList variant="segment" className="gap-0.5">
                    <Tab value="blocks" variant="segment"><Blocks size={12}/> Blocks</Tab>
                    <Tab value="pages" variant="segment"><Layers size={12}/> Pages</Tab>
                  </TabList>
                </div>
                <TabPanel value="blocks" className="flex-1 overflow-hidden flex flex-col">
                  <BlockPalette onAddBlock={handleAddBlock}/>
                </TabPanel>
                <TabPanel value="pages" className="flex-1 overflow-hidden flex flex-col">
                  {planner && <PagesPanel planner={planner}/>}
                </TabPanel>
              </Tabs>
            </div>
          )}

          {/* Centre: Canvas — all pages stacked for scroll navigation */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-auto bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,.09),transparent_28rem),linear-gradient(180deg,#EEF2F7,#E8EDF5)]"
            onClick={e => { if (e.target === e.currentTarget) setSelectedBlock(null) }}
          >
            {sortedPages.length > 0 ? (
              <div className="flex flex-col items-center gap-20 py-8">
                {sortedPages.map((pg, pageIndex) => (
                  <div
                    key={pg.id}
                    ref={el => {
                      if (el) pageAnchorRefs.current.set(pg.id, el)
                      else pageAnchorRefs.current.delete(pg.id)
                    }}
                    data-page-id={pg.id}
                    className="w-full scroll-mt-8"
                  >
                    <BuilderCanvas
                      page={pg}
                      config={planner.config}
                      plannerId={planner.id}
                      pageRefs={pageRefs}
                      pageIndex={pageIndex}
                      totalPages={sortedPages.length}
                      isActive={pg.id === activePageId}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full"><LoadSpinner size="lg"/></div>
            )}
          </div>

          {/* Right: Block / Planner settings */}
          {!focusMode && (
            <div className="w-64 shrink-0 border-l border-white/70 bg-white/75 backdrop-blur-xl flex flex-col overflow-hidden shadow-xs">
              <div className="h-12 flex items-center px-3 border-b border-white/70 shrink-0 justify-between">
                <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                  {selectedBlock ? <><Settings2 size={12}/> Block</> : <><FileSliders size={12}/> Settings</>}
                </span>
                {selectedBlock && (
                  <button onClick={() => setSelectedBlock(null)} className="text-[10px] text-ink-muted hover:text-primary transition-colors">
                    deselect ✕
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                {selectedBlock && selectedBlockPage ? (
                  <BlockProperties key={selectedBlock.id} block={selectedBlock} plannerId={planner.id} pageId={selectedBlockPage.id}/>
                ) : (
                  <PlannerConfigPanel planner={planner}/>
                )}
              </div>
            </div>
          )}

          {/* Focus mode exit button */}
          {focusMode && (
            <button onClick={toggleFocusMode}
              className="fixed bottom-4 right-4 z-50 bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-float hover:bg-primary-800 transition-colors">
              Exit Focus Mode
            </button>
          )}
        </div>
      </div>

      <ExportModal open={exportModalOpen} onClose={() => setExportModalOpen(false)} pageRefs={pageRefs as React.RefObject<HTMLElement[]>}/>
    </DndProvider>
  )
}
