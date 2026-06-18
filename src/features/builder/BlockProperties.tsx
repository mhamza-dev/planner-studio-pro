import React from 'react'
import { Trash2, Copy, Lock, Unlock, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { Slider, Toggle } from '@/components/ui/Slider'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { usePlannerStore } from '@/store/plannerStore'
import type { PlannerBlock } from '@/types'

interface BlockPropertiesProps {
  block: PlannerBlock
  plannerId: string
  pageId: string
}

export const BlockProperties: React.FC<BlockPropertiesProps> = ({ block, plannerId, pageId }) => {
  const { updateBlock, deleteBlock, duplicateBlock, reorderBlocks, getActivePage } = usePlannerStore()

  const page = getActivePage()
  const blockIndex = page?.blocks.findIndex(b => b.id === block.id) ?? -1
  const canMoveUp = blockIndex > 0
  const canMoveDown = blockIndex < (page?.blocks.length ?? 0) - 1

  const update = (updates: Partial<PlannerBlock>) =>
    updateBlock(plannerId, pageId, block.id, updates)

  const updateStyle = (styleUpdates: Partial<PlannerBlock['style']>) =>
    update({ style: { ...block.style, ...styleUpdates } })

  const updateConfig = (configUpdates: Record<string, unknown>) =>
    update({ config: { ...block.config, ...configUpdates } })

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-primary">{block.label}</span>
          <span className="text-[10px] font-mono text-secondary bg-background px-1.5 py-0.5 rounded">{block.type}</span>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <Button
            variant="ghost" size="icon-sm"
            onClick={() => canMoveUp && reorderBlocks(plannerId, pageId, blockIndex, blockIndex - 1)}
            disabled={!canMoveUp} aria-label="Move up"
          >
            <ChevronUp size={13} />
          </Button>
          <Button
            variant="ghost" size="icon-sm"
            onClick={() => canMoveDown && reorderBlocks(plannerId, pageId, blockIndex, blockIndex + 1)}
            disabled={!canMoveDown} aria-label="Move down"
          >
            <ChevronDown size={13} />
          </Button>
          <Button
            variant="ghost" size="icon-sm"
            onClick={() => duplicateBlock(plannerId, pageId, block.id)}
            aria-label="Duplicate"
          >
            <Copy size={13} />
          </Button>
          <Button
            variant="ghost" size="icon-sm"
            onClick={() => update({ locked: !block.locked })}
            aria-label={block.locked ? 'Unlock' : 'Lock'}
          >
            {block.locked ? <Lock size={13} /> : <Unlock size={13} />}
          </Button>
          <Button
            variant="ghost" size="icon-sm"
            onClick={() => deleteBlock(plannerId, pageId, block.id)}
            className="text-red-500 hover:text-red-600 ml-auto"
            aria-label="Delete block"
          >
            <Trash2 size={13} />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Label */}
        <Input
          label="Label"
          value={block.label}
          onChange={e => update({ label: e.target.value })}
        />

        {/* Block-specific config */}
        {(block.type === 'time-slots') && (
          <div className="space-y-3">
            <Select
              label="Start Hour"
              value={String(block.config.startHour || 6)}
              onChange={e => updateConfig({ startHour: Number(e.target.value) })}
              options={Array.from({ length: 24 }, (_, i) => ({ value: String(i), label: `${String(i).padStart(2, '0')}:00` }))}
            />
            <Select
              label="End Hour"
              value={String(block.config.endHour || 22)}
              onChange={e => updateConfig({ endHour: Number(e.target.value) })}
              options={Array.from({ length: 24 }, (_, i) => ({ value: String(i), label: `${String(i).padStart(2, '0')}:00` }))}
            />
            <Select
              label="Interval"
              value={String(block.config.interval || 60)}
              onChange={e => updateConfig({ interval: Number(e.target.value) })}
              options={[{ value: '15', label: '15 min' }, { value: '30', label: '30 min' }, { value: '60', label: '1 hour' }]}
            />
          </div>
        )}

        {(block.type === 'todo-list' || block.type === 'goal-section' || block.type === 'gratitude') && (
          <Slider
            label="Count"
            value={Number(block.config.count) || 5}
            onChange={v => updateConfig({ count: v })}
            min={2}
            max={15}
            step={1}
          />
        )}

        {block.type === 'notes' && (
          <Slider
            label="Lines"
            value={Number(block.config.lines) || 5}
            onChange={v => updateConfig({ lines: v })}
            min={2}
            max={20}
            step={1}
          />
        )}

        {block.type === 'habit-grid' && (
          <>
            <Slider
              label="Number of Habits"
              value={Number(block.config.habitCount) || 6}
              onChange={v => updateConfig({ habitCount: v })}
              min={2}
              max={15}
              step={1}
            />
            <Slider
              label="Days"
              value={Number(block.config.daysInMonth) || 31}
              onChange={v => updateConfig({ daysInMonth: v })}
              min={7}
              max={31}
              step={1}
            />
          </>
        )}

        {block.type === 'water-tracker' && (
          <Slider
            label="Daily Goal (cups)"
            value={Number(block.config.goal) || 8}
            onChange={v => updateConfig({ goal: v })}
            min={4}
            max={16}
            step={1}
          />
        )}

        {block.type === 'workout-log' && (
          <Slider
            label="Exercises"
            value={Number(block.config.exerciseCount) || 4}
            onChange={v => updateConfig({ exerciseCount: v })}
            min={2}
            max={12}
            step={1}
          />
        )}

        {block.type === 'budget-row' && (
          <Slider
            label="Rows"
            value={Number(block.config.rows) || 5}
            onChange={v => updateConfig({ rows: v })}
            min={2}
            max={15}
            step={1}
          />
        )}

        {block.type === 'project-tracker' && (
          <Slider
            label="Projects"
            value={Number(block.config.count) || 3}
            onChange={v => updateConfig({ count: v })}
            min={1}
            max={8}
            step={1}
          />
        )}

        {block.type === 'class-schedule' && (
          <Slider
            label="Periods"
            value={Number(block.config.periods) || 5}
            onChange={v => updateConfig({ periods: v })}
            min={3}
            max={10}
            step={1}
          />
        )}

        {/* Style */}
        <div className="space-y-3 pt-2 border-t border-border">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-secondary">Style</p>

          <ColorPicker
            label="Background"
            value={block.style.backgroundColor || 'transparent'}
            onChange={v => updateStyle({ backgroundColor: v })}
          />

          <ColorPicker
            label="Border Color"
            value={block.style.borderColor}
            onChange={v => updateStyle({ borderColor: v })}
          />

          <Slider
            label="Border Width"
            value={block.style.borderWidth}
            onChange={v => updateStyle({ borderWidth: v })}
            min={0}
            max={4}
            step={1}
            formatValue={v => `${v}px`}
          />

          <Slider
            label="Border Radius"
            value={block.style.borderRadius}
            onChange={v => updateStyle({ borderRadius: v })}
            min={0}
            max={16}
            step={1}
            formatValue={v => `${v}px`}
          />

          <Slider
            label="Padding"
            value={block.style.padding}
            onChange={v => updateStyle({ padding: v })}
            min={0}
            max={32}
            step={2}
            formatValue={v => `${v}px`}
          />
        </div>
      </div>
    </div>
  )
}
