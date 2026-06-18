import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
// motion unused in Builder
import {
  Download, ZoomIn, ZoomOut, Maximize2, Settings2,
  Layers, Blocks, ChevronLeft, Plus, FileSliders
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs'
import { LoadingSpinner, EmptyState } from '@/components/ui/Misc'
import { usePlannerStore } from '@/store/plannerStore'
import { useUIStore } from '@/store/uiStore'
import { BuilderCanvas } from '@/features/builder/BuilderCanvas'
import { BlockPalette } from '@/features/builder/BlockPalette'
import { BlockProperties } from '@/features/builder/BlockProperties'
import { PlannerConfigPanel } from '@/features/builder/PlannerConfigPanel'
import { PagesPanel } from '@/features/builder/PagesPanel'
import { ExportModal } from '@/features/export/ExportModal'
import { CreatePlannerModal } from '@/features/dashboard/CreatePlannerModal'
import type { BlockType } from '@/types'
import { DEFAULT_BLOCK_STYLE } from '@/lib/defaults'

export default function BuilderPage() {
  const navigate = useNavigate()
  const {
    getActivePlanner, getActivePage, setSelectedBlock,
    selectedBlockId, addBlock,
  } = usePlannerStore()
  const { setCreateModalOpen } = useUIStore()
  const {
    previewZoom, setPreviewZoom, exportModalOpen, setExportModalOpen, activeTab, setActiveTab,
  } = useUIStore()

  const planner = getActivePlanner()
  const page = getActivePage()
  const pageRefs = useRef<HTMLElement[]>([])

  const selectedBlock = page?.blocks.find(b => b.id === selectedBlockId)

  const handleAddBlock = (blockType: BlockType) => {
    if (!planner || !page) return
    addBlock(planner.id, page.id, {
      type: blockType,
      label: blockType.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      order: page.blocks.length,
      style: { ...DEFAULT_BLOCK_STYLE },
      config: {},
      locked: false,
    })
  }

  if (!planner) {
    return (
      <div className="flex flex-col h-full">
        <div className="h-14 flex items-center px-6 border-b border-border bg-paper">
          <h1 className="text-base font-semibold text-primary">Builder</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={<Blocks size={32} />}
            title="No planner open"
            description="Create a new planner or open one from the Dashboard to start building."
            action={
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate('/')}>
                  <ChevronLeft size={15} />
                  Dashboard
                </Button>
                <Button onClick={() => setCreateModalOpen(true)}>
                  <Plus size={15} />
                  New Planner
                </Button>
              </div>
            }
          />
        </div>
        <CreatePlannerModal />
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Toolbar */}
        <div className="h-14 flex items-center gap-2 px-4 border-b border-border bg-paper flex-shrink-0 shadow-toolbar">
          <Button variant="ghost" size="icon-sm" onClick={() => navigate('/')} aria-label="Back">
            <ChevronLeft size={16} />
          </Button>

          <div className="h-5 w-px bg-border mx-1" />

          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-primary truncate">{planner.name}</div>
          </div>

          <div className="flex items-center gap-1">
            <Tooltip content="Zoom out">
              <Button variant="ghost" size="icon-sm" onClick={() => setPreviewZoom(previewZoom - 10)}>
                <ZoomOut size={15} />
              </Button>
            </Tooltip>
            <span className="text-xs font-mono text-secondary w-10 text-center">{previewZoom}%</span>
            <Tooltip content="Zoom in">
              <Button variant="ghost" size="icon-sm" onClick={() => setPreviewZoom(previewZoom + 10)}>
                <ZoomIn size={15} />
              </Button>
            </Tooltip>
            <Tooltip content="Fit to screen">
              <Button variant="ghost" size="icon-sm" onClick={() => setPreviewZoom(100)}>
                <Maximize2 size={15} />
              </Button>
            </Tooltip>
          </div>

          <div className="h-5 w-px bg-border mx-1" />

          <Button size="sm" onClick={() => setExportModalOpen(true)}>
            <Download size={15} />
            Export
          </Button>
        </div>

        {/* Main 3-panel layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left panel */}
          <div className="w-56 flex-shrink-0 border-r border-border bg-paper flex flex-col overflow-hidden">
            <Tabs value={activeTab} onChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
              <div className="border-b border-border flex-shrink-0">
                <TabList className="px-2 py-1.5 gap-0.5" variant="default">
                  <Tab value="blocks" variant="default">
                    <Blocks size={13} />
                    <span className="text-[11px]">Blocks</span>
                  </Tab>
                  <Tab value="pages" variant="default">
                    <Layers size={13} />
                    <span className="text-[11px]">Pages</span>
                  </Tab>
                </TabList>
              </div>
              <TabPanel value="blocks" className="flex-1 overflow-hidden flex flex-col">
                <BlockPalette onAddBlock={handleAddBlock} />
              </TabPanel>
              <TabPanel value="pages" className="flex-1 overflow-hidden flex flex-col">
                <PagesPanel planner={planner} />
              </TabPanel>
            </Tabs>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-auto bg-background relative" onClick={() => setSelectedBlock(null)}>
            {page ? (
              <BuilderCanvas
                page={page}
                config={planner.config}
                plannerId={planner.id}
                pageRefs={pageRefs}
                pageIndex={(planner.pages.findIndex(p => p.id === page.id))}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="w-56 flex-shrink-0 border-l border-border bg-paper flex flex-col overflow-hidden">
            <div className="h-10 flex items-center px-3 border-b border-border flex-shrink-0">
              <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                {selectedBlock ? (
                  <><Settings2 size={13} /> Block Settings</>
                ) : (
                  <><FileSliders size={13} /> Planner Settings</>
                )}
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              {selectedBlock && page ? (
                <BlockProperties
                  block={selectedBlock}
                  plannerId={planner.id}
                  pageId={page.id}
                />
              ) : (
                <PlannerConfigPanel planner={planner} />
              )}
            </div>
          </div>
        </div>
      </div>

      <ExportModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        pageRefs={pageRefs as React.RefObject<HTMLElement[]>}
      />
    </DndProvider>
  )
}
