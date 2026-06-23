import type { PlannerConfig, PlannerBlock, PlannerPage, PlannerType, BlockStyle, BlockType } from '@/types'
import { generateId } from '@/utils/id'

export const DEFAULT_BLOCK_STYLE: BlockStyle = {
  backgroundColor: 'transparent',
  borderColor: '#E4E4E7',
  borderWidth: 0,
  borderRadius: 4,
  padding: 8,
  marginBottom: 8,
}

export const DEFAULT_CONFIG: PlannerConfig = {
  pageSize: 'A4',
  orientation: 'portrait',
  primaryColor: '#0F172A',
  secondaryColor: '#64748B',
  accentColor: '#E4E4E7',
  fontFamily: 'Inter',
  showPageNumbers: true,
  pageNumberStyle: 'numeric',
  showDates: true,
  weekStartsOn: 1,
  backgroundPattern: 'none',
  borderStyle: 'none',
}

export function makeBlock(
  type: BlockType,
  label: string,
  order: number,
  config: Record<string, unknown> = {}
): PlannerBlock {
  return {
    id: generateId('block'),
    type,
    label,
    order,
    style: { ...DEFAULT_BLOCK_STYLE },
    config,
    locked: false,
    hidden: false,
  }
}

export function makePage(
  title: string,
  order: number,
  blocks: PlannerBlock[],
  config?: Partial<PlannerPage>
): PlannerPage {
  return {
    id: generateId('page'),
    title,
    order,
    blocks,
    pageSize: 'A4',
    orientation: 'portrait',
    margin: 28,
    backgroundPattern: 'none',
    borderStyle: 'none',
    ...config,
  }
}

// ── Default block configs per type ────────────────────────────────────────────
export function getDefaultBlockConfig(type: BlockType): Record<string, unknown> {
  switch (type) {
    case 'time-slots': return { startHour: 6, endHour: 22, interval: 60 }
    case 'todo-list': return { count: 8, showCheckboxes: true }
    case 'notes': return { lines: 6 }
    case 'habit-grid': return { habitCount: 8, daysInMonth: 31, habits: [] }
    case 'goal-section': return { count: 5 }
    case 'gratitude': return { count: 3 }
    case 'water-tracker': return { goal: 8 }
    case 'workout-log': return { exerciseCount: 6 }
    case 'budget-row': return { rows: 5 }
    case 'expense-tracker': return { rows: 8 }
    case 'class-schedule': return { periods: 6 }
    case 'project-tracker': return { count: 4 }
    case 'date-header': return { showDay: true, showDate: true }
    case 'kanban': return { columns: ['To Do', 'In Progress', 'Done'], itemsPerColumn: 4 }
    case 'meeting-notes': return { attendeeCount: 4, actionItems: 5 }
    case 'countdown': return { label: 'Goal Date', targetDate: '' }
    case 'quote-block': return { quote: 'The secret of getting ahead is getting started.', author: 'Mark Twain' }
    case 'savings-tracker': return { goal: 1000, current: 0, currency: '$' }
    case 'reading-log': return { rows: 5 }
    case 'contact-card': return { rows: 4 }
    case 'brain-dump': return { lines: 12 }
    case 'focus-block': return { lines: 10, prompt: 'Focus for today:' }
    case 'progress-bar': return { label: 'Progress', value: 0, max: 100 }
    case 'two-column': return { leftWidth: 50 }
    case 'cover-title': return { title: 'My Planner', subtitle: '2025', showDate: true }
    case 'table-of-contents': return { entries: 5 }
    case 'checklist': return { categories: ['Morning', 'Afternoon', 'Evening'], itemsPerCategory: 4 }
    case 'icon-block': return { icon: 'star', size: 24, color: '#6366F1' }
    case 'divider-styled': return { style: 'solid', thickness: 1 }
    case 'accent-shape': return { shape: 'underline', width: 40, color: '#6366F1' }
    default: return {}
  }
}

// ── Planner type pages ────────────────────────────────────────────────────────
export const PLANNER_TYPE_PAGES: Record<PlannerType, () => PlannerPage[]> = {
  daily: () => [
    makePage('Daily Plan', 0, [
      makeBlock('cover-title', 'Cover', 0, { title: 'Daily Planner', subtitle: new Date().toLocaleDateString('en-US', { year: 'numeric' }) }),
    ]),
    makePage('Today', 1, [
      makeBlock('date-header', 'Date', 0, { showDay: true, showDate: true }),
      makeBlock('header', 'Top Priorities', 1),
      makeBlock('goal-section', 'Priorities', 2, { count: 3 }),
      makeBlock('time-slots', 'Schedule', 3, { startHour: 6, endHour: 22, interval: 60 }),
      makeBlock('todo-list', 'Tasks', 4, { count: 8 }),
      makeBlock('notes', 'Notes', 5, { lines: 5 }),
      makeBlock('gratitude', 'Gratitude', 6, { count: 3 }),
      makeBlock('reflection', 'End of Day', 7),
    ]),
  ],

  weekly: () => [
    makePage('Weekly Planner', 0, [
      makeBlock('date-header', 'Week', 0, { showWeekNumber: true }),
      makeBlock('week-grid', 'Weekly Grid', 1, { showTimeSlots: false }),
      makeBlock('goal-section', 'Weekly Goals', 2, { count: 5 }),
      makeBlock('notes', 'Notes', 3, { lines: 4 }),
    ]),
  ],

  monthly: () => [
    makePage('Monthly Overview', 0, [
      makeBlock('date-header', 'Month', 0, { showMonth: true, showYear: true }),
      makeBlock('month-calendar', 'Calendar', 1),
      makeBlock('goal-section', 'Monthly Goals', 2, { count: 5 }),
      makeBlock('habit-grid', 'Habit Tracker', 3, { habitCount: 5, daysInMonth: 31 }),
      makeBlock('notes', 'Notes', 4, { lines: 3 }),
    ]),
  ],

  habit: () => [
    makePage('Habit Tracker', 0, [
      makeBlock('date-header', 'Month', 0, { showMonth: true }),
      makeBlock('habit-grid', 'Habits', 1, { habitCount: 12, daysInMonth: 31 }),
      makeBlock('progress-bar', 'Monthly Score', 2, { label: 'Completion Rate', value: 0, max: 100 }),
      makeBlock('reflection', 'Monthly Review', 3),
    ]),
  ],

  budget: () => [
    makePage('Budget Planner', 0, [
      makeBlock('date-header', 'Month', 0, { showMonth: true }),
      makeBlock('header', 'Income', 1),
      makeBlock('budget-row', 'Income Sources', 2, { rows: 4 }),
      makeBlock('header', 'Fixed Expenses', 3),
      makeBlock('budget-row', 'Fixed Expenses', 4, { rows: 6 }),
      makeBlock('header', 'Variable Expenses', 5),
      makeBlock('expense-tracker', 'Expense Log', 6, { rows: 10 }),
      makeBlock('savings-tracker', 'Savings Goal', 7, { goal: 1000, current: 0, currency: '$' }),
    ]),
  ],

  wellness: () => [
    makePage('Wellness Log', 0, [
      makeBlock('date-header', 'Date', 0, { showDate: true }),
      makeBlock('mood-tracker', 'Mood', 1),
      makeBlock('water-tracker', 'Water', 2, { goal: 8 }),
      makeBlock('sleep-tracker', 'Sleep', 3),
      makeBlock('meal-planner', 'Meals', 4),
      makeBlock('workout-log', 'Movement', 5, { exerciseCount: 3 }),
      makeBlock('gratitude', 'Gratitude', 6, { count: 3 }),
      makeBlock('notes', 'Reflections', 7, { lines: 4 }),
    ]),
  ],

  fitness: () => [
    makePage('Workout Log', 0, [
      makeBlock('date-header', 'Date', 0, { showDate: true }),
      makeBlock('workout-log', 'Workout', 1, { exerciseCount: 8 }),
      makeBlock('progress-bar', 'Completion', 2, { label: 'Workout Complete', value: 0, max: 100 }),
      makeBlock('water-tracker', 'Hydration', 3, { goal: 10 }),
      makeBlock('notes', 'Notes & PRs', 4, { lines: 4 }),
    ]),
  ],

  student: () => [
    makePage('Student Planner', 0, [
      makeBlock('date-header', 'Date', 0, { showDay: true, showDate: true }),
      makeBlock('class-schedule', 'Classes', 1, { periods: 6 }),
      makeBlock('todo-list', 'Assignments', 2, { count: 8 }),
      makeBlock('goal-section', 'Study Goals', 3, { count: 3 }),
      makeBlock('countdown', 'Exam Countdown', 4, { label: 'Next Exam' }),
      makeBlock('notes', 'Notes', 5, { lines: 4 }),
    ]),
  ],

  business: () => [
    makePage('Business Planner', 0, [
      makeBlock('date-header', 'Date', 0, { showDate: true }),
      makeBlock('priority-matrix', 'Priority Matrix', 1),
      makeBlock('todo-list', 'Action Items', 2, { count: 8 }),
      makeBlock('meeting-notes', 'Meeting Notes', 3, { attendeeCount: 3, actionItems: 4 }),
      makeBlock('project-tracker', 'Projects', 4, { count: 4 }),
      makeBlock('reflection', 'EOD Review', 5),
    ]),
  ],

  journal: () => [
    makePage('Journal Entry', 0, [
      makeBlock('date-header', 'Date', 0, { showDay: true, showDate: true }),
      makeBlock('mood-tracker', 'Mood Check-In', 1),
      makeBlock('quote-block', 'Daily Quote', 2, { quote: 'Write what should not be forgotten.', author: 'Isabel Allende' }),
      makeBlock('brain-dump', 'Morning Pages', 3, { lines: 14 }),
      makeBlock('gratitude', 'Gratitude', 4, { count: 3 }),
      makeBlock('goal-section', 'Intentions', 5, { count: 3 }),
      makeBlock('reflection', 'Evening Reflection', 6),
    ]),
  ],

  workbook: () => [
    makePage('Workbook', 0, [
      makeBlock('cover-title', 'Cover', 0, { title: 'Workbook', subtitle: 'Complete Guide' }),
    ]),
    makePage('Chapter 1', 1, [
      makeBlock('header', 'Chapter 1', 0),
      makeBlock('focus-block', 'Introduction', 1, { lines: 6, prompt: 'What you will learn:' }),
      makeBlock('notes', 'Notes', 2, { lines: 8 }),
      makeBlock('todo-list', 'Action Items', 3, { count: 5 }),
      makeBlock('reflection', 'Key Takeaways', 4),
    ]),
  ],

  worksheet: () => [
    makePage('Worksheet', 0, [
      makeBlock('header', 'Worksheet Title', 0),
      makeBlock('custom-text', 'Instructions', 1, { text: 'Complete each section below.' }),
      makeBlock('notes', 'Section 1', 2, { lines: 6 }),
      makeBlock('notes', 'Section 2', 3, { lines: 6 }),
      makeBlock('todo-list', 'Checklist', 4, { count: 6 }),
    ]),
  ],

  creative: () => [
    makePage('Creative Board', 0, [
      makeBlock('cover-title', 'Title', 0, { title: 'Creative Project', subtitle: 'Brainstorm & Plan' }),
      makeBlock('brain-dump', 'Brainstorm', 1, { lines: 10 }),
      makeBlock('kanban', 'Project Board', 2, { columns: ['Ideas', 'In Progress', 'Done'], itemsPerColumn: 4 }),
      makeBlock('notes', 'Notes', 3, { lines: 5 }),
    ]),
  ],
}

// ── Labels & descriptions ─────────────────────────────────────────────────────
export const PLANNER_TYPE_LABELS: Record<PlannerType, string> = {
  daily: 'Daily Planner',
  weekly: 'Weekly Planner',
  monthly: 'Monthly Planner',
  habit: 'Habit Tracker',
  budget: 'Budget Planner',
  wellness: 'Wellness Journal',
  fitness: 'Fitness Tracker',
  student: 'Student Planner',
  business: 'Business Planner',
  journal: 'Journal',
  workbook: 'Workbook',
  worksheet: 'Worksheet',
  creative: 'Creative Board',
}

export const PLANNER_TYPE_DESCRIPTIONS: Record<PlannerType, string> = {
  daily: 'Hour-by-hour scheduling with priorities and reflection',
  weekly: 'Full week overview with goals and task tracking',
  monthly: 'Calendar view with monthly goals and habit tracking',
  habit: 'Visual grid to track habits daily across the month',
  budget: 'Income, expenses, and savings in one place',
  wellness: 'Mind and body daily check-ins with mood and sleep',
  fitness: 'Workout logging with sets, reps, and progress',
  student: 'Class schedule, assignments, and study goals',
  business: 'Priority matrix, projects, and meeting notes',
  journal: 'Daily journaling with guided prompts and reflection',
  workbook: 'Educational content with notes and action items',
  worksheet: 'Printable fill-in worksheets for any topic',
  creative: 'Brainstorm, plan, and track creative projects',
}

export const PLANNER_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  active: 'Active',
  archived: 'Archived',
  sold: 'Sold on Etsy',
}

// ── Palette presets ───────────────────────────────────────────────────────────
export const PALETTE_PRESETS = [
  { name: 'Midnight', primary: '#0F172A', secondary: '#475569', accent: '#E2E8F0', bg: '#F8FAFC' },
  { name: 'Indigo', primary: '#1E1B4B', secondary: '#4338CA', accent: '#C7D2FE', bg: '#EEF2FF' },
  { name: 'Sage', primary: '#1A3A2A', secondary: '#52796F', accent: '#CAD2C5', bg: '#F0F4F0' },
  { name: 'Blush', primary: '#4A1942', secondary: '#C0695C', accent: '#F5D0CA', bg: '#FDF0EE' },
  { name: 'Terracotta', primary: '#3D1A08', secondary: '#A07840', accent: '#E8D5B4', bg: '#FAF5EC' },
  { name: 'Ocean', primary: '#0C2340', secondary: '#1B5E8C', accent: '#B8D4E8', bg: '#EFF6FF' },
  { name: 'Plum', primary: '#2D1B69', secondary: '#6B5B95', accent: '#D4C5F9', bg: '#F5F3FF' },
  { name: 'Forest', primary: '#1A2E1A', secondary: '#3D6B41', accent: '#B9D4BC', bg: '#F0F7F0' },
  { name: 'Rose', primary: '#4A1942', secondary: '#9D174D', accent: '#FBCFE8', bg: '#FDF2F8' },
  { name: 'Slate', primary: '#0D0D0D', secondary: '#404040', accent: '#D4D4D4', bg: '#FAFAFA' },
  { name: 'Amber', primary: '#451A03', secondary: '#B45309', accent: '#FDE68A', bg: '#FFFBEB' },
  { name: 'Teal', primary: '#042F2E', secondary: '#0D9488', accent: '#99F6E4', bg: '#F0FDFA' },
]

// ── Google Fonts ──────────────────────────────────────────────────────────────
export const CURATED_FONTS = [
  { name: 'Inter', category: 'Sans-serif' },
  { name: 'Plus Jakarta Sans', category: 'Sans-serif' },
  { name: 'DM Sans', category: 'Sans-serif' },
  { name: 'Nunito', category: 'Sans-serif' },
  { name: 'Poppins', category: 'Sans-serif' },
  { name: 'Raleway', category: 'Sans-serif' },
  { name: 'Lato', category: 'Sans-serif' },
  { name: 'Montserrat', category: 'Sans-serif' },
  { name: 'Playfair Display', category: 'Serif' },
  { name: 'Cormorant Garamond', category: 'Serif' },
  { name: 'Libre Baskerville', category: 'Serif' },
  { name: 'Lora', category: 'Serif' },
  { name: 'Merriweather', category: 'Serif' },
  { name: 'EB Garamond', category: 'Serif' },
  { name: 'Dancing Script', category: 'Script' },
  { name: 'Pacifico', category: 'Script' },
  { name: 'Sacramento', category: 'Script' },
  { name: 'Great Vibes', category: 'Script' },
  { name: 'JetBrains Mono', category: 'Monospace' },
  { name: 'Space Mono', category: 'Monospace' },
]

// ── Color swatches ────────────────────────────────────────────────────────────
export const COLOR_SWATCHES = [
  { name: 'Midnight', value: '#0F172A' },
  { name: 'Charcoal', value: '#1E293B' },
  { name: 'Steel', value: '#334155' },
  { name: 'Mist', value: '#94A3B8' },
  { name: 'Cloud', value: '#E2E8F0' },
  { name: 'Snow', value: '#F8FAFC' },
  { name: 'Ivory', value: '#FFFDF7' },
  { name: 'Cream', value: '#FAF7F2' },
  { name: 'Parchment', value: '#F5EDD6' },
  { name: 'Sage', value: '#84A98C' },
  { name: 'Forest', value: '#52796F' },
  { name: 'Pine', value: '#344E41' },
  { name: 'Mint', value: '#B7E4C7' },
  { name: 'Blush', value: '#E8A598' },
  { name: 'Rose', value: '#FB7185' },
  { name: 'Crimson', value: '#BE123C' },
  { name: 'Dusty Pink', value: '#F2C4CE' },
  { name: 'Lavender', value: '#C4B5FD' },
  { name: 'Violet', value: '#7C3AED' },
  { name: 'Indigo', value: '#4338CA' },
  { name: 'Periwinkle', value: '#818CF8' },
  { name: 'Sky', value: '#38BDF8' },
  { name: 'Ocean', value: '#0369A1' },
  { name: 'Navy', value: '#1E3A5F' },
  { name: 'Gold', value: '#C9A96E' },
  { name: 'Amber', value: '#F59E0B' },
  { name: 'Caramel', value: '#A07840' },
  { name: 'Sand', value: '#E8D5B4' },
  { name: 'Terracotta', value: '#C0695C' },
  { name: 'Rust', value: '#9A3412' },
]

// ── Motivational quotes ────────────────────────────────────────────────────────
export const MOTIVATIONAL_QUOTES = [
  { quote: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { quote: 'It always seems impossible until it\'s done.', author: 'Nelson Mandela' },
  { quote: 'Success is the sum of small efforts repeated day in and day out.', author: 'Robert Collier' },
  { quote: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { quote: 'Plan your work and work your plan.', author: 'Napoleon Hill' },
  { quote: 'A goal without a plan is just a wish.', author: 'Antoine de Saint-Exupéry' },
  { quote: 'Focus on being productive instead of busy.', author: 'Tim Ferriss' },
  { quote: 'The key is not to prioritize what\'s on your schedule, but to schedule your priorities.', author: 'Stephen Covey' },
  { quote: 'Done is better than perfect.', author: 'Sheryl Sandberg' },
  { quote: 'Small daily improvements are the key to staggering long-term results.', author: 'Robin Sharma' },
  { quote: 'Your time is limited, so don\'t waste it living someone else\'s life.', author: 'Steve Jobs' },
  { quote: 'What gets scheduled gets done.', author: 'Michael Hyatt' },
]
