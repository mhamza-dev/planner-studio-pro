import React from 'react'
import { useDrag } from 'react-dnd'
import type { BlockType } from '@/types'
import { cn } from '@/utils/cn'

interface BlockDef {
  type: BlockType
  label: string
  icon: string
  description: string
  category: string
}

const BLOCK_DEFS: BlockDef[] = [
  { type: 'date-header',     label: 'Date Header',      icon: '📅', description: 'Show current date',          category: 'Structure' },
  { type: 'header',          label: 'Section Header',   icon: '📌', description: 'Labeled section divider',    category: 'Structure' },
  { type: 'divider',         label: 'Divider',          icon: '─',  description: 'Horizontal line',            category: 'Structure' },
  { type: 'spacer',          label: 'Spacer',           icon: '⬜', description: 'Empty vertical space',       category: 'Structure' },
  { type: 'time-slots',      label: 'Time Slots',       icon: '⏰', description: 'Hourly schedule grid',       category: 'Planning'  },
  { type: 'todo-list',       label: 'To-Do List',       icon: '✅', description: 'Checkbox task list',         category: 'Planning'  },
  { type: 'goal-section',    label: 'Goals',            icon: '🎯', description: 'Numbered goal list',         category: 'Planning'  },
  { type: 'priority-matrix', label: 'Priority Matrix',  icon: '🧭', description: 'Eisenhower 2×2 grid',        category: 'Planning'  },
  { type: 'week-grid',       label: 'Week Grid',        icon: '🗓', description: '7-day column layout',        category: 'Planning'  },
  { type: 'month-calendar',  label: 'Month Calendar',   icon: '📆', description: 'Full monthly calendar',      category: 'Planning'  },
  { type: 'notes',           label: 'Notes',            icon: '📝', description: 'Lined note section',         category: 'Writing'   },
  { type: 'reflection',      label: 'Reflection',       icon: '🪞', description: 'EOD review prompts',         category: 'Writing'   },
  { type: 'gratitude',       label: 'Gratitude',        icon: '✨', description: 'Gratitude list',             category: 'Writing'   },
  { type: 'habit-grid',      label: 'Habit Grid',       icon: '📊', description: 'Monthly habit tracker',      category: 'Tracking'  },
  { type: 'mood-tracker',    label: 'Mood Tracker',     icon: '😊', description: 'Daily mood selector',        category: 'Tracking'  },
  { type: 'water-tracker',   label: 'Water Tracker',    icon: '💧', description: 'Hydration log',              category: 'Tracking'  },
  { type: 'sleep-tracker',   label: 'Sleep Log',        icon: '😴', description: 'Sleep time & quality',       category: 'Tracking'  },
  { type: 'workout-log',     label: 'Workout Log',      icon: '💪', description: 'Exercise sets & reps',       category: 'Tracking'  },
  { type: 'meal-planner',    label: 'Meal Planner',     icon: '🥗', description: 'Daily meal sections',        category: 'Tracking'  },
  { type: 'budget-row',      label: 'Budget Table',     icon: '💰', description: 'Income/expense rows',        category: 'Finance'   },
  { type: 'expense-tracker', label: 'Expense Log',      icon: '🧾', description: 'Date+amount log',            category: 'Finance'   },
  { type: 'class-schedule',  label: 'Class Schedule',   icon: '🎓', description: 'Period/class grid',          category: 'Academic'  },
  { type: 'project-tracker', label: 'Project Tracker',  icon: '📋', description: 'Project progress bars',      category: 'Business'  },
  { type: 'custom-text',     label: 'Custom Text',      icon: '💬', description: 'Free-form text block',       category: 'Writing'   },
]

const CATEGORIES = ['All', 'Structure', 'Planning', 'Writing', 'Tracking', 'Finance', 'Academic', 'Business']

function DraggableBlock({ def, onAdd }: { def: BlockDef; onAdd: () => void }) {
  // IMPORTANT: item.type must exactly equal the accept string used in useDrop
  const [{ isDragging }, drag] = useDrag({
    type: 'PALETTE_BLOCK',           // ← matches accept in BuilderCanvas
    item: { blockType: def.type },   // ← only blockType needed; DnD uses the 'type' key above
    collect: m => ({ isDragging: m.isDragging() }),
  })

  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      onDoubleClick={onAdd}
      className={cn(
        'flex items-center gap-2.5 p-2.5 rounded-lg border border-border cursor-grab active:cursor-grabbing select-none',
        'hover:bg-background hover:border-accent-dark hover:shadow-sm transition-all duration-100 bg-paper',
        isDragging && 'opacity-30 scale-95 shadow-float',
      )}
      title={`${def.description} — drag or double-click`}
    >
      <span className="text-base w-5 flex-shrink-0 text-center leading-none">{def.icon}</span>
      <div className="min-w-0">
        <div className="text-xs font-medium text-primary leading-none truncate">{def.label}</div>
        <div className="text-[10px] text-secondary mt-0.5 truncate">{def.description}</div>
      </div>
    </div>
  )
}

interface BlockPaletteProps {
  onAddBlock: (blockType: BlockType) => void
}

export const BlockPalette: React.FC<BlockPaletteProps> = ({ onAddBlock }) => {
  const [activeCategory, setActiveCategory] = React.useState('All')
  const [search, setSearch] = React.useState('')

  const filtered = BLOCK_DEFS.filter(d => {
    const matchCat = activeCategory === 'All' || d.category === activeCategory
    const matchSearch = !search || d.label.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const grouped = CATEGORIES.slice(1).reduce<Record<string, BlockDef[]>>((acc, cat) => {
    const items = filtered.filter(d => d.category === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {})

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b border-border flex-shrink-0 space-y-2">
        <input
          type="search"
          placeholder="Search blocks…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-8 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
        />
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors',
                activeCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-background text-secondary hover:text-primary',
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {activeCategory === 'All'
          ? Object.entries(grouped).map(([cat, defs]) => (
              <div key={cat}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-secondary mb-2 px-0.5">{cat}</p>
                <div className="space-y-1">
                  {defs.map(def => (
                    <DraggableBlock key={def.type} def={def} onAdd={() => onAddBlock(def.type)} />
                  ))}
                </div>
              </div>
            ))
          : (
            <div className="space-y-1">
              {filtered.map(def => (
                <DraggableBlock key={def.type} def={def} onAdd={() => onAddBlock(def.type)} />
              ))}
            </div>
          )
        }
        {filtered.length === 0 && (
          <p className="text-xs text-secondary text-center py-8">No blocks found</p>
        )}
        <p className="text-[10px] text-secondary/60 text-center pb-2">
          Drag onto canvas · Double-click to add
        </p>
      </div>
    </div>
  )
}
