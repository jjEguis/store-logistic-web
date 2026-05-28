import api from '@/lib/axios'
import type { Vehicle, VehicleState, CreateVehiclePayload } from '@/types/domain'

// ── Backend DTO shapes ────────────────────────────────────────
interface VehicleDTO {
  vehicleId: number
  transporterId: number | null
  category: string
  loadCapacity: number
  status: string
  createdAt: string
}

interface ListVehiclesResponse {
  total: number
  data: VehicleDTO[]
}

function mapVehicle(dto: VehicleDTO): Vehicle {
  return {
    idVehiculo:        dto.vehicleId,
    idCategoria:       0,
    categoria:         dto.category as Vehicle['categoria'],
    capacidadCarga:    dto.loadCapacity,
    estado:            dto.status as Vehicle['estado'],
    idTransportista:   dto.transporterId,
    createdAt:         dto.createdAt,
  }
}

// ── API calls ─────────────────────────────────────────────────
export const fleetApi = {
  // GET /vehicles
  list: () =>
    api.get<ListVehiclesResponse>('/vehicles').then(r => r.data.data.map(mapVehicle)),

  // GET /vehicles/{id}
  get: (id: number) =>
    api.get<VehicleDTO>(`/vehicles/${id}`).then(r => mapVehicle(r.data)),

  // POST /vehicles
  create: (payload: CreateVehiclePayload) =>
    api.post<VehicleDTO>('/vehicles', {
      category:      payload.categoria,
      loadCapacity:  payload.capacidadCarga,
    }).then(r => mapVehicle(r.data)),

  // PATCH /vehicles/{id}/status
  updateState: (id: number, estado: VehicleState) =>
    api.patch<VehicleDTO>(`/vehicles/${id}/status`, { newStatus: estado }).then(r => mapVehicle(r.data)),
}
