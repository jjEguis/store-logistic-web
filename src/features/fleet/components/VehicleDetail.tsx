import { X, ArrowRight, UserPlus } from 'lucide-react'
import Pill from '@/components/Pill'
import type { Vehicle, VehicleState } from '@/types/domain'
import { fmtKg } from '@/lib/utils'
import VehicleAvatar from './VehicleAvatar'
import CategoryTag from './CategoryTag'
import StateMenu from './StateMenu'
import { STATE_LABEL, STATE_TONE } from './constants'

const MOCK_HISTORY = [
  { ts: '12 may 2026 · 08:14', from: 'DISPONIBLE' as VehicleState, to: 'EN_RUTA' as VehicleState, note: 'Asignación automática' },
  { ts: '11 may 2026 · 17:42', from: 'EN_RUTA' as VehicleState, to: 'DISPONIBLE' as VehicleState, note: 'Fin de jornada' },
]

interface Props {
  vehicle: Vehicle
  onClose: () => void
  onChangeState: (id: number, estado: VehicleState) => void
  isPending?: boolean
}

export default function VehicleDetail({ vehicle: v, onClose, onChangeState, isPending }: Props) {
  return (
    <div style={{
      width: 460, flexShrink: 0,
      background: 'var(--bg-surface)', borderLeft: '1px solid var(--border-1)',
      display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', borderBottom: '1px solid var(--border-1)', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <VehicleAvatar id={v.idVehiculo} size={32} />
          <div>
            <div className="mono" style={{ fontWeight: 600, fontSize: 14 }}>Vehículo #{v.idVehiculo}</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--fg-2)', padding: 4, display: 'flex' }}>
          <X size={18} strokeWidth={1.5} />
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Estado actual */}
        <section>
          <div className="label" style={{ marginBottom: 8 }}>Estado actual</div>
          <StateMenu value={v.estado} onChange={s => onChangeState(v.idVehiculo, s)} disabled={isPending} />
        </section>

        {/* Especificaciones */}
        <section>
          <div className="label" style={{ marginBottom: 10 }}>Especificaciones</div>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
            border: '1px solid var(--border-1)', borderRadius: 'var(--r-card)', padding: 14,
          }}>
            {[
              { label: 'Categoría',          node: <CategoryTag value={v.categoria} /> },
              { label: 'Capacidad de carga', node: <span className="mono-tab" style={{ fontSize: 14, fontWeight: 600 }}>{fmtKg(v.capacidadCarga)}</span> },
            ].map(({ label, node }) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>{label}</div>
                <div style={{ marginTop: 4 }}>{node}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Transportista */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span className="label">Transportista asignado</span>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'transparent', border: 0, cursor: 'pointer',
              fontSize: 13, color: 'var(--fg-2)', padding: '4px 8px',
              borderRadius: 'var(--r-input)',
            }}>
              <UserPlus size={14} strokeWidth={1.5} />
              {v.idTransportista != null ? 'Reasignar' : 'Asignar'}
            </button>
          </div>
          {v.idTransportista != null ? (
            <div style={{
              border: '1px solid var(--border-1)', borderRadius: 'var(--r-card)',
              padding: 14, display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'var(--brand-soft)', color: 'var(--brand-fg-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 600, fontSize: 14, flexShrink: 0,
                fontFamily: 'var(--font-mono)',
              }}>
                T{v.idTransportista}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>Transportista #{v.idTransportista}</div>
                <div className="mono-sm" style={{ color: 'var(--fg-3)' }}>ID {v.idTransportista}</div>
              </div>
            </div>
          ) : (
            <div style={{
              border: '1px dashed var(--border-2)', borderRadius: 'var(--r-card)',
              padding: 18, textAlign: 'center', color: 'var(--fg-2)', fontSize: 13,
            }}>
              Vehículo sin transportista asignado.
            </div>
          )}
        </section>

        {/* Historial */}
        <section>
          <div className="label" style={{ marginBottom: 10 }}>Historial de estados</div>
          <div style={{ position: 'relative', paddingLeft: 24 }}>
            <div style={{ position: 'absolute', left: 7, top: 6, bottom: 6, width: 1, background: 'var(--border-1)' }} />
            {MOCK_HISTORY.map((h, i) => (
              <div key={i} style={{ position: 'relative', paddingBottom: 16 }}>
                <div style={{
                  position: 'absolute', left: -21, top: 4,
                  width: 11, height: 11, borderRadius: '50%',
                  background: 'var(--bg-surface)', border: '2px solid var(--brand)',
                }} />
                <div className="mono-sm" style={{ color: 'var(--fg-3)', marginBottom: 2 }}>{h.ts}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Pill tone={STATE_TONE[h.from]} size="sm" dot={false}>{STATE_LABEL[h.from]}</Pill>
                  <ArrowRight size={12} strokeWidth={1.5} color="var(--fg-3)" />
                  <Pill tone={STATE_TONE[h.to]} size="sm" dot={false}>{STATE_LABEL[h.to]}</Pill>
                </div>
                <div style={{ fontSize: 13, color: 'var(--fg-1)' }}>{h.note}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
