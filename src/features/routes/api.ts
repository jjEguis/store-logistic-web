import api from '@/lib/axios'
import type { Route } from '@/types/domain'

// Backend response shape
interface RouteDTO {
  routeId: number
  vehicleId: number
  routeStatus: string
  dispatchDate: string
}

function mapRoute(dto: RouteDTO): Route {
  return {
    id:           dto.routeId,
    vehicleId:    dto.vehicleId,
    status:       dto.routeStatus as Route['status'],
    dispatchDate: dto.dispatchDate,
  }
}

export const routesApi = {
  // GET /logistics/routes
  list: () =>
    api.get<RouteDTO[]>('/logistics/routes').then(r => r.data.map(mapRoute)),

  // GET /logistics/routes/{routeId}
  get: (routeId: number) =>
    api.get<RouteDTO>(`/logistics/routes/${routeId}`).then(r => mapRoute(r.data)),

  assignVehicle: (routeId: number, vehicleId: string) =>
    api
      .patch<RouteDTO>(`/logistics/routes/${routeId}/vehicle`, { vehicleId })
      .then(r => mapRoute(r.data)),
}
