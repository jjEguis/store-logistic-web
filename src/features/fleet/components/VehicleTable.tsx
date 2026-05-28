import { ChevronRight } from 'lucide-react'
import type { Vehicle, VehicleState } from '@/types/domain'
import { fmtKg } from '@/lib/utils'
import VehicleAvatar from './VehicleAvatar'
import CategoryTag from './CategoryTag'
import StateMenu from './StateMenu'

interface Props {
  vehicles: Vehicle[]
  selectedId: number | null
  onSelect: (id: number) => void
  onChangeState: (id: number, estado: VehicleState) => void
}

const COLS = [
  { label: 'Vehículo',      w: '22%' },
  { label: 'Categoría',     w: '22%' },
  { label: 'Capacidad',     w: '14%' },
  { label: 'Transportista', w: '18%' },
  { label: 'Estado',        w: '18%' },
  { label: '',              w: '6%'  },
]

export default function VehicleTable({ vehicles, selectedId, onSelect, onChangeState }: Props) {
  if (vehicles.length === 0) {
    return (
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
        borderRadius: 'var(--r-card)', padding: '48px 24px', textAlign: 'center',
        color: 'var(--fg-3)', fontSize: 14,
      }}>
        No hay vehículos que coincidan con los filtros aplicados.
      </div>
    )
  }

  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
      borderRadius: 'var(--r-card)', overflow: 'hidden',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <thead>
          <tr style={{ background: 'var(--bg-surface-2)' }}>
            {COLS.map((c, i) => (
              <th key={i} style={{
                width: c.w, textAlign: 'left', padding: '10px 16px',
                fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.06em', color: 'var(--fg-2)',
                borderBottom: '1px solid var(--border-1)',
              }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vehicles.map(v => {
            const isSelected = selectedId === v.idVehiculo
            return (
              <tr
                key={v.idVehiculo}
                onClick={() => onSelect(v.idVehiculo)}
                style={{
                  cursor: 'pointer',
                  background: isSelected ? 'var(--bg-hover)' : 'transparent',
                  borderLeft: isSelected ? '2px solid var(--brand)' : '2px solid transparent',
                  borderBottom: '1px solid var(--border-1)',
                  transition: 'background var(--dur-fast) var(--ease)',
                }}
                onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)' }}
                onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                {/* Vehículo */}
                <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <VehicleAvatar id={v.idVehiculo} />
                    <div style={{ minWidth: 0 }}>
                      <div className="mono" style={{ fontWeight: 600, fontSize: 13 }}>#{v.idVehiculo}</div>
                    </div>
                  </div>
                </td>

                {/* Categoría */}
                <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                  <CategoryTag value={v.categoria} />
                </td>

                {/* Capacidad */}
                <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                  <div className="mono-tab" style={{ fontSize: 13 }}>{fmtKg(v.capacidadCarga)}</div>
                </td>

                {/* Transportista */}
                <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                  {v.idTransportista != null ? (
                    <span className="mono-sm">#{v.idTransportista}</span>
                  ) : (
                    <span style={{ fontSize: 12, color: 'var(--fg-3)', fontStyle: 'italic' }}>Sin asignar</span>
                  )}
                </td>

                {/* Estado */}
                <td
                  style={{ padding: '12px 16px', verticalAlign: 'middle' }}
                  onClick={e => e.stopPropagation()}
                >
                  <StateMenu value={v.estado} onChange={s => onChangeState(v.idVehiculo, s)} />
                </td>

                {/* Chevron */}
                <td style={{ padding: '12px 16px', textAlign: 'right', verticalAlign: 'middle', color: 'var(--fg-3)' }}>
                  <ChevronRight size={14} strokeWidth={1.5} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
