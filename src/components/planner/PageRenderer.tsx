import React, { forwardRef } from 'react'
import type { PlannerPage, PlannerConfig } from '@/types'
import { PlannerBlockRenderer } from './BlockRenderer'
import { cn } from '@/utils/cn'

interface PlannerPageRendererProps {
  page: PlannerPage
  config: PlannerConfig
  pageNumber?: number
  totalPages?: number
  className?: string
  isPreview?: boolean
}

export const PlannerPageRenderer = forwardRef<HTMLDivElement, PlannerPageRendererProps>(
  ({ page, config, pageNumber, totalPages, className, isPreview = false }, ref) => {
    const isA4 = page.pageSize === 'A4'
    // A4: 210x297mm, Letter: 215.9x279.4mm
    const aspectRatio = isA4 ? (210 / 297) : (8.5 / 11)

    const sortedBlocks = [...page.blocks].sort((a, b) => a.order - b.order)

    return (
      <div
        ref={ref}
        className={cn(
          'bg-white relative overflow-hidden print-page',
          className
        )}
        style={{
          aspectRatio,
          fontFamily: config.fontFamily || 'Inter',
        }}
        data-page-id={page.id}
      >
        {/* Page margin container */}
        <div
          className="absolute inset-0 flex flex-col overflow-hidden"
          style={{ padding: `${page.margin || 24}px` }}
        >
          {/* Blocks */}
          <div className="flex-1 overflow-hidden">
            {sortedBlocks.map(block => (
              <PlannerBlockRenderer
                key={block.id}
                block={block}
                config={config}
                isPreview={isPreview}
              />
            ))}
          </div>

          {/* Page footer */}
          {(config.showPageNumbers && pageNumber !== undefined) && (
            <div
              className="flex items-center justify-between pt-2 border-t mt-auto"
              style={{ borderColor: config.accentColor }}
            >
              {config.showDates && (
                <span
                  className="text-[8px] font-medium"
                  style={{ color: config.secondaryColor + '80' }}
                >
                  {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </span>
              )}
              <span
                className="text-[8px] font-medium ml-auto"
                style={{ color: config.secondaryColor + '80' }}
              >
                {pageNumber}{totalPages ? ` / ${totalPages}` : ''}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }
)

PlannerPageRenderer.displayName = 'PlannerPageRenderer'
