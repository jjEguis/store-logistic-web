// ── Vehicle / Fleet ───────────────────────────────────────────

export type VehicleCategory =
  | 'CAMIONETA_URBANA'
  | 'CAMION_SENCILLO'
  | 'TRACTOCAMION_REGIONAL'

// FUERA_DE_SERVICIO — with _DE_ as the backend enum defines it
export type VehicleState =
  | 'DISPONIBLE'
  | 'EN_RUTA'
  | 'EN_MANTENIMIENTO'
  | 'FUERA_DE_SERVICIO'

export interface Vehicle {
  idVehiculo: number
  idCategoria: number
  categoria: VehicleCategory
  capacidadCarga: number       // kg
  estado: VehicleState
  idTransportista: number | null
  createdAt?: string
}

export interface CreateVehiclePayload {
  categoria: VehicleCategory
  capacidadCarga: number
}

// ── Route / Stops ─────────────────────────────────────────────

export type StopStatus = 'PENDING' | 'DELIVERED' | 'REJECTED'

export type PaymentMethod = 'CONTRA_ENTREGA' | 'CARTERA_COMERCIAL'

export type RouteStatus = 'AVAILABLE' | 'CLOSED' | 'PENDING_VEHICLE'

export interface StopSummary {
  idStop: number
  sequence: number
  deliveryAddress: string
  orderId: number
  status: StopStatus
}

export interface StopDetail extends StopSummary {
  customerContact: string
  paymentMethod: PaymentMethod
  totalACobrar: number | null   // null means CARTERA_COMERCIAL — never show as $0
}

export interface RouteStopsResponse {
  routeId: number
  carrierId: number
  totalStops: number
  stops: StopSummary[]
}

export interface Route {
  id: number
  vehicleId: number
  status: RouteStatus
  dispatchDate: string
  occupancyPct: number   // 0–100
  accumulatedKg: number
  totalKg: number
}

// ── Orders / Final delivery state ─────────────────────────────

// Display names matching backend FinalStatus.displayName() exactly
export type FinalDeliveryCode =
  | 'Entregado Completo'
  | 'Rechazo Parcial'
  | 'No Entregado'
  | 'Devolución (Error Empresa)'
  | 'Faltante de Inventario'

// PUT /logistics/orders/{idPedido}/status
export interface UpdateStopStatePayload {
  idTransportista: number
  estadoFinal: FinalDeliveryCode
}

export interface UpdateOrderStatusResponse {
  idPedido: number
  estadoFinal: FinalDeliveryCode
  tasaEfectividad: number
  idTransportista: number
  fechaActualizacion: string
}

// ── Stop status update ────────────────────────────────────────

export interface UpdateStopStatusPayload {
  resultado: 'DELIVERED' | 'REJECTED'
  fechaEntrega?: string   // ISO date 'YYYY-MM-DD', required for DELIVERED
}

export interface UpdateStopStatusResult {
  stopId: number
  orderId: number
  sequence: number
  deliveryAddress: string
  status: StopStatus
  fechaEntrega: string | null
}

// GET /logistics/orders/carrier/{carrierId}/history
export interface OrderHistoryItem {
  idPedido: number
  estadoFinal: FinalDeliveryCode
  tasaEfectividad: number
  idTransportista: number
  fechaActualizacion: string
}

// ── API error shape ───────────────────────────────────────────

export interface ApiError {
  codigo: string
  mensaje: string
  timestamp: string
}
