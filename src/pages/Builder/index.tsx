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
  const selectedBlock = page?.blocks.find(b => b.id === selectedBlockId) ?? null

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
        <div className="h-14 flex items-center px-6 border-b border-border bg-paper">
          <h1 className="text-sm font-semibold text-primary">Builder</h1>
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
          <div className="h-14 flex items-center gap-1.5 px-3 border-b border-border bg-paper shrink-0 toolbar-shadow">
            <Tooltip content="Dashboard"><Button variant="ghost" size="icon-sm" onClick={() => navigate('/')}><ChevronLeft size={15}/></Button></Tooltip>
            <div className="w-px h-5 bg-border mx-1"/>

            {/* Planner name — editable */}
            <input
              value={planner.name}
              onChange={e => usePlannerStore.getState().renamePlanner(planner.id, e.target.value)}
              className="text-sm font-semibold text-primary bg-transparent border-b border-transparent hover:border-border focus:border-accent focus:outline-none px-1 max-w-[180px] truncate"
            />

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

            <div className="w-px h-5 bg-border mx-1"/>

            {/* Zoom */}
            <Tooltip content="Zoom out"><Button variant="ghost" size="icon-sm" onClick={() => setPreviewZoom(previewZoom - 10)} disabled={previewZoom <= 25}><ZoomOut size={14}/></Button></Tooltip>
            <button onClick={() => setPreviewZoom(100)} className="text-xs font-mono text-ink-muted hover:text-primary w-12 text-center py-1 rounded hover:bg-surface-raised transition-colors">{previewZoom}%</button>
            <Tooltip content="Zoom in"><Button variant="ghost" size="icon-sm" onClick={() => setPreviewZoom(previewZoom + 10)} disabled={previewZoom >= 200}><ZoomIn size={14}/></Button></Tooltip>
            <Tooltip content="Reset zoom"><Button variant="ghost" size="icon-sm" onClick={() => setPreviewZoom(100)}><Maximize2 size={13}/></Button></Tooltip>

            <div className="w-px h-5 bg-border mx-1"/>

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

            <div className="w-px h-5 bg-border mx-1"/>
            <Button size="sm" onClick={() => setExportModalOpen(true)}><Download size={14}/> Export</Button>
          </div>
        )}

        {/* ── 3-panel layout ─────────────────────────────────────────────── */}
        <div className="flex-1 flex overflow-hidden">

          {/* Left: Blocks + Pages */}
          {!focusMode && (
            <div className="w-56 shrink-0 border-r border-border bg-paper flex flex-col overflow-hidden">
              <Tabs value={activeTab} onChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <div className="px-2 py-1.5 border-b border-border shrink-0">
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

          {/* Centre: Canvas */}
          <div className="flex-1 overflow-auto bg-canvas" onClick={e => { if (e.target === e.currentTarget) setSelectedBlock(null) }}>
            {page ? (
              <BuilderCanvas
                page={page} config={planner.config} plannerId={planner.id}
                pageRefs={pageRefs}
                pageIndex={planner.pages.findIndex(p => p.id === page.id)}
              />
            ) : (
              <div className="flex items-center justify-center h-full"><LoadSpinner size="lg"/></div>
            )}
          </div>

          {/* Right: Block / Planner settings */}
          {!focusMode && (
            <div className="w-60 shrink-0 border-l border-border bg-paper flex flex-col overflow-hidden">
              <div className="h-10 flex items-center px-3 border-b border-border shrink-0 justify-between">
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
                {selectedBlock && page ? (
                  <BlockProperties key={selectedBlock.id} block={selectedBlock} plannerId={planner.id} pageId={page.id}/>
                ) : (
                  <PlannerConfigPanel planner={planner}/>
                )}
              </div>
            </div>
          )}

          {/* Focus mode exit button */}
          {focusMode && (
            <button onClick={toggleFocusMode}
              className="fixed bottom-4 right-4 z-50 bg-primary text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-float hover:bg-primary-800 transition-colors">
              Exit Focus Mode
            </button>
          )}
        </div>
      </div>

      <ExportModal open={exportModalOpen} onClose={() => setExportModalOpen(false)} pageRefs={pageRefs as React.RefObject<HTMLElement[]>}/>
    </DndProvider>
  )
}
