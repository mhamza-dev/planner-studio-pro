import React, { useRef, useCallback } from 'react'
import { useDrop } from 'react-dnd'
import { motion, AnimatePresence } from 'framer-motion'
import { GripVertical, Trash2, Copy } from 'lucide-react'
import { PlannerPageRenderer } from '@/components/planner/PageRenderer'
import { usePlannerStore } from '@/store/plannerStore'
import { useUIStore } from '@/store/uiStore'
import { DEFAULT_BLOCK_STYLE } from '@/lib/defaults'
import { generateId } from '@/utils/id'
import type { PlannerPage, PlannerConfig, BlockType, PlannerBlock } from '@/types'
import { cn } from '@/utils/cn'

interface CanvasProps {
  page: PlannerPage
  config: PlannerConfig
  plannerId: string
  pageRefs: React.MutableRefObject<HTMLElement[]>
  pageIndex: number
}

function DraggableBlockOverlay({
  block,
  plannerId,
  pageId,
  isSelected,
  onSelect,
}: {
  block: PlannerBlock
  plannerId: string
  pageId: string
  isSelected: boolean
  onSelect: () => void
}) {
  const { deleteBlock, duplicateBlock } = usePlannerStore()

  return (
    <div
      className={cn(
        'group absolute left-0 right-0 cursor-pointer transition-all',
        isSelected && 'ring-1 ring-primary/40 rounded'
      )}
      style={{ top: 0, position: 'relative' }}
      onClick={e => { e.stopPropagation(); onSelect() }}
    >
      {isSelected && (
        <div className="absolute -top-5 right-0 z-10 flex items-center gap-0.5 bg-primary rounded-t-md px-1 py-0.5">
          <button
            onClick={e => { e.stopPropagation(); duplicateBlock(plannerId, pageId, block.id) }}
            className="text-white/70 hover:text-white p-0.5 rounded"
            aria-label="Duplicate"
          >
            <Copy size={10} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); deleteBlock(plannerId, pageId, block.id) }}
            className="text-white/70 hover:text-red-300 p-0.5 rounded"
            aria-label="Delete"
          >
            <Trash2 size={10} />
          </button>
        </div>
      )}
    </div>
  )
}

export const BuilderCanvas: React.FC<CanvasProps> = ({
  page,
  config,
  plannerId,
  pageRefs,
  pageIndex,
}) => {
  const { addBlock, setSelectedBlock, selectedBlockId } = usePlannerStore()
  const { previewZoom } = useUIStore()

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'template-block',
    drop: (item: { type: string; blockType: BlockType }) => {
      addBlock(plannerId, page.id, {
        type: item.blockType,
        label: item.blockType.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        order: page.blocks.length,
        style: { ...DEFAULT_BLOCK_STYLE },
        config: {},
        locked: false,
      })
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  const pageRef = useCallback((el: HTMLElement | null) => {
    if (el) pageRefs.current[pageIndex] = el
  }, [pageIndex, pageRefs])

  const scale = previewZoom / 100

  return (
    <div
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      className="flex items-start justify-center pt-8 pb-16 px-8 min-h-full"
      onClick={() => setSelectedBlock(null)}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: `${100 / scale}%`,
          marginBottom: `${-(1 - scale) * 100}%`,
        }}
      >
        <div
          className={cn(
            'relative mx-auto transition-shadow duration-200',
            isOver && canDrop && 'ring-2 ring-primary/30 ring-offset-4',
          )}
          style={{ maxWidth: '640px' }}
        >
          <PlannerPageRenderer
            ref={pageRef as unknown as React.Ref<HTMLDivElement>}
            page={page}
            config={config}
            pageNumber={pageIndex + 1}
            isPreview={false}
            className="paper-shadow"
          />

          {/* Drop overlay */}
          {isOver && canDrop && (
            <div className="absolute inset-0 bg-primary/5 rounded pointer-events-none flex items-end justify-center pb-4">
              <div className="bg-primary text-white text-xs font-medium px-3 py-1.5 rounded-full">
                Drop block here
              </div>
            </div>
          )}

          {/* Empty state hint */}
          {page.blocks.length === 0 && !isOver && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-sm text-secondary/60 font-medium">Drag blocks from the panel</p>
                <p className="text-xs text-secondary/40 mt-1">or double-click a block to add it</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
