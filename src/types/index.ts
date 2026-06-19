export type PlannerType =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'habit'
  | 'budget'
  | 'wellness'
  | 'fitness'
  | 'student'
  | 'business'

export type PageSize = 'A4' | 'Letter'
export type Orientation = 'portrait' | 'landscape'
export type ExportFormat = 'pdf' | 'png' | 'jpg'

export interface Color {
  name: string
  value: string
}

export interface FontConfig {
  family: string
  size: number
  weight: number
  color: string
  align: 'left' | 'center' | 'right'
}

export interface BlockStyle {
  backgroundColor: string
  borderColor: string
  borderWidth: number
  borderRadius: number
  padding: number
  fontConfig?: FontConfig
}

export type BlockType =
  | 'header'
  | 'time-slots'
  | 'todo-list'
  | 'notes'
  | 'habit-grid'
  | 'budget-row'
  | 'mood-tracker'
  | 'water-tracker'
  | 'sleep-tracker'
  | 'workout-log'
  | 'goal-section'
  | 'date-header'
  | 'week-grid'
  | 'month-calendar'
  | 'priority-matrix'
  | 'reflection'
  | 'gratitude'
  | 'meal-planner'
  | 'expense-tracker'
  | 'class-schedule'
  | 'project-tracker'
  | 'divider'
  | 'spacer'
  | 'custom-text'

export interface PlannerBlock {
  id: string
  type: BlockType
  label: string
  order: number
  style: BlockStyle
  config: Record<string, unknown>
  locked?: boolean
}

export interface PlannerPage {
  id: string
  title: string
  order: number
  blocks: PlannerBlock[]
  pageSize: PageSize
  orientation: Orientation
  margin: number
}

export interface PlannerConfig {
  pageSize: PageSize
  orientation: Orientation
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string
  showPageNumbers: boolean
  showDates: boolean
  startDate?: string
  endDate?: string
  weekStartsOn: 0 | 1
}

export interface Planner {
  id: string
  name: string
  type: PlannerType
  description: string
  pages: PlannerPage[]
  config: PlannerConfig
  thumbnail?: string
  createdAt: string
  updatedAt: string
  tags: string[]
}

export interface Template {
  id: string
  name: string
  type: PlannerType
  description: string
  thumbnail: string
  category: string
  tags: string[]
  pages: PlannerPage[]
  config: PlannerConfig
  isFavorite: boolean
  isPremium: boolean
  downloads: number
}

export interface ExportConfig {
  format: ExportFormat
  pageSize: PageSize
  quality: number
  includeBleed: boolean
  colorProfile: 'rgb' | 'cmyk'
  resolution: 72 | 150 | 300
}

export interface DownloadRecord {
  id: string
  plannerId: string
  plannerName: string
  format: ExportFormat
  fileSize: number
  createdAt: string
  url?: string
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  language: string
  defaultPageSize: PageSize
  defaultOrientation: Orientation
  autoSave: boolean
  autoSaveInterval: number
  showRulers: boolean
  showGrid: boolean
  snapToGrid: boolean
  gridSize: number
}

export type DragItem = {
  id: string
  type: 'block' | 'template-block'
  blockType?: BlockType
  index?: number
}
