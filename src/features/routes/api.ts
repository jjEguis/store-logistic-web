import api from '@/lib/axios'
import type { Route } from '@/types/domain'

export const routesApi = {
  list: () =>
    api.get<Route[]>('/logistics/routes').then(r => r.data),

  get: (routeId: number) =>
    api.get<Route>(`/logistics/routes/${routeId}`).then(r => r.data),

  assignVehicle: (routeId: number, vehicleId: string) =>
    api
      .patch<Route>(`/logistics/routes/${routeId}/vehicle`, { vehicleId })
      .then(r => r.data),
}
