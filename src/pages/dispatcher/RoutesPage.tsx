import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Search, Truck, List } from 'lucide-react'
import type { Route, RouteStatus } from '@/types/domain'
import { useRoutes, useAssignVehicle } from '@/features/routes/hooks/useRoutes'

type StatusFilter = RouteStatus | 'ALL'

const STATUS_LABEL: Record<RouteStatus, string> = {
  AVAILABLE:       'Disponible',
  CLOSED:          'Cerrada',
  PENDING_VEHICLE: 'Sin vehículo',
}

const STATUS_COLORS: Record<RouteStatus, { bg: string; fg: string }> = {
  AVAILABLE:       { bg: 'var(--success-bg)', fg: 'var(--success-fg)' },
  CLOSED:          { bg: 'var(--bg-surface-2)', fg: 'var(--fg-3)' },
  PENDING_VEHICLE: { bg: 'var(--warning-bg)', fg: 'var(--warning-fg)' },
}

const SELECT_STYLE: React.CSSProperties = {
  padding: '7px 28px 7px 12px', fontSize: 13, fontFamily: 'inherit',
  border: '1px solid var(--border-2)', borderRadius: 'var(--r-input)',
  background: 'var(--bg-surface)', color: 'var(--fg-1)', cursor: 'pointer',
  appearance: 'none',
}

function OccupancyBar({ pct }: { pct: number }) {
  const color = pct >= 90 ? 'var(--danger-fg)' : pct >= 70 ? 'var(--warning-fg)' : 'var(--success-fg)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        flex: 1, height: 6, borderRadius: 99,
        background: 'var(--border-2)', overflow: 'hidden',
      }}>
        <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: color, borderRadius: 99 }} />
      </div>
      <span style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums', color, minWidth: 36, textAlign: 'right' }}>
        {pct.toFixed(0)}%
      </span>
    </div>
  )
}

function AssignForm({ routeId, onDone }: { routeId: number; onDone: () => void }) {
  const { mutate, isPending } = useAssignVehicle()
  const [vehicleId, setVehicleId] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!vehicleId.trim()) return
    mutate({ routeId, vehicleId: vehicleId.trim() }, { onSuccess: onDone })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
      <input
        autoFocus
        value={vehicleId}
        onChange={e => setVehicleId(e.target.value)}
        placeholder="ID del vehículo"
        style={{
          flex: 1, padding: '6px 10px', fontSize: 13, fontFamily: 'inherit',
          border: '1px solid var(--border-2)', borderRadius: 'var(--r-input)',
          background: 'var(--bg-surface-2)', color: 'var(--fg-1)', outline: 'none',
        }}
      />
      <button
        type="submit"
        disabled={isPending || !vehicleId.trim()}
        style={{
          padding: '6px 14px', fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
          background: 'var(--brand)', color: 'white', border: 0,
          borderRadius: 'var(--r-input)', cursor: isPending ? 'not-allowed' : 'pointer',
          opacity: isPending ? 0.7 : 1,
        }}
      >
        {isPending ? 'Asignando…' : 'Asignar'}
      </button>
      <button
        type="button"
        onClick={onDone}
        style={{
          padding: '6px 10px', fontSize: 13, fontFamily: 'inherit',
          background: 'transparent', color: 'var(--fg-2)', border: '1px solid var(--border-2)',
          borderRadius: 'var(--r-input)', cursor: 'pointer',
        }}
      >
        Cancelar
      </button>
    </form>
  )
}

function RouteCard({ route }: { route: Route }) {
  const [showAssign, setShowAssign] = useState(false)
  const navigate = useNavigate()
  const colors = STATUS_COLORS[route.status]

  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
      borderRadius: 'var(--r-card)', padding: '16px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>

        {/* Icon */}
        <div style={{
          width: 36, height: 36, borderRadius: 8, background: 'var(--bg-surface-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <MapPin size={18} strokeWidth={1.5} color="var(--fg-2)" />
        </div>

        {/* Main info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>Ruta #{route.id}</span>

            {/* Status badge */}
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
              background: colors.bg, color: colors.fg, letterSpacing: '0.03em',
            }}>
              {STATUS_LABEL[route.status]}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 20, marginTop: 8, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Truck size={13} strokeWidth={1.5} color="var(--fg-3)" />
              <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>
                {route.vehicleId ? `Vehículo #${route.vehicleId}` : '—'}
              </span>
            </div>
            <span style={{ fontSize: 13, color: 'var(--fg-3)' }}>
              Despacho: {route.dispatchDate}
            </span>
            <span style={{ fontSize: 13, color: 'var(--fg-3)' }}>
              {route.accumulatedKg.toLocaleString()} / {route.totalKg.toLocaleString()} kg
            </span>
          </div>

          {/* Occupancy bar */}
          <div style={{ marginTop: 10 }}>
            <OccupancyBar pct={route.occupancyPct} />
          </div>

          {/* Actions row */}
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {route.vehicleId && (
              <button
                onClick={() => navigate(`/driver/stops?routeId=${route.id}&carrierId=${route.vehicleId}`)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
                  background: 'var(--bg-surface-2)', color: 'var(--fg-1)',
                  border: '1px solid var(--border-2)', borderRadius: 'var(--r-input)', cursor: 'pointer',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--border-2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-surface-2)')}
              >
                <List size={14} strokeWidth={1.5} />
                Ver paradas
              </button>
            )}

            {/* Assign vehicle */}
            {route.status === 'PENDING_VEHICLE' && !showAssign && (
              <button
                onClick={() => setShowAssign(true)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', fontSize: 13, fontWeight: 500,
                  fontFamily: 'inherit', background: 'var(--brand)', color: 'white',
                  border: 0, borderRadius: 'var(--r-input)', cursor: 'pointer',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--brand-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--brand)')}
              >
                Asignar vehículo
              </button>
            )}
          </div>

          {showAssign && (
            <AssignForm routeId={route.id} onDone={() => setShowAssign(false)} />
          )}
        </div>
      </div>
    </div>
  )
}

export default function RoutesPage() {
  const { data: routes = [], isLoading, isError } = useRoutes()
  const [filter, setFilter] = useState<StatusFilter>('ALL')
  const [query, setQuery] = useState('')

  const filtered = routes.filter(r => {
    if (filter !== 'ALL' && r.status !== filter) return false
    if (query) {
      const q = query.toLowerCase()
      return String(r.id).includes(q) || String(r.vehicleId).includes(q)
    }
    return true
  })

  const counts = {
    available: routes.filter(r => r.status === 'AVAILABLE').length,
    pending:   routes.filter(r => r.status === 'PENDING_VEHICLE').length,
    closed:    routes.filter(r => r.status === 'CLOSED').length,
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
            <MapPin size={15} strokeWidth={1.5} color="white" />
          </div>
          <h1 style={{ fontSize: 16, fontWeight: 600 }}>Rutas</h1>
          <span style={{ fontSize: 13, color: 'var(--fg-2)', fontVariantNumeric: 'tabular-nums' }}>
            {routes.length} en total
          </span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Search */}
        <div style={{ position: 'relative', width: 220 }}>
          <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <Search size={14} strokeWidth={1.5} color="var(--fg-3)" />
          </div>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por ID o vehículo…"
            style={{
              width: '100%', padding: '7px 12px 7px 32px', fontSize: 13, fontFamily: 'inherit',
              border: '1px solid var(--border-2)', borderRadius: 'var(--r-input)',
              background: 'var(--bg-surface-2)', color: 'var(--fg-1)', outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Status filter */}
        <select value={filter} onChange={e => setFilter(e.target.value as StatusFilter)} style={SELECT_STYLE}>
          <option value="ALL">Todos los estados</option>
          <option value="AVAILABLE">Disponible</option>
          <option value="PENDING_VEHICLE">Sin vehículo</option>
          <option value="CLOSED">Cerrada</option>
        </select>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>

        {isLoading && (
          <div style={{ color: 'var(--fg-3)', fontSize: 14, textAlign: 'center', paddingTop: 48 }}>
            Cargando rutas…
          </div>
        )}

        {isError && (
          <div style={{ color: 'var(--danger-fg)', fontSize: 14, textAlign: 'center', paddingTop: 48 }}>
            Error al cargar las rutas. Verifica la conexión con el servidor.
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {/* Stat strip */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
              {[
                { label: 'Disponibles',   value: counts.available, color: 'var(--success-fg)' },
                { label: 'Sin vehículo',  value: counts.pending,   color: 'var(--warning-fg)' },
                { label: 'Cerradas',      value: counts.closed,    color: 'var(--fg-3)'       },
              ].map(s => (
                <div key={s.label} style={{
                  padding: '10px 16px', borderRadius: 'var(--r-card)',
                  background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
                  minWidth: 120,
                }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontVariantNumeric: 'tabular-nums' }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Cards */}
            {filtered.length === 0 ? (
              <div style={{ color: 'var(--fg-3)', fontSize: 14, textAlign: 'center', paddingTop: 48 }}>
                No hay rutas que coincidan con el filtro.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map(r => <RouteCard key={r.id} route={r} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
