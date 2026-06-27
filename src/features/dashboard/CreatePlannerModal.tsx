import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calendar, CalendarDays, CalendarCheck, CheckSquare, CreditCard,
  Heart, Dumbbell, GraduationCap, Briefcase, BookOpen, FileText,
  Grid2X2, Palette, Brain, School, Gem, Star, Wallet,
} from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { usePlannerStore } from '@/store/plannerStore'
import { useUIStore } from '@/store/uiStore'
import { useAnalyticsStore } from '@/store/analyticsStore'
import { PLANNER_TYPE_LABELS, PLANNER_TYPE_DESCRIPTIONS } from '@/lib/defaults'
import type { PlannerType } from '@/types'
import { cn } from '@/utils/cn'

const TYPE_META: Record<PlannerType, { icon: React.ReactNode; color: string }> = {
  daily:     { icon: <Calendar size={20}/>,      color: '#6366F1' },
  weekly:    { icon: <CalendarDays size={20}/>,   color: '#8B5CF6' },
  monthly:   { icon: <CalendarCheck size={20}/>,  color: '#0EA5E9' },
  habit:     { icon: <CheckSquare size={20}/>,    color: '#10B981' },
  budget:    { icon: <CreditCard size={20}/>,     color: '#F59E0B' },
  wellness:  { icon: <Heart size={20}/>,          color: '#EC4899' },
  fitness:   { icon: <Dumbbell size={20}/>,       color: '#EF4444' },
  student:   { icon: <GraduationCap size={20}/>,  color: '#F97316' },
  business:  { icon: <Briefcase size={20}/>,      color: '#1E293B' },
  journal:   { icon: <BookOpen size={20}/>,       color: '#84CC16' },
  workbook:  { icon: <FileText size={20}/>,       color: '#06B6D4' },
  worksheet: { icon: <Grid2X2 size={20}/>,        color: '#6366F1' },
  creative:  { icon: <Palette size={20}/>,        color: '#A855F7' },
  adhd:      { icon: <Brain size={20}/>,          color: '#FF6B9D' },
  teacher:   { icon: <School size={20}/>,         color: '#20B2AA' },
  wedding:   { icon: <Gem size={20}/>,            color: '#C2185B' },
  kids:      { icon: <Star size={20}/>,           color: '#FF8C00' },
  finance:   { icon: <Wallet size={20}/>,         color: '#2E8B57' },
}

export const CreatePlannerModal: React.FC = () => {
  const { createModalOpen, setCreateModalOpen, toast } = useUIStore()
  const { createPlanner, folders } = usePlannerStore()
  const { trackPlannerCreated } = useAnalyticsStore()
  const navigate = useNavigate()

  const [selectedType, setSelectedType] = useState<PlannerType>('daily')
  const [name, setName] = useState('')
  const [folderId, setFolderId] = useState<string>('')

  const types = Object.keys(PLANNER_TYPE_LABELS) as PlannerType[]

  const handleCreate = () => {
    const planner = createPlanner(selectedType, name.trim() || undefined, folderId || undefined)
    trackPlannerCreated()
    setCreateModalOpen(false)
    setName('')
    setFolderId('')
    toast(`"${planner.name}" created`, 'success')
    navigate('/builder')
  }

  return (
    <Modal
      open={createModalOpen}
      onClose={() => setCreateModalOpen(false)}
      title="New Planner"
      description="Pick a type and we'll pre-fill the perfect layout"
      size="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={handleCreate}>Create Planner</Button>
        </>
      }
    >
      <div className="space-y-5">
        <Input
          label="Name (optional)"
          placeholder={`My ${PLANNER_TYPE_LABELS[selectedType]}`}
          value={name}
          onChange={e => setName(e.target.value)}
          inputSize="md"
        />

        {folders.length > 0 && (
          <div>
            <label className="text-xs text-ink-muted block mb-1">Add to folder (optional)</label>
            <select value={folderId} onChange={e => setFolderId(e.target.value)}
              className="w-full h-9 px-3 text-sm rounded-lg border border-border bg-paper text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 cursor-pointer">
              <option value="">No folder</option>
              {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
        )}

        <div>
          <p className="text-xs font-medium text-primary mb-3">Planner Type</p>
          <div className="grid grid-cols-3 gap-2">
            {types.map(type => {
              const meta = TYPE_META[type]
              return (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    'flex flex-col items-start gap-2 p-3 rounded-xl border-2 text-left transition-colors',
                    selectedType === type
                      ? 'border-accent bg-accent/5'
                      : 'border-border hover:border-border-strong bg-paper'
                  )}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${meta.color}18`, color: meta.color }}>
                    {meta.icon}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-primary leading-tight">
                      {PLANNER_TYPE_LABELS[type]}
                    </div>
                    <div className="text-[10px] text-ink-muted mt-0.5 leading-snug line-clamp-2">
                      {PLANNER_TYPE_DESCRIPTIONS[type]}
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>
    </Modal>
  )
}
