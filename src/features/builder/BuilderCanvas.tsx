import React, { useCallback, useRef } from 'react'
import { useDrop, useDrag } from 'react-dnd'
import { Trash2, Copy, GripVertical, ChevronUp, ChevronDown } from 'lucide-react'
import { usePlannerStore } from '@/store/plannerStore'
import { useUIStore } from '@/store/uiStore'
import { DEFAULT_BLOCK_STYLE } from '@/lib/defaults'
import { PlannerBlockRenderer } from '@/components/planner/BlockRenderer'
import type { PlannerPage, PlannerConfig, BlockType, PlannerBlock } from '@/types'
import { cn } from '@/utils/cn'

// ─── Draggable block wrapper (for reordering blocks already on canvas) ───────
interface DraggableBlockProps {
  block: PlannerBlock
  index: number
  config: PlannerConfig
  plannerId: string
  pageId: string
  isSelected: boolean
  onSelect: (id: string) => void
  onReorder: (from: number, to: number) => void
}

function DraggableBlockWrapper({
  block, index, config, plannerId, pageId,
  isSelected, onSelect, onReorder,
}: DraggableBlockProps) {
  const { deleteBlock, duplicateBlock } = usePlannerStore()
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: 'CANVAS_BLOCK',
    item: { id: block.id, index },
    collect: m => ({ isDragging: m.isDragging() }),
  })

  const [{ isOver, dropPosition }, drop] = useDrop<
    { id: string; index: number },
    void,
    { isOver: boolean; dropPosition: 'top' | 'bottom' }
  >({
    accept: 'CANVAS_BLOCK',
    collect: m => ({
      isOver: m.isOver({ shallow: true }),
      dropPosition: (() => {
        const mon = m
        if (!mon.isOver({ shallow: true })) return 'bottom'
        const clientOffset = mon.getClientOffset()
        const el = ref.current
        if (!clientOffset || !el) return 'bottom'
        const { top, height } = el.getBoundingClientRect()
        return clientOffset.y < top + height / 2 ? 'top' : 'bottom'
      })(),
    }),
    hover(item) {
      if (!ref.current) return
      if (item.index === index) return
      onReorder(item.index, index)
      item.index = index
    },
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      onClick={e => { e.stopPropagation(); onSelect(block.id) }}
      style={{ opacity: isDragging ? 0.4 : 1 }}
      className={cn(
        'group relative transition-all duration-100 cursor-pointer',
        isSelected && 'ring-2 ring-inset ring-blue-400 rounded-sm',
        !isSelected && 'hover:ring-1 hover:ring-inset hover:ring-primary/20 rounded-sm',
      )}
    >
      {/* Top drop indicator */}
      {isOver && dropPosition === 'top' && (
        <div className="absolute -top-0.5 left-0 right-0 h-0.5 bg-blue-400 rounded-full z-20 pointer-events-none" />
      )}

      {/* Hover / selected toolbar */}
      <div className={cn(
        'absolute -top-7 right-0 z-30 flex items-center gap-0.5 bg-primary text-white rounded-t-md px-1 py-1 shadow-float',
        'transition-opacity duration-100',
        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
      )}>
        <div
          className="p-0.5 cursor-grab active:cursor-grabbing text-white/60 hover:text-white"
          title="Drag to reorder"
        >
          <GripVertical size={11} />
        </div>
        <button
          onClick={e => { e.stopPropagation(); duplicateBlock(plannerId, pageId, block.id) }}
          className="p-0.5 text-white/70 hover:text-white rounded"
          title="Duplicate"
        >
          <Copy size={11} />
        </button>
        <button
          onClick={e => { e.stopPropagation(); deleteBlock(plannerId, pageId, block.id) }}
          className="p-0.5 text-white/70 hover:text-red-300 rounded"
          title="Delete"
        >
          <Trash2 size={11} />
        </button>
      </div>

      {/* The actual rendered block */}
      <PlannerBlockRenderer block={block} config={config} />

      {/* Bottom drop indicator */}
      {isOver && dropPosition === 'bottom' && (
        <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-blue-400 rounded-full z-20 pointer-events-none" />
      )}
    </div>
  )
}

// ─── Main Canvas ─────────────────────────────────────────────────────────────
interface CanvasProps {
  page: PlannerPage
  config: PlannerConfig
  plannerId: string
  pageRefs: React.MutableRefObject<HTMLElement[]>
  pageIndex: number
}

export const BuilderCanvas: React.FC<CanvasProps> = ({
  page, config, plannerId, pageRefs, pageIndex,
}) => {
  const { addBlock, setSelectedBlock, selectedBlockId, reorderBlocks } = usePlannerStore()
  const { previewZoom } = useUIStore()

  // Drop zone for NEW blocks dragged from palette
  const [{ isOver, canDrop }, drop] = useDrop<
    { blockType: BlockType },
    void,
    { isOver: boolean; canDrop: boolean }
  >({
    accept: 'PALETTE_BLOCK',
    drop(item) {
      const label = item.blockType
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
      addBlock(plannerId, page.id, {
        type: item.blockType,
        label,
        order: page.blocks.length,
        style: { ...DEFAULT_BLOCK_STYLE },
        config: getDefaultConfig(item.blockType),
        locked: false,
      })
    },
    collect: m => ({ isOver: m.isOver(), canDrop: m.canDrop() }),
  })

  const pageRef = useCallback((el: HTMLElement | null) => {
    if (el) pageRefs.current[pageIndex] = el
  }, [pageIndex, pageRefs])

  const scale = previewZoom / 100
  const sortedBlocks = [...page.blocks].sort((a, b) => a.order - b.order)

  const isA4 = page.pageSize !== 'Letter'
  const aspectRatio = isA4 ? (210 / 297) : (8.5 / 11)

  return (
    <div
      className="flex items-start justify-center pt-8 pb-24 px-8 min-h-full"
      onClick={() => setSelectedBlock(null)}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: Math.min(680, 680 / scale),
          marginBottom: `${-(1 - scale) * 100 * 4}px`,
        }}
      >
        {/* Paper */}
        <div
          ref={drop as unknown as React.Ref<HTMLDivElement>}
          className={cn(
            'relative bg-white mx-auto shadow-paper',
            isOver && canDrop && 'ring-2 ring-blue-300 ring-offset-2',
          )}
          style={{
            width: '100%',
            aspectRatio: String(aspectRatio),
            fontFamily: config.fontFamily || 'Inter',
          }}
        >
          {/* Export-ref wrapper — exact same div is captured for PDF/image */}
          <div
            ref={pageRef as unknown as React.Ref<HTMLDivElement>}
            className="absolute inset-0 bg-white"
            data-page-id={page.id}
          >
            {/* Page margin */}
            <div
              className="absolute inset-0 flex flex-col overflow-hidden"
              style={{ padding: `${page.margin || 24}px` }}
            >
              <div className="flex-1 overflow-hidden space-y-0">
                {sortedBlocks.map((block, i) => (
                  <DraggableBlockWrapper
                    key={block.id}
                    block={block}
                    index={i}
                    config={config}
                    plannerId={plannerId}
                    pageId={page.id}
                    isSelected={selectedBlockId === block.id}
                    onSelect={setSelectedBlock}
                    onReorder={(from, to) => reorderBlocks(plannerId, page.id, from, to)}
                  />
                ))}
              </div>

              {/* Page footer */}
              {config.showPageNumbers && (
                <div className="flex items-center justify-between pt-1 border-t mt-1"
                  style={{ borderColor: config.accentColor }}>
                  {config.showDates && (
                    <span className="text-[8px] font-medium" style={{ color: config.secondaryColor + '80' }}>
                      {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                    </span>
                  )}
                  <span className="text-[8px] font-medium ml-auto" style={{ color: config.secondaryColor + '80' }}>
                    {pageIndex + 1}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Drop overlay hint */}
          {isOver && canDrop && (
            <div className="absolute inset-0 bg-blue-50/60 pointer-events-none flex items-end justify-center pb-6 rounded">
              <div className="bg-blue-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-float">
                Drop to add block
              </div>
            </div>
          )}

          {/* Empty state */}
          {sortedBlocks.length === 0 && !isOver && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-sm text-secondary/50 font-medium">Canvas is empty</p>
                <p className="text-xs text-secondary/35 mt-1">Drag blocks from the left panel</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Default configs per block type
function getDefaultConfig(type: BlockType): Record<string, unknown> {
  switch (type) {
    case 'time-slots': return { startHour: 6, endHour: 22, interval: 60 }
    case 'todo-list': return { count: 8 }
    case 'notes': return { lines: 6 }
    case 'habit-grid': return { habitCount: 8, daysInMonth: 31 }
    case 'goal-section': return { count: 5 }
    case 'gratitude': return { count: 3 }
    case 'water-tracker': return { goal: 8 }
    case 'workout-log': return { exerciseCount: 6 }
    case 'budget-row': return { rows: 5 }
    case 'expense-tracker': return { rows: 8 }
    case 'class-schedule': return { periods: 6 }
    case 'project-tracker': return { count: 4 }
    case 'date-header': return { showDay: true, showDate: true }
    default: return {}
  }
}
