import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button } from './Button'

// ── Modal ─────────────────────────────────────────────────────────────────────
interface ModalProps {
  open: boolean; onClose: () => void
  title?: string; description?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  children: React.ReactNode; footer?: React.ReactNode
  showClose?: boolean; closeOnBackdrop?: boolean
}

export const Modal: React.FC<ModalProps> = ({
  open, onClose, title, description, size = 'md', children, footer,
  showClose = true, closeOnBackdrop = true,
}) => {
  useEffect(() => {
    if (!open) return
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handle)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', handle); document.body.style.overflow = '' }
  }, [open, onClose])

  const sizes = { xs:'max-w-xs', sm:'max-w-md', md:'max-w-lg', lg:'max-w-2xl', xl:'max-w-4xl', '2xl':'max-w-6xl' }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.15}}
            className="absolute inset-0 bg-primary/25 backdrop-blur-[2px]"
            onClick={closeOnBackdrop ? onClose : undefined} />
          <motion.div
            initial={{opacity:0,scale:0.97,y:8}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.97,y:8}}
            transition={{duration:0.2,ease:[0.16,1,0.3,1]}}
            className={cn('relative w-full bg-paper rounded-2xl shadow-modal border border-border flex flex-col overflow-hidden max-h-[90vh]', sizes[size])}
            role="dialog" aria-modal="true" aria-label={title}
          >
            {(title || showClose) && (
              <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-border shrink-0">
                <div className="min-w-0 pr-4">
                  {title && <h2 className="text-base font-semibold text-primary">{title}</h2>}
                  {description && <p className="text-sm text-ink-muted mt-0.5">{description}</p>}
                </div>
                {showClose && (
                  <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close" className="shrink-0 -mt-0.5">
                    <X size={15}/>
                  </Button>
                )}
              </div>
            )}
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
            {footer && (
              <div className="px-6 pb-5 pt-4 border-t border-border flex items-center justify-end gap-2 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// ── Confirm Dialog ────────────────────────────────────────────────────────────
interface ConfirmDialogProps {
  open: boolean; onClose: () => void; onConfirm: () => void
  title: string; description?: string; confirmLabel?: string; danger?: boolean
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open, onClose, onConfirm, title, description, confirmLabel = 'Confirm', danger = false,
}) => (
  <Modal open={open} onClose={onClose} size="xs" title={title} description={description}
    footer={
      <>
        <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        <Button variant={danger ? 'danger' : 'default'} size="sm" onClick={() => { onConfirm(); onClose() }}>
          {confirmLabel}
        </Button>
      </>
    }
  >
    <div/>
  </Modal>
)

// ── Drawer ─────────────────────────────────────────────────────────────────────
interface DrawerProps {
  open: boolean; onClose: () => void
  title?: string; side?: 'left' | 'right' | 'bottom'
  children: React.ReactNode; width?: string
}

export const Drawer: React.FC<DrawerProps> = ({ open, onClose, title, side = 'right', children, width = '320px' }) => {
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [open, onClose])

  const variants = {
    right: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
    left: { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' } },
    bottom: { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } },
  }
  const v = variants[side]
  const posClass = { right: 'right-0 top-0 h-full', left: 'left-0 top-0 h-full', bottom: 'bottom-0 left-0 w-full' }[side]

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.15}}
            className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" onClick={onClose} />
          <motion.div
            initial={v.initial} animate={v.animate} exit={v.exit}
            transition={{duration:0.25,ease:[0.16,1,0.3,1]}}
            className={cn('absolute bg-paper shadow-modal border-border flex flex-col overflow-hidden', posClass, side !== 'bottom' && 'border-l')}
            style={{ width: side !== 'bottom' ? width : '100%', maxHeight: side === 'bottom' ? '80vh' : '100%' }}
          >
            {title && (
              <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
                <h2 className="text-sm font-semibold text-primary">{title}</h2>
                <Button variant="ghost" size="icon-sm" onClick={onClose}><X size={14}/></Button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
