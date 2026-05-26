import api from '@/lib/axios'
import type { Route } from '@/types/domain'

// Backend response shape
interface RouteDTO {
  routeId: number
  vehicleId: number
  routeStatus: string
  dispatchDate: string
  occupancyPercentage: number
  accumulatedWeightKg: number
  totalCapacityKg: number
}

function mapRoute(dto: RouteDTO): Route {
  return {
    id:            dto.routeId,
    vehicleId:     dto.vehicleId,
    status:        dto.routeStatus as Route['status'],
    dispatchDate:  dto.dispatchDate,
    occupancyPct:  dto.occupancyPercentage ?? 0,
    accumulatedKg: dto.accumulatedWeightKg ?? 0,
    totalKg:       dto.totalCapacityKg ?? 0,
  }
}

export const routesApi = {
  // GET /logistics/routes
  list: () =>
    api.get<RouteDTO[]>('/logistics/routes').then(r => r.data.map(mapRoute)),

  // GET /logistics/routes/{routeId}
  get: (routeId: number) =>
    api.get<RouteDTO>(`/logistics/routes/${routeId}`).then(r => mapRoute(r.data)),

}
