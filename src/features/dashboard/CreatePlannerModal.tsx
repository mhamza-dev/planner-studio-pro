import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { usePlannerStore } from '@/store/plannerStore'
import { useUIStore } from '@/store/uiStore'
import { PLANNER_TYPE_LABELS, PLANNER_TYPE_DESCRIPTIONS } from '@/lib/defaults'
import type { PlannerType } from '@/types'

const TYPE_ICONS: Record<PlannerType, string> = {
  daily: '📅',
  weekly: '🗓',
  monthly: '📆',
  habit: '✅',
  budget: '💰',
  wellness: '🌿',
  fitness: '💪',
  student: '📚',
  business: '💼',
}

const TYPE_COLORS: Record<PlannerType, string> = {
  daily: '#2D4A22',
  weekly: '#0C2340',
  monthly: '#3D1A08',
  habit: '#2D1B69',
  budget: '#1A2E1A',
  wellness: '#4A1942',
  fitness: '#0D0D0D',
  student: '#8B3A00',
  business: '#111827',
}

export const CreatePlannerModal: React.FC = () => {
  const { createModalOpen, setCreateModalOpen } = useUIStore()
  const { createPlanner } = usePlannerStore()
  const navigate = useNavigate()

  const [selectedType, setSelectedType] = useState<PlannerType>('daily')
  const [name, setName] = useState('')

  const types = Object.keys(PLANNER_TYPE_LABELS) as PlannerType[]

  const handleCreate = () => {
    const planner = createPlanner(selectedType, name || undefined)
    setCreateModalOpen(false)
    setName('')
    navigate('/builder')
  }

  return (
    <Modal
      open={createModalOpen}
      onClose={() => setCreateModalOpen(false)}
      title="New Planner"
      description="Choose a type to get started with the right layout"
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate}>Create Planner</Button>
        </>
      }
    >
      <div className="space-y-5">
        <Input
          label="Name (optional)"
          placeholder={`My ${PLANNER_TYPE_LABELS[selectedType]}`}
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <div>
          <p className="text-sm font-medium text-primary mb-3">Planner Type</p>
          <div className="grid grid-cols-3 gap-2">
            {types.map(type => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedType(type)}
                className={`flex flex-col items-start gap-1.5 p-3 rounded-xl border-2 text-left transition-colors ${
                  selectedType === type
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-accent-dark bg-paper'
                }`}
              >
                <span className="text-xl">{TYPE_ICONS[type]}</span>
                <div>
                  <div className="text-sm font-semibold text-primary leading-tight">
                    {PLANNER_TYPE_LABELS[type]}
                  </div>
                  <div className="text-xs text-secondary mt-0.5 leading-snug line-clamp-2">
                    {PLANNER_TYPE_DESCRIPTIONS[type]}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
