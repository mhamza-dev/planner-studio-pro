import React, { useCallback, useRef } from 'react'
import { useDrop, useDrag } from 'react-dnd'
import { Trash2, Copy, GripVertical } from 'lucide-react'
import { PlannerBlockRenderer } from '@/components/planner/BlockRenderer'
import { usePlannerStore } from '@/store/plannerStore'
import { useUIStore } from '@/store/uiStore'
import { DEFAULT_BLOCK_STYLE, getDefaultBlockConfig } from '@/lib/defaults'
import type { PlannerPage, PlannerConfig, BlockType, PlannerBlock } from '@/types'
import { cn } from '@/utils/cn'

// ── Background pattern SVGs ───────────────────────────────────────────────────
function getPatternStyle(pattern?: string, color = '#0F172A'): React.CSSProperties {
  const c = `${color}12`
  switch (pattern) {
    case 'dots': return {
      backgroundImage: `radial-gradient(circle, ${c} 1px, transparent 1px)`,
      backgroundSize: '16px 16px',
    }
    case 'grid': return {
      backgroundImage: `linear-gradient(${c} 1px, transparent 1px), linear-gradient(90deg, ${c} 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
    }
    case 'lines': return {
      backgroundImage: `linear-gradient(${c} 1px, transparent 1px)`,
      backgroundSize: '100% 24px',
    }
    case 'crosshatch': return {
      backgroundImage: `linear-gradient(45deg, ${c} 1px, transparent 1px), linear-gradient(-45deg, ${c} 1px, transparent 1px)`,
      backgroundSize: '16px 16px',
    }
    case 'diagonal': return {
      backgroundImage: `repeating-linear-gradient(45deg, ${c} 0, ${c} 1px, transparent 0, transparent 50%)`,
      backgroundSize: '12px 12px',
    }
    default: return {}
  }
}

function getBorderStyle(border?: string, color = '#0F172A'): React.CSSProperties {
  const c = `${color}30`
  switch (border) {
    case 'hairline': return { outline: `1px solid ${c}` }
    case 'solid': return { outline: `2px solid ${c}` }
    case 'double': return { outline: `3px double ${c}` }
    case 'dashed': return { outline: `1px dashed ${c}` }
    case 'corner-marks': return {} // rendered as pseudo elements via className
    default: return {}
  }
}

// ── Draggable block wrapper ───────────────────────────────────────────────────
interface DraggableBlockProps {
  block: PlannerBlock; index: number; config: PlannerConfig
  plannerId: string; pageId: string
  isSelected: boolean; onSelect: (id: string) => void
  onReorder: (from: number, to: number) => void
}

function DraggableBlock({ block, index, config, plannerId, pageId, isSelected, onSelect, onReorder }: DraggableBlockProps) {
  const { deleteBlock, duplicateBlock } = usePlannerStore()
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: 'CANVAS_BLOCK',
    item: { id: block.id, index },
    collect: m => ({ isDragging: m.isDragging() }),
  })

  const [{ isOver }, drop] = useDrop<{ id: string; index: number }, void, { isOver: boolean }>({
    accept: 'CANVAS_BLOCK',
    collect: m => ({ isOver: m.isOver({ shallow: true }) }),
    hover(item) {
      if (!ref.current || item.index === index) return
      onReorder(item.index, index)
      item.index = index
    },
  })

  drag(drop(ref))
  if (block.hidden) return null

  return (
    <div
      ref={ref}
      onClick={e => { e.stopPropagation(); onSelect(block.id) }}
      style={{ opacity: isDragging ? 0.35 : 1 }}
      className={cn(
        'group relative transition-all duration-100 cursor-pointer rounded-sm',
        isSelected && 'ring-2 ring-inset ring-accent/60',
        !isSelected && !block.locked && 'hover:ring-1 hover:ring-inset hover:ring-primary/20',
        isOver && 'ring-2 ring-inset ring-accent',
      )}
    >
      {/* Selection toolbar */}
      <div className={cn(
        'absolute -top-7 right-0 z-30 flex items-center gap-0.5 bg-primary text-white rounded-t-md px-1 py-1 shadow-float',
        'transition-opacity duration-100',
        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
      )}>
        {!block.locked && (
          <div className="p-0.5 cursor-grab active:cursor-grabbing text-white/60 hover:text-white" title="Drag to reorder">
            <GripVertical size={11}/>
          </div>
        )}
        <button onClick={e => { e.stopPropagation(); duplicateBlock(plannerId, pageId, block.id) }}
          className="p-0.5 text-white/70 hover:text-white rounded" title="Duplicate">
          <Copy size={11}/>
        </button>
        <button onClick={e => { e.stopPropagation(); deleteBlock(plannerId, pageId, block.id) }}
          className="p-0.5 text-white/70 hover:text-red-300 rounded" title="Delete">
          <Trash2 size={11}/>
        </button>
        {block.locked && <span className="text-[9px] px-1 text-white/50">locked</span>}
      </div>

      <PlannerBlockRenderer block={block} config={config}/>
    </div>
  )
}

// ── Main canvas ───────────────────────────────────────────────────────────────
interface CanvasProps {
  page: PlannerPage; config: PlannerConfig
  plannerId: string; pageRefs: React.MutableRefObject<HTMLElement[]>; pageIndex: number
}

export const BuilderCanvas: React.FC<CanvasProps> = ({ page, config, plannerId, pageRefs, pageIndex }) => {
  const { addBlock, setSelectedBlock, selectedBlockId, reorderBlocks } = usePlannerStore()
  const { previewZoom, showGrid } = useUIStore()

  const [{ isOver, canDrop }, drop] = useDrop<{ blockType: BlockType }, void, { isOver: boolean; canDrop: boolean }>({
    accept: 'PALETTE_BLOCK',
    drop(item) {
      const label = item.blockType.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      addBlock(plannerId, page.id, {
        type: item.blockType, label,
        order: page.blocks.length,
        style: { ...DEFAULT_BLOCK_STYLE },
        config: getDefaultBlockConfig(item.blockType),
        locked: false, hidden: false,
      })
    },
    collect: m => ({ isOver: m.isOver(), canDrop: m.canDrop() }),
  })

  const pageRef = useCallback((el: HTMLElement | null) => {
    if (el) pageRefs.current[pageIndex] = el
  }, [pageIndex, pageRefs])

  const scale = previewZoom / 100
  const isA4 = !['Letter', 'Half-Letter'].includes(page.pageSize)
  const aspectRatios: Record<string, number> = {
    A4: 210 / 297, Letter: 8.5 / 11, A5: 148 / 210,
    'Half-Letter': 5.5 / 8.5, Square: 1,
  }
  const aspectRatio = aspectRatios[page.pageSize] ?? (210 / 297)
  const sorted = [...page.blocks].sort((a, b) => a.order - b.order)

  const patternStyle = getPatternStyle(page.backgroundPattern || config.backgroundPattern, config.primaryColor)
  const borderStyle = getBorderStyle(page.borderStyle || config.borderStyle, config.primaryColor)

  return (
    <div
      className="flex items-start justify-center pt-8 pb-24 px-8 min-h-full"
      onClick={() => setSelectedBlock(null)}
    >
      <div style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        width: `${Math.min(720, 720 / scale)}px`,
        marginBottom: `${-(1 - scale) * 100 * 5}px`,
      }}>
        {/* Paper container */}
        <div
          ref={drop as unknown as React.Ref<HTMLDivElement>}
          className={cn(
            'relative bg-white mx-auto paper-shadow transition-shadow duration-200',
            isOver && canDrop && 'paper-shadow-hover',
            page.borderStyle === 'corner-marks' && 'corner-marks',
          )}
          style={{ width: '100%', aspectRatio: String(aspectRatio), ...patternStyle, ...borderStyle }}
        >
          {/* Canvas grid overlay */}
          {showGrid && (
            <div className="absolute inset-0 pointer-events-none z-10"
              style={{
                backgroundImage: `linear-gradient(rgba(99,102,241,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.08) 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }}/>
          )}

          {/* Printable ref area */}
          <div ref={pageRef as unknown as React.Ref<HTMLDivElement>} className="absolute inset-0 bg-white"
            style={{ ...patternStyle }} data-page-id={page.id}>
            <div className="absolute inset-0 flex flex-col overflow-hidden"
              style={{ padding: `${page.margin ?? 28}px`, fontFamily: config.fontFamily || 'Inter' }}>

              {/* Custom header */}
              {config.headerText && (
                <div className="text-[8px] font-medium text-center mb-2 pb-1 border-b" style={{ color: `${config.primaryColor}60`, borderColor: `${config.accentColor}60` }}>
                  {config.headerText}
                </div>
              )}

              {/* Blocks */}
              <div className="flex-1 overflow-hidden">
                {sorted.map((block, i) => (
                  <DraggableBlock
                    key={block.id} block={block} index={i} config={config}
                    plannerId={plannerId} pageId={page.id}
                    isSelected={selectedBlockId === block.id}
                    onSelect={setSelectedBlock}
                    onReorder={(from, to) => reorderBlocks(plannerId, page.id, from, to)}
                  />
                ))}
              </div>

              {/* Footer */}
              {(config.showPageNumbers || config.showDates || config.footerText) && (
                <div className="flex items-center justify-between pt-1 mt-auto border-t" style={{ borderColor: `${config.accentColor}60` }}>
                  <span className="text-[7px] font-medium" style={{ color: `${config.primaryColor}50` }}>
                    {config.footerText || (config.showDates ? new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '')}
                  </span>
                  {config.showPageNumbers && (
                    <span className="text-[7px] font-medium tabular-nums" style={{ color: `${config.primaryColor}50` }}>
                      {pageIndex + 1}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Drop overlay */}
          {isOver && canDrop && (
            <div className="absolute inset-0 bg-accent/5 pointer-events-none flex items-end justify-center pb-8 rounded">
              <div className="bg-accent text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-float">
                Drop block here
              </div>
            </div>
          )}

          {/* Empty state */}
          {sorted.filter(b => !b.hidden).length === 0 && !isOver && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-xs text-ink-faint font-medium">Canvas is empty</p>
                <p className="text-[11px] text-ink-faint/60 mt-1">Drag blocks from the left panel</p>
              </div>
            </div>
          )}
        </div>

        {/* Page label below paper */}
        <div className="text-center mt-3">
          <span className="text-xs text-ink-muted font-medium">{page.title}</span>
          <span className="text-xs text-ink-faint ml-2">({pageIndex + 1}/{pageRefs.current.length || '?'})</span>
        </div>
      </div>
    </div>
  )
}
