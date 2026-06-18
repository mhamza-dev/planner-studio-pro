import type { PlannerConfig, PlannerBlock, PlannerPage, PlannerType, BlockStyle } from '@/types'
import { generateId } from '@/utils/id'

export const DEFAULT_BLOCK_STYLE: BlockStyle = {
  backgroundColor: 'transparent',
  borderColor: '#E7E5E4',
  borderWidth: 1,
  borderRadius: 4,
  padding: 12,
}

export const DEFAULT_CONFIG: PlannerConfig = {
  pageSize: 'A4',
  orientation: 'portrait',
  primaryColor: '#111827',
  secondaryColor: '#6B7280',
  accentColor: '#D6CFC7',
  fontFamily: 'Inter',
  showPageNumbers: true,
  showDates: true,
  weekStartsOn: 1,
}

function makeBlock(type: PlannerBlock['type'], label: string, order: number, config: Record<string, unknown> = {}): PlannerBlock {
  return {
    id: generateId('block'),
    type,
    label,
    order,
    style: { ...DEFAULT_BLOCK_STYLE },
    config,
    locked: false,
  }
}

function makePage(title: string, order: number, blocks: PlannerBlock[]): PlannerPage {
  return {
    id: generateId('page'),
    title,
    order,
    blocks,
    pageSize: 'A4',
    orientation: 'portrait',
    margin: 24,
  }
}

export const PLANNER_TYPE_PAGES: Record<PlannerType, () => PlannerPage[]> = {
  daily: () => [
    makePage('Daily Plan', 0, [
      makeBlock('date-header', 'Date', 0, { showDay: true, showDate: true }),
      makeBlock('header', 'Top Priorities', 1, { count: 3 }),
      makeBlock('time-slots', 'Schedule', 2, { startHour: 6, endHour: 22, interval: 30 }),
      makeBlock('todo-list', 'Tasks', 3, { count: 8 }),
      makeBlock('notes', 'Notes', 4, { lines: 6 }),
      makeBlock('gratitude', 'Gratitude', 5, { count: 3 }),
    ]),
  ],
  weekly: () => [
    makePage('Weekly Overview', 0, [
      makeBlock('date-header', 'Week', 0, { showWeekNumber: true }),
      makeBlock('week-grid', 'Weekly Grid', 1, { showTimeSlots: true }),
      makeBlock('goal-section', 'Weekly Goals', 2, { count: 5 }),
      makeBlock('notes', 'Notes', 3, { lines: 4 }),
    ]),
  ],
  monthly: () => [
    makePage('Monthly Overview', 0, [
      makeBlock('date-header', 'Month', 0, { showMonth: true, showYear: true }),
      makeBlock('month-calendar', 'Calendar', 1, {}),
      makeBlock('goal-section', 'Monthly Goals', 2, { count: 5 }),
      makeBlock('notes', 'Notes', 3, { lines: 4 }),
    ]),
  ],
  habit: () => [
    makePage('Habit Tracker', 0, [
      makeBlock('date-header', 'Month', 0, { showMonth: true }),
      makeBlock('habit-grid', 'Habits', 1, { habitCount: 8, daysInMonth: 31 }),
      makeBlock('notes', 'Reflection', 2, { lines: 4 }),
    ]),
  ],
  budget: () => [
    makePage('Budget Planner', 0, [
      makeBlock('date-header', 'Month', 0, { showMonth: true }),
      makeBlock('header', 'Income', 1, {}),
      makeBlock('budget-row', 'Income Sources', 2, { rows: 5 }),
      makeBlock('header', 'Fixed Expenses', 3, {}),
      makeBlock('budget-row', 'Fixed Expenses', 4, { rows: 6 }),
      makeBlock('header', 'Variable Expenses', 5, {}),
      makeBlock('expense-tracker', 'Expense Log', 6, { rows: 10 }),
      makeBlock('notes', 'Notes', 7, { lines: 3 }),
    ]),
  ],
  wellness: () => [
    makePage('Wellness Tracker', 0, [
      makeBlock('date-header', 'Date', 0, { showDate: true }),
      makeBlock('mood-tracker', 'Mood', 1, {}),
      makeBlock('water-tracker', 'Water Intake', 2, { goal: 8 }),
      makeBlock('sleep-tracker', 'Sleep', 3, {}),
      makeBlock('meal-planner', 'Meals', 4, {}),
      makeBlock('gratitude', 'Gratitude', 5, { count: 3 }),
      makeBlock('notes', 'Daily Reflection', 6, { lines: 4 }),
    ]),
  ],
  fitness: () => [
    makePage('Workout Log', 0, [
      makeBlock('date-header', 'Date', 0, { showDate: true }),
      makeBlock('workout-log', 'Workout', 1, { exerciseCount: 6 }),
      makeBlock('water-tracker', 'Water', 2, { goal: 10 }),
      makeBlock('notes', 'Notes', 3, { lines: 4 }),
    ]),
  ],
  student: () => [
    makePage('Student Planner', 0, [
      makeBlock('date-header', 'Date', 0, { showDay: true, showDate: true }),
      makeBlock('class-schedule', 'Classes', 1, { periods: 6 }),
      makeBlock('todo-list', 'Assignments', 2, { count: 8 }),
      makeBlock('goal-section', 'Study Goals', 3, { count: 3 }),
      makeBlock('notes', 'Notes', 4, { lines: 5 }),
    ]),
  ],
  business: () => [
    makePage('Business Planner', 0, [
      makeBlock('date-header', 'Date', 0, { showDate: true }),
      makeBlock('priority-matrix', 'Priority Matrix', 1, {}),
      makeBlock('todo-list', 'Action Items', 2, { count: 8 }),
      makeBlock('project-tracker', 'Projects', 3, { count: 4 }),
      makeBlock('notes', 'Meeting Notes', 4, { lines: 5 }),
      makeBlock('reflection', 'EOD Reflection', 5, {}),
    ]),
  ],
}

export const PLANNER_TYPE_LABELS: Record<PlannerType, string> = {
  daily: 'Daily Planner',
  weekly: 'Weekly Planner',
  monthly: 'Monthly Planner',
  habit: 'Habit Tracker',
  budget: 'Budget Planner',
  wellness: 'Wellness Planner',
  fitness: 'Fitness Planner',
  student: 'Student Planner',
  business: 'Business Planner',
}

export const PLANNER_TYPE_DESCRIPTIONS: Record<PlannerType, string> = {
  daily: 'Hour-by-hour scheduling with priority blocks and reflection',
  weekly: 'Full week overview with goals and task tracking',
  monthly: 'Calendar view with monthly goals and habit tracking',
  habit: 'Track up to 20 habits across the full month',
  budget: 'Income, expenses, and savings tracker',
  wellness: 'Mind and body check-ins, water, sleep, and mood',
  fitness: 'Workout logging with sets, reps, and progress',
  student: 'Class schedule, assignments, and study goals',
  business: 'Priority matrix, projects, and team tracking',
}

export const PALETTE_PRESETS = [
  { name: 'Classic', primary: '#111827', secondary: '#6B7280', accent: '#D6CFC7' },
  { name: 'Sage', primary: '#2D4A22', secondary: '#4A7C59', accent: '#C8D5B9' },
  { name: 'Blush', primary: '#4A1942', secondary: '#8B4B6E', accent: '#F2C4CE' },
  { name: 'Ocean', primary: '#0C2340', secondary: '#1B5E8C', accent: '#B8D4E8' },
  { name: 'Terracotta', primary: '#3D1A08', secondary: '#8B3A00', accent: '#F2C49B' },
  { name: 'Lavender', primary: '#2D1B69', secondary: '#6B5B95', accent: '#D4C5F9' },
  { name: 'Forest', primary: '#1A2E1A', secondary: '#3D6B41', accent: '#B9D4BC' },
  { name: 'Ink', primary: '#0D0D0D', secondary: '#404040', accent: '#BFBFBF' },
]
