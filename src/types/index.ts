// ─── Planner Types ────────────────────────────────────────────────────────────
export type PlannerType =
  | 'daily' | 'weekly' | 'monthly' | 'habit' | 'budget'
  | 'wellness' | 'fitness' | 'student' | 'business'
  | 'journal' | 'workbook' | 'worksheet' | 'creative'

export type PlannerStatus = 'draft' | 'active' | 'archived' | 'sold'
export type PageSize = 'A4' | 'Letter' | 'A5' | 'Half-Letter' | 'Square'
export type Orientation = 'portrait' | 'landscape'
export type ExportFormat = 'pdf' | 'png' | 'jpg'
export type PageNumberStyle = 'numeric' | 'roman' | 'alpha' | 'hidden'
export type BackgroundPattern = 'none' | 'dots' | 'grid' | 'lines' | 'crosshatch' | 'diagonal'
export type BorderStyle = 'none' | 'hairline' | 'solid' | 'double' | 'dashed' | 'corner-marks'
export type DividerStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'arrows' | 'dots-spaced' | 'thick' | 'fade'

// ─── Block Types ──────────────────────────────────────────────────────────────
export type BlockType =
  // Structure
  | 'header' | 'date-header' | 'divider' | 'spacer' | 'two-column' | 'cover-title' | 'table-of-contents'
  // Planning
  | 'time-slots' | 'todo-list' | 'goal-section' | 'priority-matrix'
  | 'week-grid' | 'month-calendar' | 'countdown' | 'kanban' | 'checklist'
  // Writing
  | 'notes' | 'reflection' | 'gratitude' | 'custom-text' | 'quote-block'
  | 'brain-dump' | 'focus-block' | 'meeting-notes' | 'reading-log'
  // Tracking
  | 'habit-grid' | 'mood-tracker' | 'water-tracker' | 'sleep-tracker'
  | 'workout-log' | 'meal-planner' | 'progress-bar' | 'savings-tracker' | 'contact-card'
  // Finance
  | 'budget-row' | 'expense-tracker'
  // Academic
  | 'class-schedule' | 'project-tracker'
  // Decorative
  | 'icon-block' | 'divider-styled' | 'accent-shape'

// ─── Block & Page Models ──────────────────────────────────────────────────────
export interface FontConfig {
  family: string
  size: number
  weight: 300 | 400 | 500 | 600 | 700
  color: string
  align: 'left' | 'center' | 'right'
  letterSpacing?: number
  lineHeight?: number
}

export interface BlockStyle {
  backgroundColor: string
  borderColor: string
  borderWidth: number
  borderRadius: number
  padding: number
  marginBottom?: number
  fontConfig?: FontConfig
  textColor?: string
  accentColor?: string
}

export interface PlannerBlock {
  id: string
  type: BlockType
  label: string
  order: number
  style: BlockStyle
  config: Record<string, unknown>
  locked?: boolean
  hidden?: boolean
}

export interface PageSection {
  id: string
  name: string
  pageIds: string[]
  color?: string
}

export interface PlannerPage {
  id: string
  title: string
  order: number
  blocks: PlannerBlock[]
  pageSize: PageSize
  orientation: Orientation
  margin: number
  backgroundColor?: string
  backgroundPattern?: BackgroundPattern
  borderStyle?: BorderStyle
  sectionId?: string
}

export interface PlannerConfig {
  pageSize: PageSize
  orientation: Orientation
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string
  showPageNumbers: boolean
  pageNumberStyle: PageNumberStyle
  showDates: boolean
  startDate?: string
  endDate?: string
  weekStartsOn: 0 | 1
  headerText?: string
  footerText?: string
  logoUrl?: string
  backgroundPattern?: BackgroundPattern
  borderStyle?: BorderStyle
}

export interface Planner {
  id: string
  name: string
  description: string
  type: PlannerType
  status: PlannerStatus
  pages: PlannerPage[]
  sections: PageSection[]
  config: PlannerConfig
  tags: string[]
  folderId?: string
  thumbnail?: string
  createdAt: string
  updatedAt: string
  version: number
  history: HistorySnapshot[]
}

export interface HistorySnapshot {
  id: string
  timestamp: string
  label: string
  pages: PlannerPage[]
  config: PlannerConfig
}

// ─── Templates ────────────────────────────────────────────────────────────────
export interface Template {
  id: string
  name: string
  type: PlannerType
  description: string
  thumbnail: string
  category: string
  subcategory?: string
  tags: string[]
  pages: PlannerPage[]
  config: PlannerConfig
  isFavorite: boolean
  isPremium: boolean
  downloads: number
  accentHue: string
}

// ─── Folders ──────────────────────────────────────────────────────────────────
export interface PlannerFolder {
  id: string
  name: string
  color: string
  icon: string
  createdAt: string
}

// ─── Export ───────────────────────────────────────────────────────────────────
export interface ExportConfig {
  format: ExportFormat
  pageSize: PageSize
  quality: number
  includeBleed: boolean
  colorProfile: 'rgb' | 'cmyk'
  resolution: 72 | 150 | 300
  scope: 'all' | 'current' | 'range'
  pageRange?: [number, number]
  filename?: string
}

export interface DownloadRecord {
  id: string
  plannerId: string
  plannerName: string
  format: ExportFormat
  fileSize: number
  pageCount: number
  createdAt: string
}

// ─── Settings ─────────────────────────────────────────────────────────────────
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
  showMiniMap: boolean
  reducedMotion: boolean
  fontSize: 'sm' | 'md' | 'lg'
}

// ─── Analytics ────────────────────────────────────────────────────────────────
export interface UsageStats {
  plannersCreated: number
  blocksAdded: number
  exportsCompleted: number
  templatesUsed: number
  favoriteBlockType: BlockType | null
  totalPagesCreated: number
  lastActive: string
}

// ─── Etsy ─────────────────────────────────────────────────────────────────────
export interface EtsyListingData {
  plannerId: string
  title: string
  description: string
  tags: string[]
  price: number
  etsyFee: number
  transactionFee: number
  netProfit: number
  estimatedFileSize: string
  licenseType: 'personal' | 'commercial'
  generatedAt: string
}

// ─── Block Preset ────────────────────────────────────────────────────────────
export interface BlockPreset {
  id: string
  name: string
  blockType: BlockType
  config: Record<string, unknown>
  style: BlockStyle
  createdAt: string
}

// ─── Toast ────────────────────────────────────────────────────────────────────
export interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number
}

// ─── Command Palette ──────────────────────────────────────────────────────────
export interface CommandItem {
  id: string
  label: string
  description?: string
  icon?: string
  category: string
  shortcut?: string
  action: () => void
}
