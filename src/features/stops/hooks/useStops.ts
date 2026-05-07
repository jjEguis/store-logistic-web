import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { stopsApi } from '../api'
import type { UpdateStopStatusPayload } from '@/types/domain'

export function useStops(routeId: number, carrierId: number) {
  return useQuery({
    queryKey: ['stops', routeId, carrierId],
    queryFn: () => stopsApi.list(routeId, carrierId),
    enabled: routeId > 0 && carrierId > 0,
  })
}

export function useStopDetail(routeId: number, stopId: number, carrierId: number) {
  return useQuery({
    queryKey: ['stops', routeId, 'detail', stopId, carrierId],
    queryFn: () => stopsApi.get(routeId, stopId, carrierId),
    enabled: stopId > 0 && routeId > 0 && carrierId > 0,
  })
}

export function useUpdateStopStatus(routeId: number, carrierId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ stopId, payload }: { stopId: number; payload: UpdateStopStatusPayload }) =>
      stopsApi.updateStatus(routeId, stopId, carrierId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['stops', routeId, carrierId] }),
  })
}
