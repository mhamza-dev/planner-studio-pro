import React from 'react'
import { motion } from 'framer-motion'
import { Keyboard, CheckCircle, ArrowRight } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useUIStore } from '@/store/uiStore'

// ── Keyboard Shortcuts Modal ──────────────────────────────────────────────────
const SHORTCUTS = [
  { section: 'Global', items: [
    { keys: ['Ctrl', 'K'], label: 'Open command palette' },
    { keys: ['Ctrl', 'N'], label: 'New planner' },
    { keys: ['Ctrl', 'E'], label: 'Export planner' },
    { keys: ['?'],         label: 'Show shortcuts' },
    { keys: ['Esc'],       label: 'Close / deselect' },
  ]},
  { section: 'Builder', items: [
    { keys: ['Ctrl', 'Z'],        label: 'Undo' },
    { keys: ['Ctrl', 'Shift', 'Z'], label: 'Redo' },
    { keys: ['Ctrl', '+'],        label: 'Zoom in' },
    { keys: ['Ctrl', '−'],        label: 'Zoom out' },
    { keys: ['Ctrl', '0'],        label: 'Reset zoom' },
    { keys: ['Del'],              label: 'Delete selected block' },
  ]},
  { section: 'Navigation', items: [
    { keys: ['G', 'D'], label: 'Go to Dashboard' },
    { keys: ['G', 'B'], label: 'Go to Builder' },
    { keys: ['G', 'T'], label: 'Go to Templates' },
    { keys: ['G', 'S'], label: 'Go to Settings' },
  ]},
]

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 text-[10px] font-semibold font-mono bg-surface-sunken border border-border rounded text-primary">
      {children}
    </kbd>
  )
}

export const ShortcutsModal: React.FC = () => {
  const { shortcutsModalOpen, setShortcutsModalOpen } = useUIStore()
  return (
    <Modal open={shortcutsModalOpen} onClose={() => setShortcutsModalOpen(false)}
      title="Keyboard Shortcuts" size="md">
      <div className="space-y-6">
        {SHORTCUTS.map(section => (
          <div key={section.section}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint mb-3">{section.section}</p>
            <div className="space-y-2">
              {section.items.map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-primary">{item.label}</span>
                  <div className="flex items-center gap-1">
                    {item.keys.map((k, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <span className="text-ink-faint text-xs">+</span>}
                        <Kbd>{k}</Kbd>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}

// ── Onboarding Modal ──────────────────────────────────────────────────────────
const STEPS = [
  {
    title: 'Welcome to Planner Studio Pro',
    description: 'The professional planner builder for creators, educators, and Etsy sellers. Let\'s get you set up in under a minute.',
    action: 'Get started',
  },
  {
    title: 'Create your first planner',
    description: 'Choose from 13 planner types — daily, weekly, habit trackers, budget planners, journals, and more. Each comes pre-filled with the right blocks.',
    action: 'Next',
  },
  {
    title: 'Drag blocks to build',
    description: 'Over 35 content blocks available. Drag them from the left panel onto your canvas. Click any block to edit its settings on the right.',
    action: 'Next',
  },
  {
    title: 'Export in seconds',
    description: 'Export print-ready PDFs at up to 300 DPI, or high-quality PNG/JPG images. Perfect for Etsy listings or personal printing.',
    action: 'Next',
  },
  {
    title: 'Etsy-ready tools built in',
    description: 'Use the Etsy Tools page to auto-generate listing titles, descriptions, and tags. Plus a pricing calculator and mockup preview.',
    action: 'Start building',
  },
]

export const OnboardingModal: React.FC = () => {
  const { onboardingOpen, onboardingStep, setOnboardingStep, completeOnboarding, setCreateModalOpen } = useUIStore()
  const step = STEPS[onboardingStep] ?? STEPS[0]
  const isLast = onboardingStep === STEPS.length - 1

  const next = () => {
    if (isLast) {
      completeOnboarding()
      setCreateModalOpen(true)
    } else {
      setOnboardingStep(onboardingStep + 1)
    }
  }

  return (
    <Modal open={onboardingOpen} onClose={completeOnboarding} size="sm" showClose={false} closeOnBackdrop={false}>
      <div className="text-center px-2 pb-2">
        {/* Step dots */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === onboardingStep ? 'w-6 bg-accent' : i < onboardingStep ? 'w-1.5 bg-accent/40' : 'w-1.5 bg-border'}`}/>
          ))}
        </div>

        <motion.div key={onboardingStep} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <h2 className="text-base font-bold text-primary mb-2">{step.title}</h2>
          <p className="text-sm text-ink-muted leading-relaxed mb-6">{step.description}</p>
        </motion.div>

        <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" size="sm" onClick={completeOnboarding} className="text-ink-muted">
            Skip
          </Button>
          <Button size="sm" onClick={next}>
            {step.action} {!isLast && <ArrowRight size={13}/>}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
