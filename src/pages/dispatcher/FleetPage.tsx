import { useState } from 'react'
import { Truck, Plus, Search } from 'lucide-react'
import type { VehicleState } from '@/types/domain'
import { useFleet, useUpdateVehicleState } from '@/features/fleet/hooks/useFleet'
import StatStrip from '@/features/fleet/components/StatStrip'
import VehicleTable from '@/features/fleet/components/VehicleTable'
import VehicleDetail from '@/features/fleet/components/VehicleDetail'
import NewVehicleForm from '@/features/fleet/components/NewVehicleForm'

type StateFilter = VehicleState | 'ALL'

const SELECT_STYLE: React.CSSProperties = {
  padding: '7px 28px 7px 12px', fontSize: 13, fontFamily: 'inherit',
  border: '1px solid var(--border-2)', borderRadius: 'var(--r-input)',
  background: 'var(--bg-surface)', color: 'var(--fg-1)', cursor: 'pointer',
  appearance: 'none',
}

export default function FleetPage() {
  const { data: vehicles = [], isLoading, isError } = useFleet()
  const { mutate: changeState, isPending } = useUpdateVehicleState()

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<StateFilter>('ALL')
  const [showNewForm, setShowNewForm] = useState(false)

  const filtered = vehicles.filter(v => {
    if (filter !== 'ALL' && v.estado !== filter) return false
    if (query) {
      const q = query.toLowerCase()
      return String(v.idVehiculo).includes(q) || v.categoria.toLowerCase().includes(q)
    }
    return true
  })

  const selected = vehicles.find(v => v.idVehiculo === selectedId) ?? null

  const handleChangeState = (id: number, estado: VehicleState) => {
    changeState({ id, estado })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px',
        height: 'var(--topbar-h)', flexShrink: 0,
        background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6, background: 'var(--brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Truck size={16} strokeWidth={1.5} color="white" />
          </div>
          <h1 style={{ fontSize: 16, fontWeight: 600 }}>Vehículos</h1>
          <span style={{ fontSize: 13, color: 'var(--fg-2)', fontVariantNumeric: 'tabular-nums' }}>
            {vehicles.length} en flota
          </span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Search */}
        <div style={{ position: 'relative', width: 240 }}>
          <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <Search size={14} strokeWidth={1.5} color="var(--fg-3)" />
          </div>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por ID o categoría…"
            style={{
              width: '100%', padding: '7px 12px 7px 32px', fontSize: 13, fontFamily: 'inherit',
              border: '1px solid var(--border-2)', borderRadius: 'var(--r-input)',
              background: 'var(--bg-surface-2)', color: 'var(--fg-1)', outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* State filter */}
        <select value={filter} onChange={e => setFilter(e.target.value as StateFilter)} style={SELECT_STYLE}>
          <option value="ALL">Todos los estados</option>
          <option value="DISPONIBLE">Disponible</option>
          <option value="EN_RUTA">En ruta</option>
          <option value="EN_MANTENIMIENTO">En mantenimiento</option>
          <option value="FUERA_DE_SERVICIO">Fuera de servicio</option>
        </select>

        {/* New vehicle */}
        <button
          onClick={() => setShowNewForm(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 14px', fontSize: 14, fontWeight: 500, fontFamily: 'inherit',
            background: 'var(--brand)', color: 'white', border: 0,
            borderRadius: 'var(--r-input)', cursor: 'pointer',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--brand-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--brand)')}
        >
          <Plus size={16} strokeWidth={2} />
          Nuevo vehículo
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          {isLoading && (
            <div style={{ color: 'var(--fg-3)', fontSize: 14, textAlign: 'center', paddingTop: 48 }}>
              Cargando flota…
            </div>
          )}
          {isError && (
            <div style={{ color: 'var(--danger-fg)', fontSize: 14, textAlign: 'center', paddingTop: 48 }}>
              No se pudo cargar la flota. Verifica la conexión con el servidor.
            </div>
          )}
          {!isLoading && !isError && (
            <>
              <StatStrip vehicles={vehicles} />
              <VehicleTable
                vehicles={filtered}
                selectedId={selectedId}
                onSelect={id => setSelectedId(prev => prev === id ? null : id)}
                onChangeState={handleChangeState}
              />
            </>
          )}
        </div>

        {selected && (
          <VehicleDetail
            vehicle={selected}
            onClose={() => setSelectedId(null)}
            onChangeState={handleChangeState}
            isPending={isPending}
          />
        )}
      </div>

      {/* New vehicle modal */}
      {showNewForm && (
        <div
          onClick={() => setShowNewForm(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(14,15,12,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
          }}
        >
          <div onClick={e => e.stopPropagation()}>
            <NewVehicleForm onClose={() => setShowNewForm(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
