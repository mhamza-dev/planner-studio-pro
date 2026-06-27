import type { PlannerBlock, PlannerConfig, PlannerPage } from '@/types'

const BLOCK_MARGIN = 8

const ASPECT_RATIOS: Record<string, number> = {
  A4: 210 / 297,
  Letter: 8.5 / 11,
  A5: 148 / 210,
  'Half-Letter': 5.5 / 8.5,
  Square: 1,
}

/** Printable content height inside the paper (matches BuilderCanvas at 720px width). */
export function getPageContentHeight(page: PlannerPage, config: PlannerConfig): number {
  const aspectRatio = ASPECT_RATIOS[page.pageSize] ?? ASPECT_RATIOS.A4
  const paperHeight = 720 / aspectRatio
  const margin = (page.margin ?? 28) * 2
  const footer = (config.showPageNumbers || config.showDates || config.footerText) ? 24 : 0
  const header = config.headerText ? 20 : 0
  return paperHeight - margin - footer - header
}

export function estimateBlockHeight(block: PlannerBlock): number {
  const cfg = block.config as Record<string, number | string | boolean>
  const base = BLOCK_MARGIN

  switch (block.type) {
    case 'cover-title': return base + 120
    case 'date-header': return base + 36
    case 'header': return base + 18
    case 'divider':
    case 'divider-styled': return base + 12
    case 'spacer': return base + 12
    case 'time-slots': {
      const start = (cfg.startHour as number) ?? 6
      const end = (cfg.endHour as number) ?? 22
      const interval = (cfg.interval as number) ?? 60
      const slots = Math.max(0, Math.ceil((end - start) * (60 / interval)))
      return base + slots * 18
    }
    case 'todo-list':
    case 'checklist': return base + ((cfg.count as number) ?? 8) * 26
    case 'goal-section': return base + ((cfg.count as number) ?? 5) * 28
    case 'notes':
    case 'brain-dump':
    case 'focus-block':
    case 'adhd-brain-dump': return base + ((cfg.lines as number) ?? 6) * 20 + 8
    case 'gratitude': return base + ((cfg.count as number) ?? 3) * 24
    case 'reflection': return base + 120
    case 'week-grid': return base + 110
    case 'month-calendar': return base + 220
    case 'habit-grid': return base + 180
    case 'priority-matrix': return base + 130
    case 'kanban': return base + 140
    case 'budget-row':
    case 'expense-tracker':
    case 'bill-tracker':
    case 'debt-tracker': return base + ((cfg.rows as number) ?? 5) * 22 + 16
    case 'class-schedule':
    case 'lesson-plan': return base + ((cfg.periods as number) ?? 6) * 24 + 16
    case 'meeting-notes': return base + 120
    case 'workout-log': return base + ((cfg.exerciseCount as number) ?? 6) * 28
    case 'wedding-checklist': return base + 160
    case 'vendor-tracker': return base + ((cfg.vendors as number) ?? 6) * 24
    case 'attendance': return base + 140
    case 'chore-chart': return base + 130
    case 'mood-tracker':
    case 'water-tracker':
    case 'sleep-tracker':
    case 'meal-planner': return base + 60
    case 'progress-bar':
    case 'savings-tracker': return base + 48
    case 'quote-block': return base + 56
    case 'project-tracker': return base + ((cfg.count as number) ?? 4) * 28
    case 'countdown': return base + 40
    case 'two-column': return base + 100
    case 'table-of-contents': return base + ((cfg.entries as number) ?? 5) * 22
    case 'adhd-routine': return base + ((cfg.steps as number) ?? 8) * 22
    case 'adhd-reward': return base + ((cfg.tasks as number) ?? 5) * 24
    default: return base + 56
  }
}

export function estimatePageBlocksHeight(blocks: PlannerBlock[]): number {
  return blocks
    .filter(b => !b.hidden)
    .reduce((sum, block) => sum + estimateBlockHeight(block), 0)
}

export function wouldPageOverflow(
  page: PlannerPage,
  blocks: PlannerBlock[],
  newBlock: Omit<PlannerBlock, 'id'>,
  config: PlannerConfig,
): boolean {
  const maxHeight = getPageContentHeight(page, config)
  const current = estimatePageBlocksHeight(blocks)
  const incoming = estimateBlockHeight({ ...newBlock, id: 'temp' } as PlannerBlock)
  return current + incoming > maxHeight
}

/** Pick a page that fits the block, spilling to the next page or creating one. */
export function resolveBlockTargetPage(
  pages: PlannerPage[],
  startPageId: string,
  block: Omit<PlannerBlock, 'id'>,
  config: PlannerConfig,
): string {
  const startIdx = pages.findIndex(p => p.id === startPageId)
  if (startIdx === -1) return startPageId

  for (let i = startIdx; i < pages.length; i++) {
    const page = pages[i]
    if (!wouldPageOverflow(page, page.blocks, block, config)) return page.id
  }
  return startPageId
}
