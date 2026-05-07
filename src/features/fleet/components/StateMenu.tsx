import { useEffect, useRef, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import Pill from '@/components/Pill'
import type { VehicleState } from '@/types/domain'
import { STATE_LABEL, STATE_TONE, ALL_STATES } from './constants'

interface Props {
  value: VehicleState
  onChange: (state: VehicleState) => void
  disabled?: boolean
}

export default function StateMenu({ value, onChange, disabled }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const off = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', off, true)
    return () => document.removeEventListener('pointerdown', off, true)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => !disabled && setOpen(o => !o)}
        disabled={disabled}
        style={{ background: 'transparent', border: 0, padding: 0, cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
      >
        <Pill tone={STATE_TONE[value]}>
          {STATE_LABEL[value]}
          <ChevronRight size={11} strokeWidth={2} style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform var(--dur-base) var(--ease)' }} />
        </Pill>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 50,
          background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
          borderRadius: 'var(--r-card)', boxShadow: 'var(--shadow-md)',
          padding: 4, minWidth: 210,
        }}>
          {ALL_STATES.map(s => (
            <button
              key={s}
              onClick={() => { onChange(s); setOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', width: '100%',
                padding: '8px 10px', border: 0, borderRadius: 5, cursor: 'pointer',
                background: s === value ? 'var(--bg-hover)' : 'transparent',
                fontFamily: 'inherit', textAlign: 'left',
              }}
            >
              <Pill tone={STATE_TONE[s]}>{STATE_LABEL[s]}</Pill>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
