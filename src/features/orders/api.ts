import api from '@/lib/axios'
import type { UpdateStopStatePayload, UpdateOrderStatusResponse } from '@/types/domain'

export const ordersApi = {
  // PUT /logistics/orders/{idPedido}/status
  updateStatus: (idPedido: number, payload: UpdateStopStatePayload) =>
    api
      .put<UpdateOrderStatusResponse>(`/logistics/orders/${idPedido}/status`, payload)
      .then(r => r.data),
}
