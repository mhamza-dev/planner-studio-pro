import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'

export type DropdownItem =
  | {
      label: string
      icon?: React.ReactNode
      onClick?: () => void
      danger?: boolean
      disabled?: boolean
    }
  | {
      separator: true
    }

interface DropdownProps {
  trigger: React.ReactElement
  items: DropdownItem[]
  align?: 'left' | 'right'
  className?: string
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'left',
  className,
}) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handle)

    return () => {
      document.removeEventListener('mousedown', handle)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={cn('relative inline-flex', className)}
    >
      {React.cloneElement(trigger, {
        onClick: () => setOpen(prev => !prev),
      })}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            role="menu"
            className={cn(
              'absolute top-full z-50 mt-1 min-w-[160px] overflow-hidden rounded-xl border border-border bg-paper shadow-modal',
              align === 'right' ? 'right-0' : 'left-0'
            )}
          >
            {items.map((item, i) => {
              if ('separator' in item) {
                return (
                  <div
                    key={`separator-${i}`}
                    className="my-1 h-px bg-border"
                  />
                )
              }

              return (
                <button
                  key={`item-${i}`}
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => {
                    item.onClick?.()
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors duration-100',
                    item.danger
                      ? 'text-red-600 hover:bg-red-50 disabled:opacity-40'
                      : 'text-primary hover:bg-background disabled:opacity-40',
                    item.disabled && 'cursor-not-allowed'
                  )}
                >
                  {item.icon && (
                    <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center">
                      {item.icon}
                    </span>
                  )}

                  {item.label}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
