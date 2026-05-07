import api from '@/lib/axios'
import type { RouteStopsResponse, StopDetail, UpdateStopStatusPayload, UpdateStopStatusResult } from '@/types/domain'

export const stopsApi = {
  list: (routeId: number, carrierId: number) =>
    api
      .get<RouteStopsResponse>(`/logistics/routes/${routeId}/stops`, {
        params: { carrierId },
      })
      .then(r => r.data),

  get: (routeId: number, stopId: number, carrierId: number) =>
    api
      .get<StopDetail>(`/logistics/routes/${routeId}/stops/${stopId}`, {
        params: { carrierId },
      })
      .then(r => r.data),

  updateStatus: (routeId: number, stopId: number, carrierId: number, payload: UpdateStopStatusPayload) =>
    api
      .patch<UpdateStopStatusResult>(`/logistics/routes/${routeId}/stops/${stopId}`, payload, {
        params: { carrierId },
      })
      .then(r => r.data),
}
