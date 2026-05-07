interface Props { id: number; size?: number }

export default function VehicleAvatar({ id, size = 36 }: Props) {
  const label = `V${String(id).padStart(2, '0')}`
  return (
    <div style={{
      width: size, height: size, borderRadius: 6, flexShrink: 0,
      background: 'var(--neutral-soft)', color: 'var(--fg-1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-mono)', fontSize: size > 30 ? 11 : 9,
      fontWeight: 600, letterSpacing: 0.5,
    }}>
      {label}
    </div>
  )
}
