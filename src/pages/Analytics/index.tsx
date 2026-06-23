import React from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, FileText, Download, Blocks, Calendar, Trophy, Activity } from 'lucide-react'
import { TopBar } from '@/components/layout/index'
import { Card } from '@/components/ui/Card'
import { useAnalyticsStore } from '@/store/analyticsStore'
import { usePlannerStore } from '@/store/plannerStore'
import { PLANNER_TYPE_LABELS } from '@/lib/defaults'
import type { PlannerType } from '@/types'
import { cn } from '@/utils/cn'

function StatCard({ icon, label, value, sub, color }: { icon:React.ReactNode; label:string; value:string|number; sub?:string; color:string }) {
  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
      className="bg-paper rounded-xl border border-border p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', color)}>{icon}</div>
        <span className="text-3xl font-bold text-primary font-display">{value}</span>
      </div>
      <p className="text-sm font-medium text-primary">{label}</p>
      {sub && <p className="text-xs text-ink-muted mt-0.5">{sub}</p>}
    </motion.div>
  )
}

function MiniBar({ label, value, max, color }: { label:string; value:number; max:number; color:string }) {
  const pct = max > 0 ? (value/max)*100 : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-ink-muted w-28 truncate shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-surface-sunken rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{width:`${pct}%`, backgroundColor:color}}/>
      </div>
      <span className="text-xs font-semibold text-primary w-8 text-right tabular-nums">{value}</span>
    </div>
  )
}

export default function AnalyticsPage() {
  const { stats, blockUsage, dailyExports } = useAnalyticsStore()
  const { planners } = usePlannerStore()

  // Planner type breakdown
  const typeBreakdown = Object.entries(
    planners.reduce<Record<string,number>>((acc,p) => { acc[p.type]=(acc[p.type]||0)+1; return acc }, {})
  ).sort((a,b)=>b[1]-a[1])

  // Block usage top 10
  const topBlocks = Object.entries(blockUsage).sort((a,b)=>b[1]-a[1]).slice(0,10)
  const maxBlockCount = topBlocks[0]?.[1] ?? 1

  // Export activity (last 14 days)
  const last14 = Array.from({length:14},(_,i)=>{
    const d = new Date(); d.setDate(d.getDate()-13+i)
    const key = d.toISOString().split('T')[0]
    return { date: d.toLocaleDateString('en-US',{month:'short',day:'numeric'}), count: dailyExports.find(e=>e.date===key)?.count??0 }
  })
  const maxExports = Math.max(...last14.map(d=>d.count), 1)

  const statusCounts = planners.reduce<Record<string,number>>((acc,p)=>{acc[p.status]=(acc[p.status]||0)+1;return acc},{})

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Analytics" subtitle="Your creation activity and usage insights"/>

      <div className="flex-1 overflow-auto p-6 space-y-6 max-w-5xl">
        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<FileText size={16}/>} label="Planners Created" value={stats.plannersCreated} color="bg-accent/10 text-accent"/>
          <StatCard icon={<Blocks size={16}/>} label="Blocks Added" value={stats.blocksAdded} color="bg-purple-100 text-purple-600"/>
          <StatCard icon={<Download size={16}/>} label="Exports Made" value={stats.exportsCompleted} color="bg-amber-100 text-amber-600"/>
          <StatCard icon={<Trophy size={16}/>} label="Templates Used" value={stats.templatesUsed} color="bg-emerald-100 text-emerald-600"/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export activity */}
          <Card padding="md">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={15} className="text-ink-muted"/>
              <h3 className="text-sm font-semibold text-primary">Export Activity — Last 14 Days</h3>
            </div>
            <div className="flex items-end gap-1 h-24">
              {last14.map((d,i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-sm transition-all"
                    style={{height:`${(d.count/maxExports)*100}%`, minHeight:d.count>0?'4px':'0', backgroundColor:d.count>0?'#6366F1':'#E4E4E7'}}/>
                  {(i===0||i===6||i===13) && (
                    <span className="text-[8px] text-ink-faint">{d.date}</span>
                  )}
                </div>
              ))}
            </div>
            {last14.every(d=>d.count===0) && (
              <p className="text-xs text-ink-faint text-center mt-2">No exports yet — export a planner to see activity</p>
            )}
          </Card>

          {/* Planner type breakdown */}
          <Card padding="md">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={15} className="text-ink-muted"/>
              <h3 className="text-sm font-semibold text-primary">Planner Types</h3>
            </div>
            {typeBreakdown.length > 0 ? (
              <div className="space-y-2.5">
                {typeBreakdown.map(([type, count]) => (
                  <MiniBar key={type}
                    label={PLANNER_TYPE_LABELS[type as PlannerType] ?? type}
                    value={count}
                    max={typeBreakdown[0][1]}
                    color="#6366F1"/>
                ))}
              </div>
            ) : (
              <p className="text-xs text-ink-faint text-center py-6">Create planners to see breakdown</p>
            )}
          </Card>

          {/* Top block types */}
          <Card padding="md">
            <div className="flex items-center gap-2 mb-4">
              <Blocks size={15} className="text-ink-muted"/>
              <h3 className="text-sm font-semibold text-primary">Most Used Blocks</h3>
            </div>
            {topBlocks.length > 0 ? (
              <div className="space-y-2.5">
                {topBlocks.map(([type,count]) => (
                  <MiniBar key={type}
                    label={type.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}
                    value={count} max={maxBlockCount} color="#8B5CF6"/>
                ))}
              </div>
            ) : (
              <p className="text-xs text-ink-faint text-center py-6">Add blocks to see usage stats</p>
            )}
          </Card>

          {/* Planner status */}
          <Card padding="md">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={15} className="text-ink-muted"/>
              <h3 className="text-sm font-semibold text-primary">Planner Status</h3>
            </div>
            <div className="space-y-3">
              {[
                {key:'draft',label:'Drafts',color:'#94A3B8'},
                {key:'active',label:'Active',color:'#10B981'},
                {key:'archived',label:'Archived',color:'#F59E0B'},
                {key:'sold',label:'Sold on Etsy',color:'#6366F1'},
              ].map(s => (
                <div key={s.key} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{backgroundColor:s.color}}/>
                  <span className="text-xs text-primary flex-1">{s.label}</span>
                  <span className="text-sm font-bold text-primary tabular-nums">{statusCounts[s.key]??0}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-muted">Total pages created</span>
                <span className="font-bold text-primary">{stats.totalPagesCreated}</span>
              </div>
              {stats.favoriteBlockType && (
                <div className="flex items-center justify-between text-xs mt-2">
                  <span className="text-ink-muted">Favourite block</span>
                  <span className="font-semibold text-primary capitalize">{stats.favoriteBlockType.replace(/-/g,' ')}</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
