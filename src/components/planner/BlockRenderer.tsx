import React from 'react'
import type { PlannerBlock, PlannerConfig } from '@/types'
import { cn } from '@/utils/cn'
import { getDaysInMonth, getFirstDayOfMonth, formatDate } from '@/utils/date'

interface BlockProps { block: PlannerBlock; config: PlannerConfig }

const C = {
  line: (color: string, opacity = 0.18) => ({ borderColor: `${color}${Math.round(opacity*255).toString(16).padStart(2,'0')}` }),
  bg: (color: string, opacity = 0.08) => ({ backgroundColor: `${color}${Math.round(opacity*255).toString(16).padStart(2,'0')}` }),
}

// ─────────────────────────────────────────────────────────────────────────────
// Structure blocks
// ─────────────────────────────────────────────────────────────────────────────
const DateHeaderBlock: React.FC<BlockProps> = ({ block, config }) => {
  const { showDay, showDate, showMonth, showYear, showWeekNumber } = block.config as Record<string,boolean>
  const today = new Date()
  const weekNum = Math.ceil((((today.getTime() - new Date(today.getFullYear(),0,1).getTime())/86400000)+new Date(today.getFullYear(),0,1).getDay()+1)/7)
  return (
    <div className="flex items-baseline gap-3 flex-wrap">
      {showDay && <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{color:config.secondaryColor}}>{formatDate(today,'dddd')}</span>}
      {showDate && <span className="text-xl font-bold font-display" style={{color:config.primaryColor}}>{formatDate(today,'MMMM D, YYYY')}</span>}
      {showMonth && !showDate && <span className="text-xl font-bold font-display" style={{color:config.primaryColor}}>{formatDate(today,'MMMM YYYY')}</span>}
      {showYear && !showDate && !showMonth && <span className="text-xl font-bold font-display" style={{color:config.primaryColor}}>{formatDate(today,'YYYY')}</span>}
      {showWeekNumber && <span className="text-[10px] font-medium ml-1" style={{color:config.secondaryColor}}>Week {weekNum}</span>}
    </div>
  )
}

const SectionHeaderBlock: React.FC<BlockProps> = ({ block, config }) => (
  <div className="flex items-center gap-2">
    <div className="w-0.5 h-3.5 rounded-full" style={{backgroundColor:config.primaryColor}}/>
    <span className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{color:config.primaryColor}}>{block.label}</span>
  </div>
)

const DividerBlock: React.FC<BlockProps> = ({ block, config }) => {
  const style = (block.config.style as string) || 'solid'
  const styles: Record<string,string> = { solid:'solid', dashed:'dashed', dotted:'dotted', double:'double', thick:'solid' }
  const width = style === 'thick' ? 2 : 1
  return <div style={{ borderTop:`${width}px ${styles[style]||'solid'} ${config.accentColor}`, opacity: 0.8 }}/>
}

const SpacerBlock: React.FC = () => <div style={{height:'12px'}}/>

const CoverTitleBlock: React.FC<BlockProps> = ({ block, config }) => {
  const { title, subtitle, showDate } = block.config as Record<string,string|boolean>
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <div className="w-12 h-0.5 mb-4 rounded-full" style={{backgroundColor:config.accentColor}}/>
      <h1 className="text-2xl font-bold font-serif leading-tight" style={{color:config.primaryColor}}>{title as string || 'My Planner'}</h1>
      {subtitle && <p className="text-sm mt-1 font-medium" style={{color:config.secondaryColor}}>{subtitle as string}</p>}
      {showDate && <p className="text-[10px] mt-2 tracking-widest uppercase" style={{color:config.secondaryColor + '80'}}>{new Date().getFullYear()}</p>}
      <div className="w-12 h-0.5 mt-4 rounded-full" style={{backgroundColor:config.accentColor}}/>
    </div>
  )
}

const TwoColumnBlock: React.FC<BlockProps> = ({ block, config }) => {
  const left = (block.config.leftWidth as number) || 50
  return (
    <div className="flex gap-3">
      <div style={{flex:`${left} 1 0%`, borderRight:`1px solid ${config.accentColor}30`, paddingRight:'8px'}}>
        <div className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{color:config.secondaryColor}}>Column A</div>
        {Array.from({length:4}).map((_,i)=><div key={i} className="border-b mb-1.5 h-4" style={C.line(config.primaryColor)}/>)}
      </div>
      <div style={{flex:`${100-left} 1 0%`, paddingLeft:'8px'}}>
        <div className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{color:config.secondaryColor}}>Column B</div>
        {Array.from({length:4}).map((_,i)=><div key={i} className="border-b mb-1.5 h-4" style={C.line(config.primaryColor)}/>)}
      </div>
    </div>
  )
}

const TableOfContentsBlock: React.FC<BlockProps> = ({ block, config }) => {
  const n = (block.config.entries as number) || 5
  return (
    <div className="space-y-2">
      {Array.from({length:n}).map((_,i)=>(
        <div key={i} className="flex items-center gap-2">
          <span className="text-[10px] font-semibold" style={{color:config.secondaryColor}}>{i+1}</span>
          <div className="flex-1 border-b border-dotted h-4" style={C.line(config.primaryColor,0.15)}/>
          <span className="text-[10px]" style={{color:config.secondaryColor+'80'}}>{i+1}</span>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Planning blocks
// ─────────────────────────────────────────────────────────────────────────────
const TimeSlotsBlock: React.FC<BlockProps> = ({ block, config }) => {
  const { startHour=6, endHour=22, interval=60 } = block.config as Record<string,number>
  const slots: string[] = []
  for (let h=startHour; h<endHour; h++) {
    slots.push(`${String(h).padStart(2,'0')}:00`)
    if (interval<=30) slots.push(`${String(h).padStart(2,'0')}:30`)
    if (interval<=15) { slots.splice(slots.length-1,0,`${String(h).padStart(2,'0')}:15`); slots.push(`${String(h).padStart(2,'0')}:45`) }
  }
  return (
    <div>
      {slots.map((time,i)=>(
        <div key={i} className="flex items-start gap-2 min-h-[18px]">
          <span className="text-[9px] font-medium w-8 shrink-0 pt-px leading-none" style={{color:config.secondaryColor+'90'}}>{time}</span>
          <div className="flex-1 border-b" style={{...C.line(config.primaryColor,0.12),minHeight:'18px'}}/>
        </div>
      ))}
    </div>
  )
}

const TodoListBlock: React.FC<BlockProps> = ({ block, config }) => {
  const count = (block.config.count as number)||8
  return (
    <div className="space-y-1.5">
      {Array.from({length:count}).map((_,i)=>(
        <div key={i} className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded border shrink-0" style={{borderColor:`${config.primaryColor}50`}}/>
          <div className="flex-1 border-b h-4" style={C.line(config.primaryColor,0.12)}/>
        </div>
      ))}
    </div>
  )
}

const GoalSectionBlock: React.FC<BlockProps> = ({ block, config }) => {
  const count = (block.config.count as number)||5
  return (
    <div className="space-y-2">
      {Array.from({length:count}).map((_,i)=>(
        <div key={i} className="flex items-center gap-2">
          <div className="w-4 h-4 rounded shrink-0 flex items-center justify-center text-[8px] font-bold"
            style={{backgroundColor:`${config.accentColor}60`,color:config.primaryColor}}>{i+1}</div>
          <div className="flex-1 border-b h-4" style={C.line(config.primaryColor,0.15)}/>
        </div>
      ))}
    </div>
  )
}

const PriorityMatrixBlock: React.FC<BlockProps> = ({ block, config }) => {
  const quads = [
    { label:'Do First', sub:'Urgent + Important', weight:1 },
    { label:'Schedule', sub:'Not Urgent + Important', weight:0.7 },
    { label:'Delegate', sub:'Urgent + Not Important', weight:0.45 },
    { label:'Eliminate', sub:'Not Urgent + Not Important', weight:0.25 },
  ]
  return (
    <div className="grid grid-cols-2 gap-1.5" style={{height:'110px'}}>
      {quads.map(q=>(
        <div key={q.label} className="rounded-lg p-2 flex flex-col" style={{backgroundColor:`${config.accentColor}30`,border:`1px solid ${config.accentColor}`}}>
          <div className="text-[8px] font-bold uppercase tracking-wide" style={{color:`${config.primaryColor}${Math.round(q.weight*255).toString(16).padStart(2,'0')}`}}>{q.label}</div>
          <div className="text-[7px] opacity-60" style={{color:config.primaryColor}}>{q.sub}</div>
          {Array.from({length:3}).map((_,i)=><div key={i} className="mt-auto border-b h-3" style={C.line(config.primaryColor,0.15)}/>)}
        </div>
      ))}
    </div>
  )
}

const WeekGridBlock: React.FC<BlockProps> = ({ block, config }) => {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  return (
    <div className="grid grid-cols-7 gap-1">
      {days.map(d=>(
        <div key={d}>
          <div className="text-[8px] font-bold uppercase text-center mb-1" style={{color:config.secondaryColor}}>{d}</div>
          <div className="rounded-lg" style={{height:'90px',backgroundColor:`${config.accentColor}20`,border:`1px solid ${config.accentColor}`}}/>
        </div>
      ))}
    </div>
  )
}

const MonthCalendarBlock: React.FC<BlockProps> = ({ block, config }) => {
  const today = new Date()
  const y=today.getFullYear(), m=today.getMonth()
  const dim = getDaysInMonth(y,m)
  const first = getFirstDayOfMonth(y,m)
  const days = ['Su','Mo','Tu','We','Th','Fr','Sa']
  const cells: (number|null)[] = [...Array(first).fill(null), ...Array.from({length:dim},(_,i)=>i+1)]
  while(cells.length%7!==0) cells.push(null)
  return (
    <div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {days.map(d=><div key={d} className="text-[8px] font-bold text-center uppercase" style={{color:`${config.primaryColor}60`}}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day,i)=>(
          <div key={i} className={cn('aspect-square flex items-center justify-center text-[9px] rounded',
            day===today.getDate() ? 'font-bold text-white' : 'text-primary/60')}
            style={{backgroundColor:day===today.getDate()?config.primaryColor:undefined}}>
            {day??''}
          </div>
        ))}
      </div>
    </div>
  )
}

const CountdownBlock: React.FC<BlockProps> = ({ block, config }) => {
  const label = (block.config.label as string) || 'Goal'
  const target = block.config.targetDate as string
  const days = target ? Math.max(0, Math.ceil((new Date(target).getTime()-Date.now())/86400000)) : 0
  return (
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0"
        style={{backgroundColor:`${config.accentColor}40`,border:`1px solid ${config.accentColor}`}}>
        <span className="text-2xl font-bold font-display" style={{color:config.primaryColor}}>{target ? days : '—'}</span>
        <span className="text-[8px] font-medium uppercase tracking-wide" style={{color:config.secondaryColor}}>days</span>
      </div>
      <div>
        <div className="text-xs font-semibold" style={{color:config.primaryColor}}>{label}</div>
        <div className="text-[9px] mt-1 border-b w-32 h-3.5" style={C.line(config.primaryColor,0.15)}/>
      </div>
    </div>
  )
}

const KanbanBlock: React.FC<BlockProps> = ({ block, config }) => {
  const cols = (block.config.columns as string[]) || ['To Do','In Progress','Done']
  const items = (block.config.itemsPerColumn as number) || 3
  return (
    <div className="grid gap-1.5" style={{gridTemplateColumns:`repeat(${cols.length},1fr)`}}>
      {cols.map(col=>(
        <div key={col} className="rounded-lg p-2" style={{backgroundColor:`${config.accentColor}20`,border:`1px solid ${config.accentColor}`}}>
          <div className="text-[8px] font-bold uppercase tracking-wider mb-2" style={{color:config.secondaryColor}}>{col}</div>
          {Array.from({length:items}).map((_,i)=>(
            <div key={i} className="h-5 rounded mb-1 border" style={{backgroundColor:`${config.primaryColor}06`,borderColor:`${config.primaryColor}15`}}/>
          ))}
        </div>
      ))}
    </div>
  )
}

const ChecklistBlock: React.FC<BlockProps> = ({ block, config }) => {
  const cats = (block.config.categories as string[]) || ['Morning','Afternoon','Evening']
  const items = (block.config.itemsPerCategory as number) || 3
  return (
    <div className="space-y-3">
      {cats.map(cat=>(
        <div key={cat}>
          <div className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{color:config.secondaryColor}}>{cat}</div>
          {Array.from({length:items}).map((_,i)=>(
            <div key={i} className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded border shrink-0" style={{borderColor:`${config.primaryColor}40`}}/>
              <div className="flex-1 border-b h-3.5" style={C.line(config.primaryColor,0.12)}/>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Writing blocks
// ─────────────────────────────────────────────────────────────────────────────
const NotesBlock: React.FC<BlockProps> = ({ block, config }) => {
  const lines = (block.config.lines as number)||6
  return (
    <div className="space-y-2">
      {Array.from({length:lines}).map((_,i)=><div key={i} className="border-b h-5" style={C.line(config.primaryColor,0.14)}/>)}
    </div>
  )
}

const ReflectionBlock: React.FC<BlockProps> = ({ block, config }) => (
  <div className="space-y-2">
    {['What went well?','What to improve?','Key takeaway?'].map(p=>(
      <div key={p}>
        <div className="text-[8px] font-semibold uppercase tracking-wider mb-0.5" style={{color:`${config.primaryColor}70`}}>{p}</div>
        <div className="border-b h-4 mb-0.5" style={C.line(config.primaryColor,0.12)}/>
        <div className="border-b h-4" style={C.line(config.primaryColor,0.12)}/>
      </div>
    ))}
  </div>
)

const GratitudeBlock: React.FC<BlockProps> = ({ block, config }) => {
  const count = (block.config.count as number)||3
  return (
    <div className="space-y-2">
      {Array.from({length:count}).map((_,i)=>(
        <div key={i} className="flex items-center gap-2">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><polygon points="5,1 6.3,3.9 9.5,4.1 7.2,6.1 8,9.2 5,7.4 2,9.2 2.8,6.1 0.5,4.1 3.7,3.9" fill={config.accentColor}/></svg>
          <div className="flex-1 border-b h-4" style={C.line(config.primaryColor,0.15)}/>
        </div>
      ))}
    </div>
  )
}

const CustomTextBlock: React.FC<BlockProps> = ({ block, config }) => {
  const text = block.config.text as string
  return (
    <div className="text-xs leading-relaxed" style={{color:`${config.primaryColor}CC`, minHeight:'24px'}}>
      {text || <span style={{color:`${config.primaryColor}30`,fontStyle:'italic'}}>Custom text…</span>}
    </div>
  )
}

const QuoteBlock: React.FC<BlockProps> = ({ block, config }) => {
  const { quote='', author='' } = block.config as Record<string,string>
  return (
    <div className="relative pl-4">
      <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full" style={{backgroundColor:config.accentColor}}/>
      <p className="text-[10px] italic leading-relaxed" style={{color:config.primaryColor}}>{quote}</p>
      {author && <p className="text-[9px] font-semibold mt-1" style={{color:config.secondaryColor}}>— {author}</p>}
    </div>
  )
}

const BrainDumpBlock: React.FC<BlockProps> = ({ block, config }) => {
  const lines = (block.config.lines as number)||10
  return (
    <div className="space-y-1.5">
      {Array.from({length:lines}).map((_,i)=><div key={i} className="border-b h-5" style={C.line(config.primaryColor,0.1)}/>)}
    </div>
  )
}

const FocusBlock: React.FC<BlockProps> = ({ block, config }) => {
  const { lines=8, prompt='Focus for today:' } = block.config as Record<string,unknown>
  return (
    <div className="rounded-lg p-3" style={{border:`1px dashed ${config.accentColor}`,backgroundColor:`${config.accentColor}10`}}>
      <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{color:config.secondaryColor}}>{prompt as string}</div>
      {Array.from({length:lines as number}).map((_,i)=><div key={i} className="border-b mb-2 h-5" style={C.line(config.primaryColor,0.12)}/>)}
    </div>
  )
}

const MeetingNotesBlock: React.FC<BlockProps> = ({ block, config }) => {
  const { attendeeCount=3, actionItems=4 } = block.config as Record<string,number>
  return (
    <div className="space-y-3">
      <div>
        <div className="text-[8px] font-bold uppercase tracking-wider mb-1" style={{color:config.secondaryColor}}>Attendees</div>
        <div className="flex gap-2">
          {Array.from({length:attendeeCount}).map((_,i)=>(
            <div key={i} className="flex-1 border-b h-4" style={C.line(config.primaryColor,0.12)}/>
          ))}
        </div>
      </div>
      <div>
        <div className="text-[8px] font-bold uppercase tracking-wider mb-1" style={{color:config.secondaryColor}}>Notes</div>
        {Array.from({length:3}).map((_,i)=><div key={i} className="border-b h-4 mb-1" style={C.line(config.primaryColor,0.12)}/>)}
      </div>
      <div>
        <div className="text-[8px] font-bold uppercase tracking-wider mb-1" style={{color:config.secondaryColor}}>Action Items</div>
        {Array.from({length:actionItems}).map((_,i)=>(
          <div key={i} className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded border shrink-0" style={{borderColor:`${config.primaryColor}40`}}/>
            <div className="flex-1 border-b h-3.5" style={C.line(config.primaryColor,0.12)}/>
          </div>
        ))}
      </div>
    </div>
  )
}

const ReadingLogBlock: React.FC<BlockProps> = ({ block, config }) => {
  const rows = (block.config.rows as number)||4
  return (
    <div>
      <div className="grid grid-cols-4 gap-2 mb-1">
        {['Title','Author','Pages','Rating'].map(h=>(
          <div key={h} className="text-[7px] font-bold uppercase tracking-wide" style={{color:`${config.primaryColor}70`}}>{h}</div>
        ))}
      </div>
      {Array.from({length:rows}).map((_,i)=>(
        <div key={i} className="grid grid-cols-4 gap-2 mb-1.5">
          {[0,1,2,3].map(c=><div key={c} className="border-b h-4" style={C.line(config.primaryColor,0.12)}/>)}
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Tracking blocks
// ─────────────────────────────────────────────────────────────────────────────
const HabitGridBlock: React.FC<BlockProps> = ({ block, config }) => {
  const { habitCount=8, daysInMonth=31 } = block.config as Record<string,number>
  const cols = Math.min(daysInMonth,31)
  return (
    <div style={{overflowX:'auto'}}>
      <div style={{display:'grid',gridTemplateColumns:`80px repeat(${cols},minmax(0,1fr))`,gap:'2px',minWidth:`${80+cols*14}px`}}>
        <div className="text-[8px] font-bold" style={{color:`${config.primaryColor}60`}}>Habit</div>
        {Array.from({length:cols}).map((_,i)=>(
          <div key={i} className="text-[7px] text-center font-medium" style={{color:`${config.primaryColor}60`}}>{i+1}</div>
        ))}
        {Array.from({length:habitCount}).map((_,r)=>(
          <React.Fragment key={r}>
            <div className="text-[8px] py-0.5 pr-1 truncate" style={{color:config.primaryColor}}>Habit {r+1}</div>
            {Array.from({length:cols}).map((_,c)=>(
              <div key={c} className="rounded-sm" style={{height:'12px',backgroundColor:`${config.accentColor}40`,border:`1px solid ${config.accentColor}`}}/>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

const MoodTrackerBlock: React.FC<BlockProps> = ({ block, config }) => {
  const moods = ['1','2','3','4','5']
  return (
    <div className="flex items-center justify-between">
      {moods.map(m=>(
        <div key={m} className="flex flex-col items-center gap-1">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2"
            style={{borderColor:`${config.accentColor}`,backgroundColor:`${config.accentColor}30`,color:config.primaryColor}}>{m}</div>
          <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:config.accentColor}}/>
        </div>
      ))}
    </div>
  )
}

const WaterTrackerBlock: React.FC<BlockProps> = ({ block, config }) => {
  const goal = (block.config.goal as number)||8
  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {Array.from({length:goal}).map((_,i)=>(
        <div key={i} className="flex flex-col items-center">
          <div className="w-6 h-8 rounded-full border-2 flex items-end justify-center pb-1"
            style={{borderColor:`${config.primaryColor}30`}}>
            <div className="w-3.5 rounded-full" style={{height:'40%',backgroundColor:`${config.accentColor}80`}}/>
          </div>
        </div>
      ))}
      <span className="text-[9px] text-ink-muted ml-0.5">/{goal}</span>
    </div>
  )
}

const SleepTrackerBlock: React.FC<BlockProps> = ({ block, config }) => (
  <div className="grid grid-cols-2 gap-2">
    {[{l:'Bedtime',p:'-- : --'},{l:'Wake time',p:'-- : --'},{l:'Hours slept',p:'___ hrs'},{l:'Quality',p:'★ ★ ★ ★ ★'}].map(i=>(
      <div key={i.l}>
        <div className="text-[8px] font-medium uppercase tracking-wide mb-0.5" style={{color:`${config.primaryColor}70`}}>{i.l}</div>
        <div className="border-b h-4 text-[9px] flex items-end pb-0.5" style={{...C.line(config.primaryColor,0.15),color:`${config.primaryColor}35`}}>{i.p}</div>
      </div>
    ))}
  </div>
)

const WorkoutLogBlock: React.FC<BlockProps> = ({ block, config }) => {
  const count = (block.config.exerciseCount as number)||5
  return (
    <div>
      <div className="grid grid-cols-4 gap-2 mb-1.5">
        {['Exercise','Sets','Reps','Weight'].map(h=>(
          <div key={h} className="text-[7px] font-bold uppercase tracking-wide" style={{color:`${config.primaryColor}70`}}>{h}</div>
        ))}
      </div>
      {Array.from({length:count}).map((_,i)=>(
        <div key={i} className="grid grid-cols-4 gap-2 mb-1.5">
          {[0,1,2,3].map(c=><div key={c} className="border-b h-4" style={C.line(config.primaryColor,0.12)}/>)}
        </div>
      ))}
    </div>
  )
}

const MealPlannerBlock: React.FC<BlockProps> = ({ block, config }) => (
  <div className="space-y-1.5">
    {['Breakfast','Lunch','Dinner','Snacks'].map(m=>(
      <div key={m} className="flex items-center gap-2">
        <span className="text-[8px] font-bold uppercase tracking-wide w-14 shrink-0" style={{color:`${config.primaryColor}70`}}>{m}</span>
        <div className="flex-1 border-b h-4" style={C.line(config.primaryColor,0.12)}/>
      </div>
    ))}
  </div>
)

const ProgressBarBlock: React.FC<BlockProps> = ({ block, config }) => {
  const { label='Progress', value=0, max=100 } = block.config as Record<string,unknown>
  const pct = Math.min(100, Math.max(0, ((value as number)/(max as number))*100))
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9px] font-medium" style={{color:config.primaryColor}}>{label as string}</span>
        <span className="text-[9px] font-bold" style={{color:config.secondaryColor}}>{pct.toFixed(0)}%</span>
      </div>
      <div className="h-2 rounded-full" style={{backgroundColor:`${config.accentColor}40`}}>
        <div className="h-full rounded-full transition-all" style={{width:`${pct}%`,backgroundColor:config.primaryColor}}/>
      </div>
    </div>
  )
}

const SavingsTrackerBlock: React.FC<BlockProps> = ({ block, config }) => {
  const { goal=1000, current=0, currency='$' } = block.config as Record<string,unknown>
  const currencySymbol = String(currency)
  const pct = Math.min(100,((current as number)/(goal as number))*100)
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] font-medium" style={{color:config.primaryColor}}>Savings Goal</span>
        <span className="text-[9px] font-bold" style={{color:config.secondaryColor}}>{currencySymbol}{(current as number).toLocaleString()} / {currencySymbol}{(goal as number).toLocaleString()}</span>
      </div>
      <div className="h-3 rounded-full overflow-hidden" style={{backgroundColor:`${config.accentColor}40`}}>
        <div className="h-full rounded-full" style={{width:`${pct}%`,backgroundColor:config.primaryColor}}/>
      </div>
      <div className="flex justify-between mt-1">
        {Array.from({length:5}).map((_,i)=>(
          <div key={i} className="text-[7px]" style={{color:`${config.primaryColor}50`}}>{Math.round((i/4)*(goal as number)/(1000))>0?`${currencySymbol}${Math.round((i/4)*(goal as number)/1000)}k`:currencySymbol+'0'}</div>
        ))}
      </div>
    </div>
  )
}

const ContactCardBlock: React.FC<BlockProps> = ({ block, config }) => {
  const rows = (block.config.rows as number)||3
  return (
    <div className="space-y-2">
      {['Name','Phone','Email','Website'].slice(0,rows).map(f=>(
        <div key={f} className="flex items-center gap-2">
          <span className="text-[8px] font-bold w-12 shrink-0 uppercase tracking-wide" style={{color:`${config.primaryColor}60`}}>{f}</span>
          <div className="flex-1 border-b h-4" style={C.line(config.primaryColor,0.15)}/>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Finance blocks
// ─────────────────────────────────────────────────────────────────────────────
const BudgetRowBlock: React.FC<BlockProps> = ({ block, config }) => {
  const rows = (block.config.rows as number)||5
  return (
    <div>
      <div className="grid grid-cols-3 gap-2 mb-1">
        {['Description','Budgeted','Actual'].map(h=>(
          <div key={h} className="text-[7px] font-bold uppercase tracking-wide" style={{color:`${config.primaryColor}70`}}>{h}</div>
        ))}
      </div>
      {Array.from({length:rows}).map((_,i)=>(
        <div key={i} className="grid grid-cols-3 gap-2 mb-1.5">
          {[0,1,2].map(c=><div key={c} className="border-b h-4" style={C.line(config.primaryColor,0.12)}/>)}
        </div>
      ))}
    </div>
  )
}

const ExpenseTrackerBlock: React.FC<BlockProps> = ({ block, config }) => {
  const rows = (block.config.rows as number)||6
  return (
    <div>
      <div className="grid grid-cols-4 gap-2 mb-1">
        {['Date','Description','Category','Amount'].map(h=>(
          <div key={h} className="text-[7px] font-bold uppercase tracking-wide" style={{color:`${config.primaryColor}70`}}>{h}</div>
        ))}
      </div>
      {Array.from({length:rows}).map((_,i)=>(
        <div key={i} className="grid grid-cols-4 gap-2 mb-1.5">
          {[0,1,2,3].map(c=><div key={c} className="border-b h-4" style={C.line(config.primaryColor,0.12)}/>)}
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Academic / Business blocks
// ─────────────────────────────────────────────────────────────────────────────
const ClassScheduleBlock: React.FC<BlockProps> = ({ block, config }) => {
  const periods = (block.config.periods as number)||5
  return (
    <div>
      <div className="grid grid-cols-4 gap-2 mb-1">
        {['Period','Subject','Room','Teacher'].map(h=>(
          <div key={h} className="text-[7px] font-bold uppercase tracking-wide" style={{color:`${config.primaryColor}70`}}>{h}</div>
        ))}
      </div>
      {Array.from({length:periods}).map((_,i)=>(
        <div key={i} className="grid grid-cols-4 gap-2 mb-1.5 items-center">
          <div className="w-4 h-4 rounded flex items-center justify-center text-[8px] font-bold"
            style={{backgroundColor:`${config.accentColor}50`,color:config.primaryColor}}>{i+1}</div>
          {[1,2,3].map(c=><div key={c} className="border-b h-4" style={C.line(config.primaryColor,0.12)}/>)}
        </div>
      ))}
    </div>
  )
}

const ProjectTrackerBlock: React.FC<BlockProps> = ({ block, config }) => {
  const count = (block.config.count as number)||3
  return (
    <div className="space-y-2">
      {Array.from({length:count}).map((_,i)=>(
        <div key={i} className="rounded-lg p-2" style={{backgroundColor:`${config.accentColor}20`,border:`1px solid ${config.accentColor}`}}>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex-1 border-b h-3.5" style={C.line(config.primaryColor,0.2)}/>
            <span className="text-[8px] text-ink-muted shrink-0">0%</span>
          </div>
          <div className="h-1.5 rounded-full" style={{backgroundColor:`${config.accentColor}60`}}>
            <div className="h-full w-0 rounded-full" style={{backgroundColor:config.primaryColor}}/>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main renderer
// ─────────────────────────────────────────────────────────────────────────────
export const PlannerBlockRenderer: React.FC<BlockProps> = ({ block, config }) => {
  if (block.hidden) return null
  const inlineTypes = ['header','date-header','divider','spacer','cover-title']
  const isInline = inlineTypes.includes(block.type)

  const renderContent = () => {
    switch(block.type) {
      case 'date-header': return <DateHeaderBlock block={block} config={config}/>
      case 'header': return <SectionHeaderBlock block={block} config={config}/>
      case 'divider': return <DividerBlock block={block} config={config}/>
      case 'spacer': return <SpacerBlock/>
      case 'cover-title': return <CoverTitleBlock block={block} config={config}/>
      case 'two-column': return <TwoColumnBlock block={block} config={config}/>
      case 'table-of-contents': return <TableOfContentsBlock block={block} config={config}/>
      case 'time-slots': return <TimeSlotsBlock block={block} config={config}/>
      case 'todo-list': return <TodoListBlock block={block} config={config}/>
      case 'goal-section': return <GoalSectionBlock block={block} config={config}/>
      case 'priority-matrix': return <PriorityMatrixBlock block={block} config={config}/>
      case 'week-grid': return <WeekGridBlock block={block} config={config}/>
      case 'month-calendar': return <MonthCalendarBlock block={block} config={config}/>
      case 'countdown': return <CountdownBlock block={block} config={config}/>
      case 'kanban': return <KanbanBlock block={block} config={config}/>
      case 'checklist': return <ChecklistBlock block={block} config={config}/>
      case 'notes': return <NotesBlock block={block} config={config}/>
      case 'reflection': return <ReflectionBlock block={block} config={config}/>
      case 'gratitude': return <GratitudeBlock block={block} config={config}/>
      case 'custom-text': return <CustomTextBlock block={block} config={config}/>
      case 'quote-block': return <QuoteBlock block={block} config={config}/>
      case 'brain-dump': return <BrainDumpBlock block={block} config={config}/>
      case 'focus-block': return <FocusBlock block={block} config={config}/>
      case 'meeting-notes': return <MeetingNotesBlock block={block} config={config}/>
      case 'reading-log': return <ReadingLogBlock block={block} config={config}/>
      case 'habit-grid': return <HabitGridBlock block={block} config={config}/>
      case 'mood-tracker': return <MoodTrackerBlock block={block} config={config}/>
      case 'water-tracker': return <WaterTrackerBlock block={block} config={config}/>
      case 'sleep-tracker': return <SleepTrackerBlock block={block} config={config}/>
      case 'workout-log': return <WorkoutLogBlock block={block} config={config}/>
      case 'meal-planner': return <MealPlannerBlock block={block} config={config}/>
      case 'progress-bar': return <ProgressBarBlock block={block} config={config}/>
      case 'savings-tracker': return <SavingsTrackerBlock block={block} config={config}/>
      case 'contact-card': return <ContactCardBlock block={block} config={config}/>
      case 'budget-row': return <BudgetRowBlock block={block} config={config}/>
      case 'expense-tracker': return <ExpenseTrackerBlock block={block} config={config}/>
      case 'class-schedule': return <ClassScheduleBlock block={block} config={config}/>
      case 'project-tracker': return <ProjectTrackerBlock block={block} config={config}/>
      default: return <div className="h-4 border border-dashed rounded text-[8px] flex items-center justify-center text-ink-faint" style={{borderColor:`${config.primaryColor}30`}}>{block.type}</div>
    }
  }

  const content = renderContent()
  if (!content) return null

  return (
    <div
      style={{
        marginBottom: isInline ? '6px' : `${block.style.marginBottom ?? 8}px`,
        padding: isInline ? 0 : `${block.style.padding}px`,
        backgroundColor: block.style.backgroundColor && block.style.backgroundColor !== 'transparent' ? block.style.backgroundColor : undefined,
        borderRadius: block.style.borderRadius ? `${block.style.borderRadius}px` : undefined,
        border: block.style.borderWidth && block.style.borderColor
          ? `${block.style.borderWidth}px solid ${block.style.borderColor}` : undefined,
      }}
    >
      {!isInline && block.label && block.type !== 'header' && (
        <div className="text-[8px] font-bold uppercase tracking-[0.15em] mb-1.5" style={{color:`${config.primaryColor}60`}}>
          {block.label}
        </div>
      )}
      {content}
    </div>
  )
}
