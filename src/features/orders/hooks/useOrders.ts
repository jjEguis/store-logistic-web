import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '../api'
import type { UpdateStopStatePayload } from '@/types/domain'

export function useUpdateOrderStatus(routeId: number, carrierId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ idPedido, payload }: { idPedido: number; payload: UpdateStopStatePayload }) =>
      ordersApi.updateStatus(idPedido, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['stops', routeId, carrierId] }),
  })
}

export function useOrderHistory(carrierId: number) {
  return useQuery({
    queryKey: ['orderHistory', carrierId],
    queryFn: () => ordersApi.getHistory(carrierId),
    enabled: carrierId > 0,
  })
}
