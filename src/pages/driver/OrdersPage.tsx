import { useSearchParams } from 'react-router-dom'
import { Check, X, AlertTriangle, ClipboardList } from 'lucide-react'
import { useOrderHistory } from '@/features/orders/hooks/useOrders'
import type { FinalDeliveryCode, OrderHistoryItem } from '@/types/domain'

// ── Tone map ─────────────────────────────────────────────────
type Tone = 'success' | 'warning' | 'danger'

const STATUS_TONE: Record<FinalDeliveryCode, Tone> = {
  'Entregado Completo':      'success',
  'Rechazo Parcial':         'warning',
  'No Entregado':            'danger',
  'Devolución (Error Empresa)': 'danger',
  'Faltante de Inventario':  'warning',
}

const TONES = {
  success: { bg: '#DCEFE2', fg: '#145C33', border: '#1F8A4C' },
  warning: { bg: '#FBE3D2', fg: '#7C2A07', border: '#C2410C' },
  danger:  { bg: '#FAD9D6', fg: '#771810', border: '#B42318' },
}

function ToneIcon({ tone }: { tone: Tone }) {
  if (tone === 'success') return <Check size={16} />
  if (tone === 'warning') return <AlertTriangle size={16} />
  return <X size={16} />
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ── HistoryCard ───────────────────────────────────────────────
function HistoryCard({ item }: { item: OrderHistoryItem }) {
  const tone = STATUS_TONE[item.estadoFinal] ?? 'warning'
  const t = TONES[tone]

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E4E4DE',
      borderRadius: 12,
      padding: '14px',
      marginBottom: 10,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        background: t.bg, color: t.fg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <ToneIcon tone={tone} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#0E0F0C' }}>
          Pedido #{item.idPedido}
        </div>
        <div style={{
          fontSize: 13, marginTop: 2,
          color: t.fg, fontWeight: 500,
        }}>
          {item.estadoFinal}
        </div>
        <div style={{ fontSize: 12, color: '#9A9D94', marginTop: 2 }}>
          {item.fechaActualizacion ? fmtDate(item.fechaActualizacion) : '—'}
        </div>
      </div>

      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 11, color: '#9A9D94' }}>Efectividad</div>
        <div style={{
          fontSize: 18, fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          color: tone === 'success' ? '#1F8A4C' : tone === 'warning' ? '#7C2A07' : '#771810',
        }}>
          {item.tasaEfectividad}%
        </div>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────
export default function OrdersPage() {
  const [searchParams] = useSearchParams()
  const carrierId = Number(searchParams.get('carrierId') ?? '0')

  const { data, isLoading, error } = useOrderHistory(carrierId)

  const avgRate = data && data.length > 0
    ? Math.round(data.reduce((sum, o) => sum + o.tasaEfectividad, 0) / data.length)
    : null

  if (!carrierId) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#0E0F0C', marginBottom: 8 }}>
          Parámetro faltante
        </div>
        <div style={{ fontSize: 14, color: '#5C5F58' }}>
          Accede con: <code>/driver/orders?carrierId=Y</code>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F7F7F4' }}>
      {/* Header */}
      <div style={{
        paddingTop: 12, paddingLeft: 16, paddingRight: 16, paddingBottom: 12,
        background: '#FFFFFF', borderBottom: '1px solid #E4E4DE', flexShrink: 0,
      }}>
        <div style={{ fontSize: 17, fontWeight: 600, color: '#0E0F0C' }}>Historial de entregas</div>
        <div style={{ fontSize: 12, color: '#5C5F58', marginTop: 2 }}>Transportista #{carrierId}</div>
      </div>

      {/* Summary strip */}
      {data && data.length > 0 && (
        <div style={{
          margin: '12px 16px 4px',
          background: 'linear-gradient(180deg, #1F211D 0%, #2A2C27 100%)',
          borderRadius: 14, padding: 16, color: '#F2F1EC',
          display: 'flex', justifyContent: 'space-around',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {data.length}
            </div>
            <div style={{ fontSize: 11, opacity: 0.65, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Pedidos
            </div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.12)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {data.filter(o => o.estadoFinal === 'Entregado Completo').length}
            </div>
            <div style={{ fontSize: 11, opacity: 0.65, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Entregados
            </div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.12)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#D9531E' }}>
              {avgRate}%
            </div>
            <div style={{ fontSize: 11, opacity: 0.65, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Efectividad
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '16px 16px 32px', flex: 1 }}>
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#9A9D94', fontSize: 14 }}>
            Cargando historial...
          </div>
        )}

        {error && (
          <div style={{ padding: 14, background: '#FAD9D6', borderRadius: 10, color: '#771810', fontSize: 14 }}>
            Error al cargar el historial. Verifica que el ID del transportista sea correcto.
          </div>
        )}

        {data && data.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#9A9D94' }}>
            <ClipboardList size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }} />
            <div style={{ fontSize: 15, fontWeight: 500 }}>Sin entregas registradas</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Las entregas completadas aparecerán aquí.</div>
          </div>
        )}

        {data && data.length > 0 && (
          <>
            <div style={{
              fontSize: 11, fontWeight: 700, color: '#5C5F58',
              textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12,
            }}>
              Entregas ({data.length})
            </div>
            {[...data]
              .sort((a, b) => new Date(b.fechaActualizacion).getTime() - new Date(a.fechaActualizacion).getTime())
              .map(item => (
                <HistoryCard key={item.idPedido} item={item} />
              ))
            }
          </>
        )}
      </div>
    </div>
  )
}
