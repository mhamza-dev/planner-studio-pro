import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import {
  Calendar, Clock, CheckSquare, Target, LayoutGrid, CalendarDays,
  Timer, Kanban, List, FileText, Sparkles, Quote, Brain, Focus,
  Users, BookOpen, BarChart2, Droplets, Moon, Dumbbell, UtensilsCrossed,
  TrendingUp, PiggyBank, Phone, CreditCard, Receipt, GraduationCap,
  FolderKanban, Minus, Square, Columns2, Star, Hash, ArrowDownUp,
  StickyNote, ClipboardList, Milestone, Trophy, Share2, Store, KeyRound, Home, CalendarCheck, Image
} from 'lucide-react'
import type { BlockType } from '@/types'
import { cn } from '@/utils/cn'
import { getDefaultBlockConfig } from '@/lib/defaults'

interface BlockDef {
  type: BlockType
  label: string
  icon: React.ReactNode
  description: string
  category: string
}

const BLOCK_DEFS: BlockDef[] = [
  // Structure
  { type: 'date-header',      label: 'Date Header',      icon: <Calendar size={14}/>,      description: 'Show current date & day',         category: 'Structure' },
  { type: 'header',           label: 'Section Header',   icon: <Hash size={14}/>,           description: 'Labeled section divider',          category: 'Structure' },
  { type: 'cover-title',      label: 'Cover Title',      icon: <Star size={14}/>,           description: 'Planner cover with title',         category: 'Structure' },
  { type: 'divider',          label: 'Divider',          icon: <Minus size={14}/>,          description: 'Horizontal separator line',        category: 'Structure' },
  { type: 'spacer',           label: 'Spacer',           icon: <Square size={14}/>,         description: 'Empty vertical space',            category: 'Structure' },
  { type: 'two-column',       label: 'Two Column',       icon: <Columns2 size={14}/>,       description: 'Split content side by side',      category: 'Structure' },
  { type: 'table-of-contents',label: 'Contents',         icon: <List size={14}/>,           description: 'Auto table of contents',          category: 'Structure' },

  // Planning
  { type: 'time-slots',       label: 'Time Slots',       icon: <Clock size={14}/>,          description: 'Hourly schedule grid',            category: 'Planning' },
  { type: 'todo-list',        label: 'To-Do List',       icon: <CheckSquare size={14}/>,    description: 'Checkbox task list',              category: 'Planning' },
  { type: 'goal-section',     label: 'Goals',            icon: <Target size={14}/>,         description: 'Numbered goal list',              category: 'Planning' },
  { type: 'priority-matrix',  label: 'Priority Matrix',  icon: <LayoutGrid size={14}/>,     description: 'Eisenhower 2×2 grid',             category: 'Planning' },
  { type: 'week-grid',        label: 'Week Grid',        icon: <CalendarDays size={14}/>,   description: '7-day column layout',             category: 'Planning' },
  { type: 'month-calendar',   label: 'Month Calendar',   icon: <Calendar size={14}/>,       description: 'Full monthly calendar',           category: 'Planning' },
  { type: 'countdown',        label: 'Countdown',        icon: <Timer size={14}/>,          description: 'Days until a goal date',          category: 'Planning' },
  { type: 'kanban',           label: 'Kanban Board',     icon: <Kanban size={14}/>,         description: 'To Do / In Progress / Done',      category: 'Planning' },
  { type: 'checklist',        label: 'Checklist',        icon: <ClipboardList size={14}/>,  description: 'Categorised checklist',           category: 'Planning' },
  { type: 'social-calendar',  label: 'Social Calendar',  icon: <Share2 size={14}/>,         description: 'Platform content schedule',       category: 'Planning' },
  { type: 'etsy-listing',     label: 'Etsy Listing Prep',icon: <Store size={14}/>,          description: 'SEO, files, mockups, launch',     category: 'Planning' },

  // Writing
  { type: 'notes',            label: 'Notes',            icon: <FileText size={14}/>,       description: 'Lined note section',              category: 'Writing' },
  { type: 'brain-dump',       label: 'Brain Dump',       icon: <Brain size={14}/>,          description: 'Free-form writing area',          category: 'Writing' },
  { type: 'focus-block',      label: 'Focus Block',      icon: <Focus size={14}/>,          description: 'Single-focus writing zone',       category: 'Writing' },
  { type: 'reflection',       label: 'Reflection',       icon: <StickyNote size={14}/>,     description: 'EOD review prompts',              category: 'Writing' },
  { type: 'gratitude',        label: 'Gratitude',        icon: <Sparkles size={14}/>,       description: 'Gratitude list',                  category: 'Writing' },
  { type: 'quote-block',      label: 'Quote',            icon: <Quote size={14}/>,          description: 'Styled motivational quote',       category: 'Writing' },
  { type: 'meeting-notes',    label: 'Meeting Notes',    icon: <Users size={14}/>,          description: 'Agenda, attendees, action items', category: 'Writing' },
  { type: 'reading-log',      label: 'Reading Log',      icon: <BookOpen size={14}/>,       description: 'Book title, author, rating',      category: 'Writing' },
  { type: 'custom-text',      label: 'Custom Text',      icon: <FileText size={14}/>,       description: 'Free-form editable text',         category: 'Writing' },

  // Tracking
  { type: 'habit-grid',       label: 'Habit Grid',       icon: <LayoutGrid size={14}/>,     description: 'Monthly habit tracker grid',      category: 'Tracking' },
  { type: 'mood-tracker',     label: 'Mood Tracker',     icon: <Sparkles size={14}/>,       description: 'Daily mood rating',               category: 'Tracking' },
  { type: 'water-tracker',    label: 'Water Tracker',    icon: <Droplets size={14}/>,       description: 'Hydration log',                   category: 'Tracking' },
  { type: 'sleep-tracker',    label: 'Sleep Log',        icon: <Moon size={14}/>,           description: 'Sleep time & quality',            category: 'Tracking' },
  { type: 'workout-log',      label: 'Workout Log',      icon: <Dumbbell size={14}/>,       description: 'Sets, reps & weight',             category: 'Tracking' },
  { type: 'meal-planner',     label: 'Meal Planner',     icon: <UtensilsCrossed size={14}/>,description: 'Daily meal sections',             category: 'Tracking' },
  { type: 'meal-plan-week',   label: 'Weekly Meals',     icon: <CalendarCheck size={14}/>,  description: '7-day meal planning grid',        category: 'Tracking' },
  { type: 'progress-bar',     label: 'Progress Bar',     icon: <TrendingUp size={14}/>,     description: 'Labelled percentage bar',         category: 'Tracking' },
  { type: 'savings-tracker',  label: 'Savings Tracker',  icon: <PiggyBank size={14}/>,      description: 'Goal amount + progress',          category: 'Tracking' },
  { type: 'contact-card',     label: 'Contact Card',     icon: <Phone size={14}/>,          description: 'Name, phone, email rows',         category: 'Tracking' },
  { type: 'password-log',     label: 'Password Log',     icon: <KeyRound size={14}/>,       description: 'Account details tracker',         category: 'Tracking' },
  { type: 'cleaning-zone',    label: 'Cleaning Zones',   icon: <Home size={14}/>,           description: 'Room-by-room cleaning tasks',     category: 'Tracking' },
  { type: 'vision-board',     label: 'Vision Board',     icon: <Image size={14}/>,          description: 'Goal and inspiration placeholders',category: 'Tracking' },

  // Finance
  { type: 'budget-row',       label: 'Budget Table',     icon: <CreditCard size={14}/>,     description: 'Income / expense rows',           category: 'Finance' },
  { type: 'expense-tracker',  label: 'Expense Log',      icon: <Receipt size={14}/>,        description: 'Date + amount log',               category: 'Finance' },

  // Academic & Business
  { type: 'class-schedule',   label: 'Class Schedule',   icon: <GraduationCap size={14}/>,  description: 'Period / class / room grid',      category: 'Academic' },
  { type: 'project-tracker',  label: 'Project Tracker',  icon: <FolderKanban size={14}/>,   description: 'Project progress bars',           category: 'Business' },
]

const CATEGORIES = ['All','Structure','Planning','Writing','Tracking','Finance','Academic','Business']

// ── Draggable block tile ───────────────────────────────────────────────────────
function BlockTile({ def, onAdd }: { def: BlockDef; onAdd: () => void }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'PALETTE_BLOCK',
    item: { blockType: def.type },
    collect: m => ({ isDragging: m.isDragging() }),
  })

  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      onDoubleClick={onAdd}
      title={`${def.description} — drag to canvas or double-click to add`}
      className={cn(
        'flex items-center gap-2.5 px-2.5 py-2 rounded-lg border border-white/80 bg-white/85 shadow-xs backdrop-blur',
        'cursor-grab active:cursor-grabbing select-none',
        'hover:border-accent/40 hover:bg-white hover:shadow-card transition-all duration-100',
        isDragging && 'opacity-30 scale-95',
      )}
    >
      <span className="text-ink-muted shrink-0">{def.icon}</span>
      <div className="min-w-0">
        <div className="text-xs font-medium text-primary truncate leading-none">{def.label}</div>
        <div className="text-[10px] text-ink-muted mt-0.5 truncate">{def.description}</div>
      </div>
    </div>
  )
}

// ── Main palette ───────────────────────────────────────────────────────────────
interface BlockPaletteProps {
  onAddBlock: (type: BlockType) => void
}

export const BlockPalette: React.FC<BlockPaletteProps> = ({ onAddBlock }) => {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = BLOCK_DEFS.filter(d => {
    const matchCat = category === 'All' || d.category === category
    const matchSearch = !search ||
      d.label.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const grouped = CATEGORIES.slice(1).reduce<Record<string, BlockDef[]>>((acc, cat) => {
    const items = filtered.filter(d => d.category === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {})

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Search + filter */}
      <div className="p-3 border-b border-white/70 shrink-0 space-y-2 bg-white/50">
        <input
          type="search"
          placeholder="Search blocks…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-8 px-2.5 text-xs rounded-lg border border-white/80 bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 placeholder:text-ink-faint shadow-xs"
        />
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors',
                category === cat
                  ? 'bg-primary text-white'
                  : 'bg-white/80 text-ink-muted hover:text-primary hover:bg-white',
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Block list */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-3">
        {category === 'All'
          ? Object.entries(grouped).map(([cat, defs]) => (
            <div key={cat}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint mb-1.5 px-0.5">{cat}</p>
              <div className="space-y-1">
                {defs.map(def => (
                  <BlockTile key={def.type} def={def} onAdd={() => onAddBlock(def.type)} />
                ))}
              </div>
            </div>
          ))
          : (
            <div className="space-y-1">
              {filtered.map(def => (
                <BlockTile key={def.type} def={def} onAdd={() => onAddBlock(def.type)} />
              ))}
            </div>
          )
        }
        {filtered.length === 0 && (
          <p className="text-xs text-ink-muted text-center py-8">No blocks match "{search}"</p>
        )}
        <p className="text-[10px] text-ink-faint text-center pb-2">Double-click or drag to canvas</p>
      </div>
    </div>
  )
}

export { BLOCK_DEFS, getDefaultBlockConfig }
