export type PillTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand'

const TONES: Record<PillTone, { bg: string; fg: string; border: string }> = {
  success: { bg: 'var(--success-soft)', fg: 'var(--success-fg)', border: 'rgba(31,138,76,0.3)' },
  warning: { bg: 'var(--warning-soft)', fg: 'var(--warning-fg)', border: 'rgba(194,65,12,0.3)' },
  danger:  { bg: 'var(--danger-soft)',  fg: 'var(--danger-fg)',  border: 'rgba(180,35,24,0.3)' },
  info:    { bg: 'var(--info-soft)',    fg: 'var(--info-fg)',    border: 'rgba(11,107,203,0.3)' },
  neutral: { bg: 'var(--neutral-soft)', fg: 'var(--neutral-fg)', border: 'rgba(74,77,70,0.2)' },
  brand:   { bg: 'var(--brand-soft)',   fg: 'var(--brand-fg-soft)', border: 'rgba(217,83,30,0.3)' },
}

interface PillProps {
  tone?: PillTone
  dot?: boolean
  size?: 'sm' | 'md'
  children: React.ReactNode
}

export default function Pill({ tone = 'neutral', dot = true, size = 'md', children }: PillProps) {
  const t = TONES[tone]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: size === 'sm' ? '1px 8px' : '2px 10px',
      borderRadius: 'var(--r-pill)',
      fontSize: size === 'sm' ? 11 : 12, fontWeight: 600, lineHeight: 1.4,
      background: t.bg, color: t.fg, border: `1px solid ${t.border}`,
      whiteSpace: 'nowrap',
    }}>
      {dot && (
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
      )}
      {children}
    </span>
  )
}
