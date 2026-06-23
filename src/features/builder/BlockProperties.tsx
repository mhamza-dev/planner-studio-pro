import React from 'react'
import {
  Trash2, Copy, ChevronUp, ChevronDown, Lock, Unlock, Eye, EyeOff, Bookmark
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { Toggle } from '@/components/ui/Controls'
import { Spinner, Select } from '@/components/ui/Input'
import { Divider } from '@/components/ui/index'
import { usePlannerStore } from '@/store/plannerStore'
import { MOTIVATIONAL_QUOTES } from '@/lib/defaults'
import type { PlannerBlock } from '@/types'
import { cn } from '@/utils/cn'

function Row({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex items-center justify-between gap-2', className)}>{children}</div>
}
function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-xs text-ink-muted flex-1 min-w-0 truncate">{children}</span>
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">{title}</p>
      {children}
    </div>
  )
}
function InlineSel({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void
  options: { label: string; value: string }[]
}) {
  return (
    <Row>
      <Label>{label}</Label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="h-7 px-2 text-xs rounded-lg border border-border bg-surface-sunken text-primary focus:outline-none focus:ring-1 focus:ring-accent/30 cursor-pointer max-w-[120px]">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Row>
  )
}

interface BlockPropertiesProps {
  block: PlannerBlock
  plannerId: string
  pageId: string
}

export const BlockProperties: React.FC<BlockPropertiesProps> = ({ block, plannerId, pageId }) => {
  const {
    updateBlock, deleteBlock, duplicateBlock, reorderBlocks,
    toggleBlockLock, toggleBlockHidden, saveBlockPreset, getActivePage,
  } = usePlannerStore()

  const page = getActivePage()
  const idx = page?.blocks.findIndex(b => b.id === block.id) ?? -1
  const total = page?.blocks.length ?? 0

  const update = (u: Partial<PlannerBlock>) => updateBlock(plannerId, pageId, block.id, u)
  const cfg = <T,>(k: string, fb: T): T => (block.config[k] as T) ?? fb
  const set = (k: string, v: unknown) => update({ config: { ...block.config, [k]: v } })
  const sty = (k: keyof PlannerBlock['style'], v: unknown) => update({ style: { ...block.style, [k]: v } })

  // ── per-type content controls ─────────────────────────────────────────────
  const contentSection = (() => {
    switch (block.type) {
      case 'time-slots': return (
        <Section title="Schedule">
          <InlineSel label="Start hour" value={String(cfg('startHour', 6))} onChange={v => set('startHour', +v)}
            options={Array.from({length:24},(_,i)=>({value:String(i),label:`${String(i).padStart(2,'0')}:00`}))}/>
          <InlineSel label="End hour" value={String(cfg('endHour', 22))} onChange={v => set('endHour', +v)}
            options={Array.from({length:24},(_,i)=>({value:String(i),label:`${String(i).padStart(2,'0')}:00`}))}/>
          <InlineSel label="Interval" value={String(cfg('interval', 60))} onChange={v => set('interval', +v)}
            options={[{value:'15',label:'15 min'},{value:'30',label:'30 min'},{value:'60',label:'1 hour'}]}/>
        </Section>
      )
      case 'notes': return (
        <Section title="Lines">
          <Spinner label="Number of lines" value={cfg('lines',6)} onChange={v=>set('lines',v)} min={2} max={30}/>
        </Section>
      )
      case 'brain-dump': return (
        <Section title="Lines">
          <Spinner label="Number of lines" value={cfg('lines',10)} onChange={v=>set('lines',v)} min={4} max={40}/>
        </Section>
      )
      case 'focus-block': return (
        <Section title="Focus Block">
          <Spinner label="Lines" value={cfg('lines',8)} onChange={v=>set('lines',v)} min={4} max={20}/>
          <div>
            <p className="text-[10px] text-ink-muted mb-1">Prompt text</p>
            <input value={cfg('prompt','Focus for today:')} onChange={e=>set('prompt',e.target.value)}
              className="w-full h-7 px-2 text-xs rounded-lg border border-border bg-paper focus:outline-none focus:ring-1 focus:ring-accent/30 text-primary"/>
          </div>
        </Section>
      )
      case 'todo-list': return (
        <Section title="Items">
          <Spinner label="Number of items" value={cfg('count',8)} onChange={v=>set('count',v)} min={2} max={24}/>
        </Section>
      )
      case 'goal-section': return (
        <Section title="Goals">
          <Spinner label="Number of goals" value={cfg('count',5)} onChange={v=>set('count',v)} min={1} max={16}/>
        </Section>
      )
      case 'gratitude': return (
        <Section title="Gratitude">
          <Spinner label="Number of items" value={cfg('count',3)} onChange={v=>set('count',v)} min={1} max={10}/>
        </Section>
      )
      case 'habit-grid': return (
        <Section title="Habit Grid">
          <Spinner label="Habits" value={cfg('habitCount',8)} onChange={v=>set('habitCount',v)} min={2} max={20}/>
          <Spinner label="Days shown" value={cfg('daysInMonth',31)} onChange={v=>set('daysInMonth',v)} min={7} max={31}/>
        </Section>
      )
      case 'water-tracker': return (
        <Section title="Water Goal">
          <Spinner label="Daily goal (cups)" value={cfg('goal',8)} onChange={v=>set('goal',v)} min={2} max={20} suffix=" cups"/>
        </Section>
      )
      case 'workout-log': return (
        <Section title="Exercises">
          <Spinner label="Exercise rows" value={cfg('exerciseCount',6)} onChange={v=>set('exerciseCount',v)} min={2} max={16}/>
        </Section>
      )
      case 'budget-row': return (
        <Section title="Rows">
          <Spinner label="Number of rows" value={cfg('rows',5)} onChange={v=>set('rows',v)} min={2} max={20}/>
        </Section>
      )
      case 'expense-tracker': return (
        <Section title="Rows">
          <Spinner label="Number of rows" value={cfg('rows',8)} onChange={v=>set('rows',v)} min={2} max={24}/>
        </Section>
      )
      case 'project-tracker': return (
        <Section title="Projects">
          <Spinner label="Number of projects" value={cfg('count',4)} onChange={v=>set('count',v)} min={1} max={10}/>
        </Section>
      )
      case 'class-schedule': return (
        <Section title="Schedule">
          <Spinner label="Periods" value={cfg('periods',6)} onChange={v=>set('periods',v)} min={2} max={12}/>
        </Section>
      )
      case 'reading-log': return (
        <Section title="Rows">
          <Spinner label="Number of rows" value={cfg('rows',5)} onChange={v=>set('rows',v)} min={2} max={12}/>
        </Section>
      )
      case 'contact-card': return (
        <Section title="Fields">
          <Spinner label="Number of fields" value={cfg('rows',4)} onChange={v=>set('rows',v)} min={2} max={8}/>
        </Section>
      )
      case 'meeting-notes': return (
        <Section title="Meeting Notes">
          <Spinner label="Attendees" value={cfg('attendeeCount',3)} onChange={v=>set('attendeeCount',v)} min={1} max={8}/>
          <Spinner label="Action items" value={cfg('actionItems',4)} onChange={v=>set('actionItems',v)} min={2} max={12}/>
        </Section>
      )
      case 'kanban': return (
        <Section title="Kanban">
          <Spinner label="Items per column" value={cfg('itemsPerColumn',3)} onChange={v=>set('itemsPerColumn',v)} min={1} max={8}/>
        </Section>
      )
      case 'checklist': return (
        <Section title="Checklist">
          <Spinner label="Items per category" value={cfg('itemsPerCategory',4)} onChange={v=>set('itemsPerCategory',v)} min={1} max={10}/>
        </Section>
      )
      case 'countdown': return (
        <Section title="Countdown">
          <div>
            <p className="text-[10px] text-ink-muted mb-1">Label</p>
            <input value={cfg('label','Goal')} onChange={e=>set('label',e.target.value)}
              className="w-full h-7 px-2 text-xs rounded-lg border border-border bg-paper focus:outline-none focus:ring-1 focus:ring-accent/30 text-primary"/>
          </div>
          <div>
            <p className="text-[10px] text-ink-muted mb-1">Target date</p>
            <input type="date" value={cfg('targetDate','')} onChange={e=>set('targetDate',e.target.value)}
              className="w-full h-7 px-2 text-xs rounded-lg border border-border bg-paper focus:outline-none focus:ring-1 focus:ring-accent/30 text-primary"/>
          </div>
        </Section>
      )
      case 'progress-bar': return (
        <Section title="Progress Bar">
          <div>
            <p className="text-[10px] text-ink-muted mb-1">Label</p>
            <input value={cfg('label','Progress')} onChange={e=>set('label',e.target.value)}
              className="w-full h-7 px-2 text-xs rounded-lg border border-border bg-paper focus:outline-none focus:ring-1 focus:ring-accent/30 text-primary"/>
          </div>
          <Spinner label="Current value" value={cfg('value',0)} onChange={v=>set('value',v)} min={0} max={cfg('max',100)}/>
          <Spinner label="Max value" value={cfg('max',100)} onChange={v=>set('max',v)} min={1} max={10000}/>
        </Section>
      )
      case 'savings-tracker': return (
        <Section title="Savings Goal">
          <div>
            <p className="text-[10px] text-ink-muted mb-1">Currency symbol</p>
            <input value={cfg('currency','$')} onChange={e=>set('currency',e.target.value)}
              className="w-16 h-7 px-2 text-xs rounded-lg border border-border bg-paper focus:outline-none focus:ring-1 focus:ring-accent/30 text-primary"/>
          </div>
          <Spinner label="Goal amount" value={cfg('goal',1000)} onChange={v=>set('goal',v)} min={1} max={1000000}/>
          <Spinner label="Current saved" value={cfg('current',0)} onChange={v=>set('current',v)} min={0} max={cfg('goal',1000)}/>
        </Section>
      )
      case 'quote-block': return (
        <Section title="Quote">
          <div>
            <p className="text-[10px] text-ink-muted mb-1">Quote text</p>
            <textarea value={cfg('quote','')} onChange={e=>set('quote',e.target.value)} rows={3}
              className="w-full px-2 py-1.5 text-xs rounded-lg border border-border bg-paper focus:outline-none focus:ring-1 focus:ring-accent/30 text-primary resize-none leading-relaxed"/>
          </div>
          <div>
            <p className="text-[10px] text-ink-muted mb-1">Author</p>
            <input value={cfg('author','')} onChange={e=>set('author',e.target.value)}
              className="w-full h-7 px-2 text-xs rounded-lg border border-border bg-paper focus:outline-none focus:ring-1 focus:ring-accent/30 text-primary"/>
          </div>
          <button onClick={() => {
            const q = MOTIVATIONAL_QUOTES[Math.floor(Math.random()*MOTIVATIONAL_QUOTES.length)]
            set('quote', q.quote); set('author', q.author)
          }} className="text-[10px] text-accent hover:underline">
            Use random quote
          </button>
        </Section>
      )
      case 'custom-text': return (
        <Section title="Text Content">
          <textarea value={cfg('text','')} onChange={e=>set('text',e.target.value)} rows={4}
            placeholder="Enter your text here…"
            className="w-full px-2 py-1.5 text-xs rounded-lg border border-border bg-paper focus:outline-none focus:ring-1 focus:ring-accent/30 text-primary resize-none leading-relaxed"/>
        </Section>
      )
      case 'date-header': return (
        <Section title="Display">
          <Toggle label="Show day name" checked={cfg('showDay',true)} onChange={v=>set('showDay',v)} size="sm"/>
          <Toggle label="Show full date" checked={cfg('showDate',true)} onChange={v=>set('showDate',v)} size="sm"/>
          <Toggle label="Show month only" checked={cfg('showMonth',false)} onChange={v=>set('showMonth',v)} size="sm"/>
          <Toggle label="Show week number" checked={cfg('showWeekNumber',false)} onChange={v=>set('showWeekNumber',v)} size="sm"/>
        </Section>
      )
      case 'cover-title': return (
        <Section title="Cover">
          <div>
            <p className="text-[10px] text-ink-muted mb-1">Title</p>
            <input value={cfg('title','My Planner')} onChange={e=>set('title',e.target.value)}
              className="w-full h-7 px-2 text-xs rounded-lg border border-border bg-paper focus:outline-none focus:ring-1 focus:ring-accent/30 text-primary"/>
          </div>
          <div>
            <p className="text-[10px] text-ink-muted mb-1">Subtitle</p>
            <input value={cfg('subtitle','')} onChange={e=>set('subtitle',e.target.value)}
              className="w-full h-7 px-2 text-xs rounded-lg border border-border bg-paper focus:outline-none focus:ring-1 focus:ring-accent/30 text-primary"/>
          </div>
          <Toggle label="Show year" checked={cfg('showDate',true)} onChange={v=>set('showDate',v)} size="sm"/>
        </Section>
      )
      case 'two-column': return (
        <Section title="Column Width">
          <Spinner label="Left column %" value={cfg('leftWidth',50)} onChange={v=>set('leftWidth',v)} min={20} max={80} suffix="%"/>
        </Section>
      )
      case 'table-of-contents': return (
        <Section title="Entries">
          <Spinner label="Number of entries" value={cfg('entries',5)} onChange={v=>set('entries',v)} min={2} max={15}/>
        </Section>
      )
      default: return null
    }
  })()

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-border shrink-0 bg-surface-raised/50">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-primary truncate">{block.label}</span>
          <span className="text-[9px] font-mono text-ink-faint bg-surface-sunken border border-border px-1.5 py-0.5 rounded shrink-0">
            {block.type}
          </span>
        </div>
        {/* Quick actions */}
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon-xs" onClick={() => idx>0 && reorderBlocks(plannerId,pageId,idx,idx-1)} disabled={idx<=0} title="Move up"><ChevronUp size={12}/></Button>
          <Button variant="ghost" size="icon-xs" onClick={() => idx<total-1 && reorderBlocks(plannerId,pageId,idx,idx+1)} disabled={idx>=total-1} title="Move down"><ChevronDown size={12}/></Button>
          <Button variant="ghost" size="icon-xs" onClick={() => duplicateBlock(plannerId,pageId,block.id)} title="Duplicate"><Copy size={12}/></Button>
          <Button variant="ghost" size="icon-xs" onClick={() => toggleBlockHidden(plannerId,pageId,block.id)} title={block.hidden?'Show':'Hide'}>{block.hidden?<Eye size={12}/>:<EyeOff size={12}/>}</Button>
          <Button variant="ghost" size="icon-xs" onClick={() => toggleBlockLock(plannerId,pageId,block.id)} title={block.locked?'Unlock':'Lock'}>{block.locked?<Lock size={12}/>:<Unlock size={12}/>}</Button>
          <Button variant="ghost" size="icon-xs" onClick={() => saveBlockPreset(`${block.label} preset`, block)} title="Save as preset"><Bookmark size={12}/></Button>
          <div className="flex-1"/>
          <Button variant="ghost" size="icon-xs" onClick={() => deleteBlock(plannerId,pageId,block.id)}
            className="text-red-400 hover:text-red-600 hover:bg-red-50" title="Delete"><Trash2 size={12}/></Button>
        </div>
      </div>

      {/* Settings */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 text-sm">
        {/* Label */}
        <Section title="Label">
          <input value={block.label} onChange={e=>update({label:e.target.value})}
            className="w-full h-8 px-2.5 text-xs rounded-lg border border-border bg-paper focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 text-primary"
            placeholder="Block label"/>
        </Section>

        {/* Type-specific */}
        {contentSection && <><Divider/>{contentSection}</>}

        <Divider/>

        {/* Style */}
        <Section title="Style">
          <ColorPicker label="Background" value={block.style.backgroundColor||'transparent'} onChange={v=>sty('backgroundColor',v)}/>
          <ColorPicker label="Border color" value={block.style.borderColor} onChange={v=>sty('borderColor',v)}/>
          <Spinner label="Border width" value={block.style.borderWidth} onChange={v=>sty('borderWidth',v)} min={0} max={4} suffix="px"/>
          <Spinner label="Border radius" value={block.style.borderRadius} onChange={v=>sty('borderRadius',v)} min={0} max={24} suffix="px"/>
          <Spinner label="Padding" value={block.style.padding} onChange={v=>sty('padding',v)} min={0} max={32} suffix="px"/>
          <Spinner label="Margin bottom" value={block.style.marginBottom??8} onChange={v=>sty('marginBottom',v)} min={0} max={32} suffix="px"/>
        </Section>

        <div className="text-[10px] text-ink-faint text-center pb-2">Block {idx+1} of {total}</div>
      </div>
    </div>
  )
}
