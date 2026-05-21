import api from '@/lib/axios'
import type { UpdateStopStatePayload, UpdateOrderStatusResponse, OrderHistoryItem } from '@/types/domain'

export const ordersApi = {
  // PUT /logistics/orders/{idPedido}/status
  updateStatus: (idPedido: number, payload: UpdateStopStatePayload) =>
    api
      .put<UpdateOrderStatusResponse>(`/logistics/orders/${idPedido}/status`, payload)
      .then(r => r.data),

  // GET /logistics/orders/carrier/{carrierId}/history
  getHistory: (carrierId: number) =>
    api
      .get<OrderHistoryItem[]>(`/logistics/orders/carrier/${carrierId}/history`)
      .then(r => r.data),
}
