import React from 'react'
import type { PlannerBlock, PlannerConfig } from '@/types'
import { cn } from '@/utils/cn'
import { formatDate, getDaysInMonth, getFirstDayOfMonth } from '@/utils/date'

interface BlockRendererProps {
  block: PlannerBlock
  config: PlannerConfig
  isPreview?: boolean
}

// Time slots block
const TimeSlots: React.FC<{ config: Record<string, unknown>; primaryColor: string }> = ({
  config,
  primaryColor,
}) => {
  const startHour = (config.startHour as number) || 6
  const endHour = (config.endHour as number) || 22
  const interval = (config.interval as number) || 60
  const slots: string[] = []

  for (let h = startHour; h < endHour; h++) {
    if (interval <= 30) {
      slots.push(`${String(h).padStart(2, '0')}:00`)
      slots.push(`${String(h).padStart(2, '0')}:30`)
    } else {
      slots.push(`${String(h).padStart(2, '0')}:00`)
    }
  }

  return (
    <div className="space-y-0">
      {slots.map((time, i) => (
        <div key={i} className="flex items-start gap-2" style={{ minHeight: '20px' }}>
          <span
            className="text-[10px] font-medium w-10 flex-shrink-0 pt-0.5 leading-none"
            style={{ color: primaryColor + '80' }}
          >
            {time}
          </span>
          <div className="flex-1 border-b border-dashed" style={{ borderColor: primaryColor + '20', minHeight: '20px' }} />
        </div>
      ))}
    </div>
  )
}

// Todo list block
const TodoList: React.FC<{ config: Record<string, unknown>; primaryColor: string }> = ({
  config,
  primaryColor,
}) => {
  const count = (config.count as number) || 6
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded border flex-shrink-0"
            style={{ borderColor: primaryColor + '40' }}
          />
          <div
            className="flex-1 border-b"
            style={{ borderColor: primaryColor + '20', height: '18px' }}
          />
        </div>
      ))}
    </div>
  )
}

// Notes block
const Notes: React.FC<{ config: Record<string, unknown>; primaryColor: string }> = ({
  config,
  primaryColor,
}) => {
  const lines = (config.lines as number) || 5
  return (
    <div className="space-y-2.5">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="w-full border-b"
          style={{ borderColor: primaryColor + '20', height: '20px' }}
        />
      ))}
    </div>
  )
}

// Habit grid block
const HabitGrid: React.FC<{ config: Record<string, unknown>; primaryColor: string; accentColor: string }> = ({
  config,
  primaryColor,
  accentColor,
}) => {
  const habitCount = (config.habitCount as number) || 6
  const days = (config.daysInMonth as number) || 31
  const cols = Math.min(days, 31)

  return (
    <div className="overflow-x-auto">
      <div style={{ display: 'grid', gridTemplateColumns: `auto repeat(${cols}, minmax(0, 1fr))`, gap: '2px' }}>
        <div className="text-[9px] font-medium pb-1" style={{ color: primaryColor + '80' }}>Habit</div>
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="text-[9px] text-center font-medium" style={{ color: primaryColor + '80' }}>
            {i + 1}
          </div>
        ))}
        {Array.from({ length: habitCount }).map((_, row) => (
          <React.Fragment key={row}>
            <div
              className="text-[10px] py-1 pr-1 truncate"
              style={{ color: primaryColor, maxWidth: '80px', fontSize: '9px' }}
            >
              Habit {row + 1}
            </div>
            {Array.from({ length: cols }).map((_, col) => (
              <div
                key={col}
                className="rounded-sm"
                style={{
                  height: '14px',
                  backgroundColor: accentColor + '40',
                  border: `1px solid ${accentColor}`,
                }}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

// Budget row block
const BudgetRow: React.FC<{ config: Record<string, unknown>; primaryColor: string }> = ({
  config,
  primaryColor,
}) => {
  const rows = (config.rows as number) || 5
  return (
    <div>
      <div className="grid grid-cols-3 gap-2 mb-1">
        {['Description', 'Budgeted', 'Actual'].map(h => (
          <div key={h} className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: primaryColor + '80' }}>
            {h}
          </div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-3 gap-2 mb-1.5">
          {[0, 1, 2].map(col => (
            <div
              key={col}
              className="border-b"
              style={{ borderColor: primaryColor + '20', height: '18px' }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// Mood tracker
const MoodTracker: React.FC<{ primaryColor: string; accentColor: string }> = ({ primaryColor, accentColor }) => {
  const moods = ['😞', '😕', '😐', '😊', '😄']
  return (
    <div className="flex items-center justify-between">
      {moods.map((mood, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg border-2"
            style={{ borderColor: accentColor, backgroundColor: accentColor + '30' }}
          >
            {mood}
          </div>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
        </div>
      ))}
    </div>
  )
}

// Water tracker
const WaterTracker: React.FC<{ config: Record<string, unknown>; primaryColor: string; accentColor: string }> = ({
  config,
  primaryColor,
  accentColor,
}) => {
  const goal = (config.goal as number) || 8
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {Array.from({ length: goal }).map((_, i) => (
        <div
          key={i}
          className="w-8 h-10 rounded-full border-2 flex items-end justify-center pb-1"
          style={{ borderColor: primaryColor + '30' }}
        >
          <div
            className="w-4 rounded-full"
            style={{ height: '30%', backgroundColor: accentColor }}
          />
        </div>
      ))}
      <span className="text-[10px] text-secondary ml-1">/{goal} cups</span>
    </div>
  )
}

// Sleep tracker
const SleepTracker: React.FC<{ primaryColor: string }> = ({ primaryColor }) => (
  <div className="grid grid-cols-2 gap-3">
    {[
      { label: 'Bedtime', placeholder: '_ _ : _ _' },
      { label: 'Wake time', placeholder: '_ _ : _ _' },
      { label: 'Hours slept', placeholder: '___ hrs' },
      { label: 'Quality', placeholder: '⭐⭐⭐⭐⭐' },
    ].map(item => (
      <div key={item.label}>
        <div className="text-[9px] font-medium uppercase tracking-wide mb-1" style={{ color: primaryColor + '70' }}>
          {item.label}
        </div>
        <div
          className="border-b text-[11px]"
          style={{ borderColor: primaryColor + '20', color: primaryColor + '40', height: '20px' }}
        >
          {item.placeholder}
        </div>
      </div>
    ))}
  </div>
)

// Workout log
const WorkoutLog: React.FC<{ config: Record<string, unknown>; primaryColor: string }> = ({
  config,
  primaryColor,
}) => {
  const count = (config.exerciseCount as number) || 4
  return (
    <div>
      <div className="grid grid-cols-4 gap-2 mb-1.5">
        {['Exercise', 'Sets', 'Reps', 'Weight'].map(h => (
          <div key={h} className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: primaryColor + '70' }}>
            {h}
          </div>
        ))}
      </div>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-2 mb-2">
          {[0, 1, 2, 3].map(col => (
            <div
              key={col}
              className="border-b"
              style={{ borderColor: primaryColor + '20', height: '18px' }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// Goal section
const GoalSection: React.FC<{ config: Record<string, unknown>; primaryColor: string; accentColor: string }> = ({
  config,
  primaryColor,
  accentColor,
}) => {
  const count = (config.count as number) || 3
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center text-[10px] font-bold"
            style={{ backgroundColor: accentColor + '60', color: primaryColor }}
          >
            {i + 1}
          </div>
          <div className="flex-1 border-b" style={{ borderColor: primaryColor + '20', height: '20px' }} />
        </div>
      ))}
    </div>
  )
}

// Date header
const DateHeader: React.FC<{ config: Record<string, unknown>; primaryColor: string; secondaryColor: string }> = ({
  config,
  primaryColor,
  secondaryColor,
}) => {
  const today = new Date()
  return (
    <div className="flex items-baseline gap-3">
      {(config.showDay as boolean) && (
        <span
          className="text-sm font-semibold uppercase tracking-widest"
          style={{ color: secondaryColor }}
        >
          {formatDate(today, 'dddd')}
        </span>
      )}
      {(config.showDate as boolean) && (
        <span className="text-2xl font-bold font-display" style={{ color: primaryColor }}>
          {formatDate(today, 'MMMM D, YYYY')}
        </span>
      )}
      {(config.showMonth as boolean) && (
        <span className="text-2xl font-bold font-display" style={{ color: primaryColor }}>
          {formatDate(today, 'MMMM YYYY')}
        </span>
      )}
      {(config.showWeekNumber as boolean) && (
        <span className="text-sm font-medium" style={{ color: secondaryColor }}>
          Week {Math.ceil((((today.getTime() - new Date(today.getFullYear(), 0, 1).getTime()) / 86400000) + new Date(today.getFullYear(), 0, 1).getDay() + 1) / 7)}
        </span>
      )}
    </div>
  )
}

// Header block
const Header: React.FC<{ block: PlannerBlock; primaryColor: string }> = ({ block, primaryColor }) => (
  <div className="flex items-center gap-2">
    <div className="w-0.5 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: primaryColor }} />
    <h4 className="text-xs font-bold uppercase tracking-widest" style={{ color: primaryColor }}>
      {block.label}
    </h4>
  </div>
)

// Month calendar
const MonthCalendar: React.FC<{ primaryColor: string; accentColor: string }> = ({
  primaryColor,
  accentColor,
}) => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map(d => (
          <div key={d} className="text-[9px] font-bold text-center uppercase tracking-wide" style={{ color: primaryColor + '60' }}>
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => (
          <div
            key={i}
            className={cn(
              'aspect-square flex items-center justify-center text-[10px] rounded',
              day === today.getDate() ? 'font-bold text-white' : 'text-primary/70'
            )}
            style={{
              backgroundColor: day === today.getDate() ? primaryColor : 'transparent',
            }}
          >
            {day ?? ''}
          </div>
        ))}
      </div>
    </div>
  )
}

// Week grid
const WeekGrid: React.FC<{ primaryColor: string; accentColor: string }> = ({ primaryColor, accentColor }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return (
    <div className="grid grid-cols-7 gap-1">
      {days.map(d => (
        <div key={d}>
          <div
            className="text-[10px] font-semibold uppercase tracking-wide text-center mb-1"
            style={{ color: primaryColor + '70' }}
          >
            {d}
          </div>
          <div
            className="rounded-lg"
            style={{
              height: '120px',
              backgroundColor: accentColor + '20',
              border: `1px solid ${accentColor}`,
            }}
          />
        </div>
      ))}
    </div>
  )
}

// Priority matrix
const PriorityMatrix: React.FC<{ primaryColor: string; accentColor: string }> = ({
  primaryColor,
  accentColor,
}) => {
  const quadrants = [
    { label: 'Do First', sublabel: 'Urgent + Important', color: primaryColor },
    { label: 'Schedule', sublabel: 'Not Urgent + Important', color: primaryColor + 'CC' },
    { label: 'Delegate', sublabel: 'Urgent + Not Important', color: primaryColor + '88' },
    { label: 'Eliminate', sublabel: 'Not Urgent + Not Important', color: primaryColor + '44' },
  ]
  return (
    <div className="grid grid-cols-2 gap-1.5" style={{ height: '120px' }}>
      {quadrants.map(q => (
        <div
          key={q.label}
          className="rounded-lg p-2 flex flex-col"
          style={{ backgroundColor: accentColor + '30', border: `1px solid ${accentColor}` }}
        >
          <div className="text-[9px] font-bold uppercase tracking-wide" style={{ color: q.color }}>
            {q.label}
          </div>
          <div className="text-[8px]" style={{ color: primaryColor + '60' }}>{q.sublabel}</div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="mt-auto border-b" style={{ borderColor: primaryColor + '20', height: '14px' }} />
          ))}
        </div>
      ))}
    </div>
  )
}

// Gratitude block
const Gratitude: React.FC<{ config: Record<string, unknown>; primaryColor: string; accentColor: string }> = ({
  config,
  primaryColor,
  accentColor,
}) => {
  const count = (config.count as number) || 3
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-sm">{'✦'}</span>
          <div className="flex-1 border-b" style={{ borderColor: primaryColor + '20', height: '20px' }} />
        </div>
      ))}
    </div>
  )
}

// Reflection
const Reflection: React.FC<{ primaryColor: string }> = ({ primaryColor }) => (
  <div className="space-y-2">
    {['What went well?', 'What to improve?', 'Key takeaway?'].map(prompt => (
      <div key={prompt}>
        <div className="text-[9px] font-medium mb-1 uppercase tracking-wide" style={{ color: primaryColor + '70' }}>
          {prompt}
        </div>
        <div className="border-b" style={{ borderColor: primaryColor + '20', height: '20px' }} />
        <div className="border-b" style={{ borderColor: primaryColor + '20', height: '20px' }} />
      </div>
    ))}
  </div>
)

// Meal planner
const MealPlanner: React.FC<{ primaryColor: string }> = ({ primaryColor }) => {
  const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snacks']
  return (
    <div className="space-y-2">
      {meals.map(meal => (
        <div key={meal} className="flex items-center gap-2">
          <span className="text-[9px] w-16 font-medium uppercase tracking-wide flex-shrink-0" style={{ color: primaryColor + '70' }}>
            {meal}
          </span>
          <div className="flex-1 border-b" style={{ borderColor: primaryColor + '20', height: '18px' }} />
        </div>
      ))}
    </div>
  )
}

// Expense tracker
const ExpenseTracker: React.FC<{ config: Record<string, unknown>; primaryColor: string }> = ({
  config,
  primaryColor,
}) => {
  const rows = (config.rows as number) || 8
  return (
    <div>
      <div className="grid grid-cols-4 gap-2 mb-1">
        {['Date', 'Description', 'Category', 'Amount'].map(h => (
          <div key={h} className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: primaryColor + '70' }}>
            {h}
          </div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-2 mb-1.5">
          {[0, 1, 2, 3].map(col => (
            <div
              key={col}
              className="border-b"
              style={{ borderColor: primaryColor + '20', height: '16px' }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// Class schedule
const ClassSchedule: React.FC<{ config: Record<string, unknown>; primaryColor: string; accentColor: string }> = ({
  config,
  primaryColor,
  accentColor,
}) => {
  const periods = (config.periods as number) || 5
  return (
    <div>
      <div className="grid grid-cols-4 gap-2 mb-1">
        {['Period', 'Class', 'Room', 'Teacher'].map(h => (
          <div key={h} className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: primaryColor + '70' }}>
            {h}
          </div>
        ))}
      </div>
      {Array.from({ length: periods }).map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-2 mb-1.5 items-center">
          <div
            className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold"
            style={{ backgroundColor: accentColor + '50', color: primaryColor }}
          >
            {i + 1}
          </div>
          {[1, 2, 3].map(col => (
            <div key={col} className="border-b" style={{ borderColor: primaryColor + '20', height: '18px' }} />
          ))}
        </div>
      ))}
    </div>
  )
}

// Project tracker
const ProjectTracker: React.FC<{ config: Record<string, unknown>; primaryColor: string; accentColor: string }> = ({
  config,
  primaryColor,
  accentColor,
}) => {
  const count = (config.count as number) || 3
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg p-2" style={{ backgroundColor: accentColor + '25', border: `1px solid ${accentColor}` }}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="border-b flex-1" style={{ borderColor: primaryColor + '20', height: '14px' }} />
            <span className="text-[9px] ml-2 text-secondary">0%</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ backgroundColor: accentColor }}>
            <div className="h-full w-0 rounded-full" style={{ backgroundColor: primaryColor }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// Main block renderer
export const PlannerBlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  config,
  isPreview = false,
}) => {
  const { primaryColor, secondaryColor, accentColor } = config

  const renderContent = () => {
    switch (block.type) {
      case 'date-header':
        return <DateHeader config={block.config} primaryColor={primaryColor} secondaryColor={secondaryColor} />
      case 'header':
        return <Header block={block} primaryColor={primaryColor} />
      case 'time-slots':
        return <TimeSlots config={block.config} primaryColor={primaryColor} />
      case 'todo-list':
        return <TodoList config={block.config} primaryColor={primaryColor} />
      case 'notes':
        return <Notes config={block.config} primaryColor={primaryColor} />
      case 'habit-grid':
        return <HabitGrid config={block.config} primaryColor={primaryColor} accentColor={accentColor} />
      case 'budget-row':
        return <BudgetRow config={block.config} primaryColor={primaryColor} />
      case 'mood-tracker':
        return <MoodTracker primaryColor={primaryColor} accentColor={accentColor} />
      case 'water-tracker':
        return <WaterTracker config={block.config} primaryColor={primaryColor} accentColor={accentColor} />
      case 'sleep-tracker':
        return <SleepTracker primaryColor={primaryColor} />
      case 'workout-log':
        return <WorkoutLog config={block.config} primaryColor={primaryColor} />
      case 'goal-section':
        return <GoalSection config={block.config} primaryColor={primaryColor} accentColor={accentColor} />
      case 'month-calendar':
        return <MonthCalendar primaryColor={primaryColor} accentColor={accentColor} />
      case 'week-grid':
        return <WeekGrid primaryColor={primaryColor} accentColor={accentColor} />
      case 'priority-matrix':
        return <PriorityMatrix primaryColor={primaryColor} accentColor={accentColor} />
      case 'gratitude':
        return <Gratitude config={block.config} primaryColor={primaryColor} accentColor={accentColor} />
      case 'reflection':
        return <Reflection primaryColor={primaryColor} />
      case 'meal-planner':
        return <MealPlanner primaryColor={primaryColor} />
      case 'expense-tracker':
        return <ExpenseTracker config={block.config} primaryColor={primaryColor} />
      case 'class-schedule':
        return <ClassSchedule config={block.config} primaryColor={primaryColor} accentColor={accentColor} />
      case 'project-tracker':
        return <ProjectTracker config={block.config} primaryColor={primaryColor} accentColor={accentColor} />
      case 'divider':
        return <div className="h-px w-full" style={{ backgroundColor: accentColor }} />
      case 'spacer':
        return <div style={{ height: '16px' }} />
      default:
        return null
    }
  }

  const content = renderContent()
  if (!content) return null

  const isInline = ['header', 'date-header', 'divider', 'spacer'].includes(block.type)

  return (
    <div
      className={cn(!isInline && 'mb-3')}
      style={{
        padding: isInline ? 0 : `${block.style.padding}px`,
        backgroundColor: block.style.backgroundColor !== 'transparent' ? block.style.backgroundColor : undefined,
        borderRadius: block.style.borderRadius ? `${block.style.borderRadius}px` : undefined,
        border: block.style.borderWidth && block.style.backgroundColor !== 'transparent'
          ? `${block.style.borderWidth}px solid ${block.style.borderColor}`
          : undefined,
      }}
    >
      {block.type !== 'header' && block.type !== 'date-header' && block.type !== 'divider' && block.type !== 'spacer' && (
        <div
          className="text-[9px] font-semibold uppercase tracking-widest mb-2"
          style={{ color: primaryColor + '70' }}
        >
          {block.label}
        </div>
      )}
      {content}
    </div>
  )
}
