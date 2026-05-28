import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronLeft, MapPin, ArrowRight, Check, X, AlertTriangle } from 'lucide-react'
import { useStops, useStopDetail, useUpdateStopStatus } from '@/features/stops/hooks/useStops'
import { useUpdateOrderStatus } from '@/features/orders/hooks/useOrders'
import type { StopSummary, FinalDeliveryCode } from '@/types/domain'

// ── Final-state definitions (design → backend mapping) ────────
type DesignCode =
  | 'DELIVERED_FULL'
  | 'PARTIAL_REJECT'
  | 'NOT_DELIVERED'
  | 'COMPANY_ERROR'
  | 'INVENTORY_MISSING'

const FINAL_STATES: Array<{
  code: DesignCode
  label: string
  tone: 'success' | 'warning' | 'danger'
  desc: string
  stopResult: 'DELIVERED' | 'REJECTED'
  orderCode: FinalDeliveryCode
}> = [
  {
    code: 'DELIVERED_FULL', label: 'Entregado completo', tone: 'success',
    desc: 'El cliente recibió todos los productos en buen estado.',
    stopResult: 'DELIVERED', orderCode: 'Entregado Completo',
  },
  {
    code: 'PARTIAL_REJECT', label: 'Rechazo parcial', tone: 'warning',
    desc: 'El cliente recibió solo parte del pedido.',
    stopResult: 'REJECTED', orderCode: 'Rechazo Parcial',
  },
  {
    code: 'NOT_DELIVERED', label: 'No entregado', tone: 'danger',
    desc: 'El cliente no estaba o rechazó toda la entrega.',
    stopResult: 'REJECTED', orderCode: 'No Entregado',
  },
  {
    code: 'COMPANY_ERROR', label: 'Devolución por error', tone: 'danger',
    desc: 'Error de la empresa: producto incorrecto o dañado.',
    stopResult: 'REJECTED', orderCode: 'Devolución (Error Empresa)',
  },
  {
    code: 'INVENTORY_MISSING', label: 'Faltante de inventario', tone: 'warning',
    desc: 'El producto no salió del almacén.',
    stopResult: 'REJECTED', orderCode: 'Faltante de Inventario',
  },
]

const TONES = {
  success: { bg: '#DCEFE2', fg: '#145C33', border: '#1F8A4C' },
  warning: { bg: '#FBE3D2', fg: '#7C2A07', border: '#C2410C' },
  danger:  { bg: '#FAD9D6', fg: '#771810', border: '#B42318' },
}

function ToneIcon({ tone }: { tone: 'success' | 'warning' | 'danger' }) {
  if (tone === 'success') return <Check size={18} />
  if (tone === 'warning') return <AlertTriangle size={18} />
  return <X size={18} />
}

// ── DriverHeader ──────────────────────────────────────────────
function DriverHeader({
  title, subtitle, onBack, right,
}: {
  title: string
  subtitle?: string
  onBack?: () => void
  right?: React.ReactNode
}) {
  return (
    <div style={{
      paddingTop: 12, paddingLeft: 16, paddingRight: 16, paddingBottom: 12,
      display: 'flex', alignItems: 'center', gap: 12,
      background: '#FFFFFF', borderBottom: '1px solid #E4E4DE', flexShrink: 0,
    }}>
      {onBack && (
        <button onClick={onBack} style={{
          background: 'transparent', border: 0, padding: 4, cursor: 'pointer',
          color: '#0E0F0C', display: 'flex', alignItems: 'center',
        }}>
          <ChevronLeft size={22} />
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 17, fontWeight: 600, color: '#0E0F0C', lineHeight: 1.2 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: '#5C5F58', marginTop: 2 }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  )
}

// ── RouteSummaryCard ──────────────────────────────────────────
function RouteSummaryCard({ routeId, stops }: { routeId: number; stops: StopSummary[] }) {
  const done = stops.filter(s => s.status !== 'PENDING').length
  const pct  = stops.length > 0 ? Math.round((done / stops.length) * 100) : 0

  return (
    <div style={{
      margin: '12px 16px 4px',
      background: 'linear-gradient(180deg, #1F211D 0%, #2A2C27 100%)',
      borderRadius: 14, padding: 16, color: '#F2F1EC',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 11, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 500 }}>
            Ruta de hoy
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 600, marginTop: 2 }}>
            R-{routeId}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, opacity: 0.85 }}>
            {done === stops.length && stops.length > 0 ? 'Completada ✓' : 'En curso'}
          </div>
        </div>
      </div>

      <div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginBottom: 6,
          fontSize: 12, fontVariantNumeric: 'tabular-nums',
        }}>
          <span style={{ opacity: 0.85 }}>{done} de {stops.length} paradas</span>
          <span style={{ opacity: 0.85 }}>{pct}%</span>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
          <div style={{
            width: `${pct}%`, height: '100%', background: '#D9531E', borderRadius: 999,
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>
    </div>
  )
}

// ── StopCard ──────────────────────────────────────────────────
function StopCard({
  stop, isNext, onClick,
}: {
  stop: StopSummary
  isNext: boolean
  onClick: () => void
}) {
  const done = stop.status !== 'PENDING'

  return (
    <button onClick={onClick} style={{
      display: 'block', width: '100%', textAlign: 'left',
      background: '#FFFFFF',
      border: isNext ? '2px solid #D9531E' : '1px solid #E4E4DE',
      borderRadius: 12, padding: 0, marginBottom: 12, cursor: 'pointer',
      fontFamily: 'inherit', overflow: 'hidden',
      boxShadow: isNext ? '0 6px 14px rgba(217,83,30,0.15)' : '0 1px 2px rgba(0,0,0,0.04)',
      opacity: done ? 0.65 : 1,
    }}>
      <div style={{ padding: '14px 14px 10px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: done ? '#DCEFE2' : isNext ? '#D9531E' : '#F2F2F0',
          color: done ? '#1F8A4C' : isNext ? '#FFFFFF' : '#0E0F0C',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 16,
        }}>
          {done ? <Check size={20} /> : stop.sequence}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {isNext && (
            <div style={{
              fontSize: 10, fontWeight: 700, color: '#D9531E',
              textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2,
            }}>
              Próxima parada
            </div>
          )}
          <div style={{
            fontSize: 15, fontWeight: 600, color: '#0E0F0C',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            Pedido #{stop.orderId}
          </div>
          <div style={{
            fontSize: 13, color: '#5C5F58', marginTop: 2,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {stop.deliveryAddress}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, paddingTop: 2 }}>
          {done
            ? <span style={{
                fontSize: 12, fontWeight: 600,
                color: stop.status === 'DELIVERED' ? '#1F8A4C' : '#B42318',
              }}>
                {stop.status === 'DELIVERED' ? 'Entregado' : 'Rechazado'}
              </span>
            : <ArrowRight size={16} color="#9A9D94" />
          }
        </div>
      </div>

      <div style={{
        padding: '8px 14px', borderTop: '1px solid #ECECE6',
        background: '#FBFBF8', display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <MapPin size={12} color="#9A9D94" />
        <span style={{
          fontSize: 12, color: '#9A9D94',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {stop.deliveryAddress}
        </span>
      </div>
    </button>
  )
}

// ── FinalStateSheet ───────────────────────────────────────────
function FinalStateSheet({
  orderId, onClose, onSubmit,
}: {
  orderId: number
  onClose: () => void
  onSubmit: (code: DesignCode) => void
}) {
  const [pick, setPick] = useState<DesignCode | null>(null)

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(14,15,12,0.45)',
        display: 'flex', alignItems: 'flex-end', zIndex: 70,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', background: '#FFFFFF',
          borderTopLeftRadius: 20, borderTopRightRadius: 20,
          paddingBottom: 40, maxWidth: 430, margin: '0 auto',
        }}
      >
        {/* drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: '#D4D4CD' }} />
        </div>

        <div style={{ padding: '8px 20px 16px' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#0E0F0C' }}>
            Estado final del pedido
          </div>
          <div style={{ fontSize: 13, color: '#5C5F58', marginTop: 4 }}>
            Pedido #{orderId}
          </div>
        </div>

        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FINAL_STATES.map(opt => {
            const sel = pick === opt.code
            const t   = TONES[opt.tone]
            return (
              <button
                key={opt.code}
                onClick={() => setPick(opt.code)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '14px 14px', cursor: 'pointer', textAlign: 'left',
                  background: sel ? t.bg : '#FBFBF8',
                  border: sel ? `2px solid ${t.border}` : '2px solid transparent',
                  borderRadius: 12, fontFamily: 'inherit',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: sel ? t.border : '#FFFFFF',
                  color: sel ? '#fff' : t.fg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: sel ? '0' : `1px solid ${t.border}`,
                }}>
                  <ToneIcon tone={opt.tone} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#0E0F0C' }}>{opt.label}</div>
                  <div style={{ fontSize: 12, color: '#5C5F58', marginTop: 2 }}>{opt.desc}</div>
                </div>
                <div style={{
                  width: 22, height: 22, borderRadius: 999, marginTop: 6, flexShrink: 0,
                  border: sel ? `7px solid ${t.border}` : '2px solid #D4D4CD',
                }} />
              </button>
            )
          })}
        </div>

        <div style={{ padding: 16, marginTop: 8 }}>
          <button
            disabled={!pick}
            onClick={() => pick && onSubmit(pick)}
            style={{
              width: '100%', padding: '15px', border: 0, borderRadius: 12,
              cursor: pick ? 'pointer' : 'not-allowed',
              background: pick ? '#0E0F0C' : '#D4D4CD',
              color: '#fff', fontSize: 16, fontWeight: 600, fontFamily: 'inherit',
              opacity: pick ? 1 : 0.7,
            }}
          >
            Confirmar entrega
          </button>
        </div>
      </div>
    </div>
  )
}

// ── StopDetailScreen ──────────────────────────────────────────
function StopDetailScreen({
  routeId, stopId, carrierId, onBack, onConfirm, isSubmitting,
}: {
  routeId: number
  stopId: number
  carrierId: number
  onBack: () => void
  onConfirm: (code: DesignCode) => void
  isSubmitting: boolean
}) {
  const [picking, setPicking] = useState(false)
  const { data: stop, isLoading } = useStopDetail(routeId, stopId, carrierId)

  const PAYMENT_LABEL = {
    CONTRA_ENTREGA:    'Contra entrega',
    CARTERA_COMERCIAL: 'Cartera comercial',
  } as const

  const PAYMENT_HINT = {
    CONTRA_ENTREGA:    'Cobrar al cliente al momento de la entrega.',
    CARTERA_COMERCIAL: 'No cobrar — el cliente paga por crédito comercial.',
  } as const

  const fmtCOP = (n: number | null) =>
    n == null ? '—' : `$${n.toLocaleString('es-CO')}`

  if (isLoading || !stop) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#F7F7F4', zIndex: 50, display: 'flex', flexDirection: 'column' }}>
        <DriverHeader title="Cargando..." onBack={onBack} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9A9D94' }}>
          Cargando parada...
        </div>
      </div>
    )
  }

  const done = stop.status !== 'PENDING'
  const statusBadge = done
    ? { bg: '#DCEFE2', fg: '#145C33', label: stop.status === 'DELIVERED' ? 'Entregado' : 'Rechazado' }
    : { bg: '#FBE3D2', fg: '#7C2A07', label: 'Pendiente' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#F7F7F4', zIndex: 50, display: 'flex', flexDirection: 'column' }}>
      <DriverHeader
        title={`Parada ${stop.sequence}`}
        subtitle={`Pedido #${stop.orderId}`}
        onBack={onBack}
        right={
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600,
            background: statusBadge.bg, color: statusBadge.fg,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'currentColor' }} />
            {statusBadge.label}
          </span>
        }
      />

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: done ? 16 : 100 }}>
        {/* hero — address */}
        <div style={{ padding: 16, background: '#FFFFFF', borderBottom: '1px solid #E4E4DE' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#0E0F0C', letterSpacing: -0.4, lineHeight: 1.2 }}>
            Pedido #{stop.orderId}
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <MapPin size={16} color="#5C5F58" style={{ marginTop: 1, flexShrink: 0 }} />
            <div style={{ fontSize: 14, color: '#0E0F0C' }}>{stop.deliveryAddress}</div>
          </div>
        </div>

        {/* payment card */}
        <div style={{
          margin: '0 16px 16px', background: '#FFFFFF',
          borderRadius: 12, border: '1px solid #E4E4DE', overflow: 'hidden',
        }}>
          <div style={{
            padding: 14, display: 'flex',
            alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: '#9A9D94', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 500 }}>
                Forma de pago
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>
                {PAYMENT_LABEL[stop.paymentMethod]}
              </div>
              <div style={{ fontSize: 12, color: '#5C5F58', marginTop: 4 }}>
                {PAYMENT_HINT[stop.paymentMethod]}
              </div>
            </div>
            {stop.paymentMethod === 'CONTRA_ENTREGA' ? (
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 11, color: '#9A9D94' }}>A cobrar</div>
                <div style={{
                  fontSize: 18, fontWeight: 700, color: '#8C3210',
                  fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums',
                }}>
                  {fmtCOP(stop.totalACobrar)}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 11, color: '#9A9D94' }}>A cobrar</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1F8A4C' }}>No cobrar</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* sticky CTA */}
      {!done && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '12px 16px 28px',
          background: 'linear-gradient(180deg, rgba(247,247,244,0) 0%, #F7F7F4 28%)',
        }}>
          <button
            onClick={() => setPicking(true)}
            disabled={isSubmitting}
            style={{
              width: '100%', padding: '16px', border: 0, borderRadius: 14, cursor: 'pointer',
              background: isSubmitting ? '#9A9D94' : '#D9531E',
              color: '#fff', fontSize: 16, fontWeight: 600, fontFamily: 'inherit',
              boxShadow: '0 8px 20px rgba(217,83,30,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {isSubmitting ? 'Registrando...' : <>Registrar entrega <ArrowRight size={18} /></>}
          </button>
        </div>
      )}

      {picking && (
        <FinalStateSheet
          orderId={stop.orderId}
          onClose={() => setPicking(false)}
          onSubmit={code => { setPicking(false); onConfirm(code) }}
        />
      )}
    </div>
  )
}

// ── Main StopsPage ────────────────────────────────────────────
export default function StopsPage() {
  const [searchParams] = useSearchParams()
  const routeId   = Number(searchParams.get('routeId')   ?? '0')
  const carrierId = Number(searchParams.get('carrierId') ?? '0')

  const [activeStopId, setActiveStopId] = useState<number | null>(null)

  const { data, isLoading, error } = useStops(routeId, carrierId)
  const updateStop  = useUpdateStopStatus(routeId, carrierId)
  const updateOrder = useUpdateOrderStatus(routeId, carrierId)

  const stops    = data?.stops ?? []
  const pending  = stops.filter(s => s.status === 'PENDING').sort((a, b) => a.sequence - b.sequence)
  const completed = stops.filter(s => s.status !== 'PENDING').sort((a, b) => a.sequence - b.sequence)
  const nextStopId = pending[0]?.idStop

  const handleConfirm = async (stopId: number, orderId: number, code: DesignCode) => {
    const state = FINAL_STATES.find(s => s.code === code)!
    const today = new Date().toISOString().split('T')[0]
    try {
      await updateStop.mutateAsync({
        stopId,
        payload: {
          resultado: state.stopResult,
          ...(state.stopResult === 'DELIVERED' ? { fechaEntrega: today } : {}),
        },
      })
      await updateOrder.mutateAsync({
        idPedido: orderId,
        payload: { idTransportista: carrierId, estadoFinal: state.orderCode },
      })
      setActiveStopId(null)
    } catch {
      // errors surface via updateStop.error / updateOrder.error
    }
  }

  const isSubmitting = updateStop.isPending || updateOrder.isPending

  if (!routeId || !carrierId) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#0E0F0C', marginBottom: 8 }}>
          Parámetros faltantes
        </div>
        <div style={{ fontSize: 14, color: '#5C5F58' }}>
          Accede con la URL: <code>/driver/stops?routeId=X&carrierId=Y</code>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F7F7F4' }}>
      <DriverHeader title="Mis paradas" subtitle={`Ruta R-${routeId}`} />

      {isLoading && (
        <div style={{ padding: 32, textAlign: 'center', color: '#9A9D94', fontSize: 14 }}>
          Cargando paradas...
        </div>
      )}

      {error && (
        <div style={{ margin: 16, padding: 14, background: '#FAD9D6', borderRadius: 10, color: '#771810', fontSize: 14 }}>
          {(error as any)?.response?.data?.mensaje ?? 'Error al cargar las paradas. Verifica la conexión.'}
        </div>
      )}

      {data && (
        <>
          <RouteSummaryCard routeId={routeId} stops={stops} />

          <div style={{ padding: '16px 16px 32px', flex: 1 }}>
            {pending.length > 0 && (
              <>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: '#5C5F58',
                  textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12,
                }}>
                  Pendientes ({pending.length})
                </div>
                {pending.map(stop => (
                  <StopCard
                    key={stop.idStop}
                    stop={stop}
                    isNext={stop.idStop === nextStopId}
                    onClick={() => setActiveStopId(stop.idStop)}
                  />
                ))}
              </>
            )}

            {completed.length > 0 && (
              <>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: '#5C5F58',
                  textTransform: 'uppercase', letterSpacing: 0.8,
                  marginBottom: 12, marginTop: pending.length > 0 ? 8 : 0,
                }}>
                  Completadas ({completed.length})
                </div>
                {completed.map(stop => (
                  <StopCard
                    key={stop.idStop}
                    stop={stop}
                    isNext={false}
                    onClick={() => setActiveStopId(stop.idStop)}
                  />
                ))}
              </>
            )}

            {stops.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#9A9D94', fontSize: 14 }}>
                No hay paradas en esta ruta.
              </div>
            )}
          </div>
        </>
      )}

      {activeStopId !== null && (
        <StopDetailScreen
          routeId={routeId}
          stopId={activeStopId}
          carrierId={carrierId}
          isSubmitting={isSubmitting}
          onBack={() => setActiveStopId(null)}
          onConfirm={code => {
            const stop = stops.find(s => s.idStop === activeStopId)
            if (stop) handleConfirm(activeStopId, stop.orderId, code)
          }}
        />
      )}
    </div>
  )
}