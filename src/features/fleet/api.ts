import api from '@/lib/axios'
import type { Vehicle, VehicleState, CreateVehiclePayload } from '@/types/domain'

export const fleetApi = {
  list: () =>
    api.get<Vehicle[]>('/logistics/vehicles').then(r => r.data),

  get: (id: number) =>
    api.get<Vehicle>(`/logistics/vehicles/${id}`).then(r => r.data),

  create: (payload: CreateVehiclePayload) =>
    api.post<Vehicle>('/logistics/vehicles', payload).then(r => r.data),

  // PATCH /logistics/vehicles/{id}/estado  (Spanish path — matches backend)
  updateState: (id: number, estado: VehicleState) =>
    api.patch<Vehicle>(`/logistics/vehicles/${id}/estado`, { estado }).then(r => r.data),
}
