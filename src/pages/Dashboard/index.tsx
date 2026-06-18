import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, PenTool, BookOpen, Download, Clock, Trash2, Copy, ArrowRight } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/Misc'
import { Dropdown } from '@/components/ui/Dropdown'
import { usePlannerStore } from '@/store/plannerStore'
import { useUIStore } from '@/store/uiStore'
import { useTemplateStore } from '@/store/templateStore'
import { PLANNER_TYPE_LABELS } from '@/lib/defaults'
import { CreatePlannerModal } from '@/features/dashboard/CreatePlannerModal'
import type { Planner } from '@/types'

const TYPE_ICONS: Record<string, string> = {
  daily: '📅', weekly: '🗓', monthly: '📆', habit: '✅',
  budget: '💰', wellness: '🌿', fitness: '💪', student: '📚', business: '💼',
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

function PlannerCard({ planner, onOpen, onDuplicate, onDelete }: {
  planner: Planner
  onOpen: () => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  const updatedAt = new Date(planner.updatedAt)
  const relative = (() => {
    const diff = Date.now() - updatedAt.getTime()
    if (diff < 60000) return 'just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return updatedAt.toLocaleDateString()
  })()

  return (
    <motion.div variants={item}>
      <Card hover className="group relative overflow-hidden cursor-pointer" onClick={onOpen}>
        {/* Thumbnail */}
        <div
          className="h-36 rounded-lg mb-3 flex items-center justify-center text-4xl relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, #F8F6F2 0%, #EDE9E4 100%)` }}
        >
          <span className="text-5xl opacity-60">{TYPE_ICONS[planner.type]}</span>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 backdrop-blur-sm">
            <div className="bg-primary text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <PenTool size={12} />
              Open Builder
            </div>
          </div>
        </div>

        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-primary truncate">{planner.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{PLANNER_TYPE_LABELS[planner.type]}</Badge>
              <span className="text-xs text-secondary flex items-center gap-1">
                <Clock size={10} />
                {relative}
              </span>
            </div>
          </div>
          <Dropdown
            align="right"
            trigger={
              <button
                className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-md hover:bg-background transition-all text-secondary"
                onClick={e => e.stopPropagation()}
                aria-label="More options"
              >
                ···
              </button>
            }
            items={[
              { label: 'Open', icon: <PenTool size={14} />, onClick: onOpen },
              { label: 'Duplicate', icon: <Copy size={14} />, onClick: onDuplicate },
              { separator: true },
              { label: 'Delete', icon: <Trash2 size={14} />, onClick: onDelete, danger: true },
            ]}
          />
        </div>

        <div className="mt-2 text-xs text-secondary">
          {planner.pages.length} page{planner.pages.length !== 1 ? 's' : ''}
        </div>
      </Card>
    </motion.div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { planners, setActivePlanner, duplicatePlanner, deletePlanner } = usePlannerStore()
  const { setCreateModalOpen } = useUIStore()
  const { templates } = useTemplateStore()

  const handleOpen = (planner: Planner) => {
    setActivePlanner(planner.id)
    navigate('/builder')
  }

  const stats = [
    { label: 'Planners', value: planners.length, icon: <PenTool size={16} />, color: 'bg-primary/10 text-primary' },
    { label: 'Templates', value: templates.length, icon: <BookOpen size={16} />, color: 'bg-brand-sage/15 text-brand-sage' },
    { label: 'Exports', value: 0, icon: <Download size={16} />, color: 'bg-brand-lavender/20 text-brand-lavender' },
  ]

  return (
    <div className="flex flex-col h-full">
      <TopBar
        title="Dashboard"
        subtitle="Your planner workspace"
        actions={
          <Button size="sm" onClick={() => setCreateModalOpen(true)}>
            <Plus size={15} />
            New Planner
          </Button>
        }
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map(s => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-paper rounded-xl border border-border p-4 shadow-card"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}>
                  {s.icon}
                </div>
                <span className="text-2xl font-bold text-primary font-display">{s.value}</span>
              </div>
              <p className="text-sm text-secondary">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Planners */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-primary">Your Planners</h2>
            {planners.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setCreateModalOpen(true)}>
                <Plus size={14} />
                New
              </Button>
            )}
          </div>

          {planners.length === 0 ? (
            <div className="bg-paper rounded-2xl border border-dashed border-border p-12">
              <EmptyState
                icon={<PenTool size={32} />}
                title="No planners yet"
                description="Create your first planner to get started. Choose from 9 planner types with ready-made layouts."
                action={
                  <Button onClick={() => setCreateModalOpen(true)}>
                    <Plus size={15} />
                    Create your first planner
                  </Button>
                }
              />
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {/* New planner card */}
              <motion.div variants={item}>
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="w-full h-full min-h-[200px] rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-all group flex flex-col items-center justify-center gap-3 p-6"
                >
                  <div className="w-10 h-10 rounded-full bg-background group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                    <Plus size={20} className="text-secondary group-hover:text-primary" />
                  </div>
                  <span className="text-sm font-medium text-secondary group-hover:text-primary transition-colors">
                    New Planner
                  </span>
                </button>
              </motion.div>

              {[...planners].reverse().map(planner => (
                <PlannerCard
                  key={planner.id}
                  planner={planner}
                  onOpen={() => handleOpen(planner)}
                  onDuplicate={() => duplicatePlanner(planner.id)}
                  onDelete={() => deletePlanner(planner.id)}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* Quick start templates */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-primary">Quick Start Templates</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/templates')}>
              Browse all
              <ArrowRight size={13} />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {templates.slice(0, 3).map(tpl => (
              <motion.button
                key={tpl.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => navigate('/templates')}
                className="bg-paper rounded-xl border border-border p-4 text-left hover:shadow-card-hover transition-all"
              >
                <div className="text-2xl mb-2">{TYPE_ICONS[tpl.type]}</div>
                <div className="text-sm font-semibold text-primary">{tpl.name}</div>
                <div className="text-xs text-secondary mt-0.5 line-clamp-1">{tpl.description}</div>
                <div className="mt-2 text-xs text-secondary">{tpl.downloads.toLocaleString()} downloads</div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <CreatePlannerModal />
    </div>
  )
}
