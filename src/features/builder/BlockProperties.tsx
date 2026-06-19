import React from 'react'
import { Trash2, Copy, ChevronUp, ChevronDown, Lock, Unlock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { Slider, Toggle } from '@/components/ui/Slider'
import { usePlannerStore } from '@/store/plannerStore'
import { cn } from '@/utils/cn'
import type { PlannerBlock } from '@/types'

// ── tiny inline number spinner ───────────────────────────────────────────────
function Spinner({
  label, value, onChange, min = 1, max = 99, suffix = '',
}: {
  label: string; value: number; onChange: (v: number) => void
  min?: number; max?: number; suffix?: string
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <label className="text-xs text-secondary flex-1">{label}</label>
      <div className="flex items-center border border-border rounded-md overflow-hidden">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-7 h-7 flex items-center justify-center text-secondary hover:bg-background hover:text-primary transition-colors text-sm font-bold"
        >−</button>
        <span className="min-w-[2.5rem] text-center text-xs font-semibold text-primary px-1">
          {value}{suffix}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-7 h-7 flex items-center justify-center text-secondary hover:bg-background hover:text-primary transition-colors text-sm font-bold"
        >+</button>
      </div>
    </div>
  )
}

// ── inline select ────────────────────────────────────────────────────────────
function InlineSelect({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void
  options: { label: string; value: string }[]
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <label className="text-xs text-secondary flex-1">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-7 px-2 text-xs rounded-md border border-border bg-background text-primary focus:outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

// ── section heading ──────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-secondary/70">{title}</p>
      {children}
    </div>
  )
}

// ── divider ──────────────────────────────────────────────────────────────────
function Divider() {
  return <div className="h-px bg-border" />
}

// ── main component ───────────────────────────────────────────────────────────
interface BlockPropertiesProps {
  block: PlannerBlock
  plannerId: string
  pageId: string
}

export const BlockProperties: React.FC<BlockPropertiesProps> = ({ block, plannerId, pageId }) => {
  const { updateBlock, deleteBlock, duplicateBlock, reorderBlocks, getActivePage } = usePlannerStore()

  const page = getActivePage()
  const blockIndex = page?.blocks.findIndex(b => b.id === block.id) ?? -1
  const total = page?.blocks.length ?? 0

  const update = (updates: Partial<PlannerBlock>) =>
    updateBlock(plannerId, pageId, block.id, updates)

  const cfg = <T,>(key: string, fallback: T): T =>
    (block.config[key] as T) ?? fallback

  const setConfig = (key: string, value: unknown) =>
    update({ config: { ...block.config, [key]: value } })

  const setStyle = (key: keyof PlannerBlock['style'], value: unknown) =>
    update({ style: { ...block.style, [key]: value } })

  // ── block-specific content settings ────────────────────────────────────────
  const renderContentSettings = () => {
    switch (block.type) {
      // ── TIME SLOTS ──────────────────────────────────────────────────────────
      case 'time-slots':
        return (
          <Section title="Schedule">
            <InlineSelect
              label="Start hour"
              value={String(cfg('startHour', 6))}
              onChange={v => setConfig('startHour', Number(v))}
              options={Array.from({ length: 24 }, (_, i) => ({
                value: String(i),
                label: `${String(i).padStart(2, '0')}:00`,
              }))}
            />
            <InlineSelect
              label="End hour"
              value={String(cfg('endHour', 22))}
              onChange={v => setConfig('endHour', Number(v))}
              options={Array.from({ length: 24 }, (_, i) => ({
                value: String(i),
                label: `${String(i).padStart(2, '0')}:00`,
              }))}
            />
            <InlineSelect
              label="Interval"
              value={String(cfg('interval', 60))}
              onChange={v => setConfig('interval', Number(v))}
              options={[
                { value: '15', label: '15 min' },
                { value: '30', label: '30 min' },
                { value: '60', label: '1 hour' },
              ]}
            />
          </Section>
        )

      // ── NOTES ────────────────────────────────────────────────────────────────
      case 'notes':
        return (
          <Section title="Lines">
            <Spinner label="Number of lines" value={cfg('lines', 6)} onChange={v => setConfig('lines', v)} min={2} max={30} />
          </Section>
        )

      // ── TODO / GOALS / GRATITUDE ─────────────────────────────────────────────
      case 'todo-list':
        return (
          <Section title="Items">
            <Spinner label="Number of items" value={cfg('count', 8)} onChange={v => setConfig('count', v)} min={2} max={20} />
          </Section>
        )

      case 'goal-section':
        return (
          <Section title="Goals">
            <Spinner label="Number of goals" value={cfg('count', 5)} onChange={v => setConfig('count', v)} min={1} max={15} />
          </Section>
        )

      case 'gratitude':
        return (
          <Section title="Gratitude">
            <Spinner label="Number of items" value={cfg('count', 3)} onChange={v => setConfig('count', v)} min={1} max={10} />
          </Section>
        )

      // ── HABIT GRID ───────────────────────────────────────────────────────────
      case 'habit-grid':
        return (
          <Section title="Habit Grid">
            <Spinner label="Number of habits" value={cfg('habitCount', 8)} onChange={v => setConfig('habitCount', v)} min={2} max={20} />
            <Spinner label="Days shown" value={cfg('daysInMonth', 31)} onChange={v => setConfig('daysInMonth', v)} min={7} max={31} />
          </Section>
        )

      // ── WATER TRACKER ────────────────────────────────────────────────────────
      case 'water-tracker':
        return (
          <Section title="Water Goal">
            <Spinner label="Daily goal (cups)" value={cfg('goal', 8)} onChange={v => setConfig('goal', v)} min={2} max={20} suffix=" cups" />
          </Section>
        )

      // ── WORKOUT LOG ──────────────────────────────────────────────────────────
      case 'workout-log':
        return (
          <Section title="Exercises">
            <Spinner label="Exercise rows" value={cfg('exerciseCount', 6)} onChange={v => setConfig('exerciseCount', v)} min={2} max={15} />
          </Section>
        )

      // ── BUDGET / EXPENSE ─────────────────────────────────────────────────────
      case 'budget-row':
      case 'expense-tracker':
        return (
          <Section title="Rows">
            <Spinner label="Number of rows" value={cfg('rows', 6)} onChange={v => setConfig('rows', v)} min={2} max={20} />
          </Section>
        )

      // ── PROJECT TRACKER ──────────────────────────────────────────────────────
      case 'project-tracker':
        return (
          <Section title="Projects">
            <Spinner label="Number of projects" value={cfg('count', 4)} onChange={v => setConfig('count', v)} min={1} max={10} />
          </Section>
        )

      // ── CLASS SCHEDULE ───────────────────────────────────────────────────────
      case 'class-schedule':
        return (
          <Section title="Schedule">
            <Spinner label="Number of periods" value={cfg('periods', 6)} onChange={v => setConfig('periods', v)} min={2} max={12} />
          </Section>
        )

      // ── DATE HEADER ──────────────────────────────────────────────────────────
      case 'custom-text':
        return (
          <Section title="Text Content">
            <textarea
              value={cfg('text', '') as string}
              onChange={e => setConfig('text', e.target.value)}
              rows={4}
              placeholder="Enter your text here…"
              className="w-full px-2.5 py-2 text-xs rounded-lg border border-border bg-paper focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 text-primary resize-none leading-relaxed"
            />
          </Section>
        )

      case 'date-header':
        return (
          <Section title="Display">
            <Toggle
              label="Show day name"
              checked={cfg('showDay', true)}
              onChange={v => setConfig('showDay', v)}
              size="sm"
            />
            <Toggle
              label="Show date"
              checked={cfg('showDate', true)}
              onChange={v => setConfig('showDate', v)}
              size="sm"
            />
            <Toggle
              label="Show month"
              checked={cfg('showMonth', false)}
              onChange={v => setConfig('showMonth', v)}
              size="sm"
            />
            <Toggle
              label="Show week number"
              checked={cfg('showWeekNumber', false)}
              onChange={v => setConfig('showWeekNumber', v)}
              size="sm"
            />
          </Section>
        )

      default:
        return null
    }
  }

  const contentSettings = renderContentSettings()

  return (
    <div className="flex flex-col h-full">
      {/* Block title bar */}
      <div className="px-3 py-2.5 border-b border-border flex-shrink-0 bg-background/60">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs font-semibold text-primary truncate">{block.label}</span>
          </div>
          <span className="text-[10px] font-mono text-secondary bg-background border border-border px-1.5 py-0.5 rounded flex-shrink-0">
            {block.type}
          </span>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost" size="icon-sm"
            onClick={() => blockIndex > 0 && reorderBlocks(plannerId, pageId, blockIndex, blockIndex - 1)}
            disabled={blockIndex <= 0} title="Move up"
          ><ChevronUp size={13} /></Button>
          <Button
            variant="ghost" size="icon-sm"
            onClick={() => blockIndex < total - 1 && reorderBlocks(plannerId, pageId, blockIndex, blockIndex + 1)}
            disabled={blockIndex >= total - 1} title="Move down"
          ><ChevronDown size={13} /></Button>
          <Button
            variant="ghost" size="icon-sm"
            onClick={() => duplicateBlock(plannerId, pageId, block.id)}
            title="Duplicate"
          ><Copy size={13} /></Button>
          <Button
            variant="ghost" size="icon-sm"
            onClick={() => update({ locked: !block.locked })}
            title={block.locked ? 'Unlock block' : 'Lock block'}
          >{block.locked ? <Lock size={13} /> : <Unlock size={13} />}</Button>
          <div className="flex-1" />
          <Button
            variant="ghost" size="icon-sm"
            onClick={() => deleteBlock(plannerId, pageId, block.id)}
            className="text-red-400 hover:text-red-600 hover:bg-red-50"
            title="Delete block"
          ><Trash2 size={13} /></Button>
        </div>
      </div>

      {/* Scrollable settings */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">

        {/* Label */}
        <Section title="Label">
          <input
            value={block.label}
            onChange={e => update({ label: e.target.value })}
            className="w-full h-8 px-2.5 text-xs rounded-lg border border-border bg-paper focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 text-primary"
            placeholder="Block label"
          />
        </Section>

        {/* Content-specific settings */}
        {contentSettings && (
          <>
            <Divider />
            {contentSettings}
          </>
        )}

        <Divider />

        {/* Style */}
        <Section title="Style">
          <ColorPicker
            label="Background"
            value={block.style.backgroundColor || 'transparent'}
            onChange={v => setStyle('backgroundColor', v)}
          />
          <ColorPicker
            label="Border color"
            value={block.style.borderColor}
            onChange={v => setStyle('borderColor', v)}
          />
          <Spinner
            label="Border width"
            value={block.style.borderWidth}
            onChange={v => setStyle('borderWidth', v)}
            min={0} max={4} suffix="px"
          />
          <Spinner
            label="Border radius"
            value={block.style.borderRadius}
            onChange={v => setStyle('borderRadius', v)}
            min={0} max={24} suffix="px"
          />
          <Spinner
            label="Padding"
            value={block.style.padding}
            onChange={v => setStyle('padding', v)}
            min={0} max={32} suffix="px"
          />
        </Section>

        {/* Position info */}
        <div className="text-[10px] text-secondary/50 text-center pb-1">
          Block {blockIndex + 1} of {total}
        </div>
      </div>
    </div>
  )
}
