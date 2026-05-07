import type { Vehicle, VehicleState } from '@/types/domain'

const ITEMS: { label: string; key: VehicleState | null; dotColor?: string }[] = [
  { label: 'Total',             key: null },
  { label: 'Disponibles',       key: 'DISPONIBLE',        dotColor: 'var(--success)' },
  { label: 'En ruta',           key: 'EN_RUTA',           dotColor: 'var(--info)' },
  { label: 'En mantenimiento',  key: 'EN_MANTENIMIENTO',  dotColor: 'var(--warning)' },
  { label: 'Fuera de servicio', key: 'FUERA_DE_SERVICIO', dotColor: 'var(--danger)' },
]

export default function StatStrip({ vehicles }: { vehicles: Vehicle[] }) {
  const counts = vehicles.reduce<Partial<Record<VehicleState, number>>>((acc, v) => {
    acc[v.estado] = (acc[v.estado] ?? 0) + 1
    return acc
  }, {})

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
      gap: 1, background: 'var(--border-1)',
      border: '1px solid var(--border-1)', borderRadius: 'var(--r-card)',
      overflow: 'hidden', marginBottom: 20,
    }}>
      {ITEMS.map(({ label, key, dotColor }) => {
        const value = key ? (counts[key] ?? 0) : vehicles.length
        return (
          <div key={label} style={{ padding: '14px 18px', background: 'var(--bg-surface)' }}>
            <div className="label" style={{ marginBottom: 6 }}>{label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span className="mono-tab" style={{ fontSize: 24, fontWeight: 600, color: 'var(--fg-1)', letterSpacing: -0.5 }}>
                {value}
              </span>
              {dotColor && (
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor }} />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
