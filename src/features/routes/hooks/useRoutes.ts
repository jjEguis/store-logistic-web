import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { routesApi } from '../api'

const ROUTES_KEY = ['routes'] as const

export function useRoutes() {
  return useQuery({ queryKey: ROUTES_KEY, queryFn: routesApi.list })
}

export function useRoute(routeId: number) {
  return useQuery({
    queryKey: [...ROUTES_KEY, routeId],
    queryFn: () => routesApi.get(routeId),
    enabled: routeId > 0,
  })
}

export function useAssignVehicle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ routeId, vehicleId }: { routeId: number; vehicleId: string }) =>
      routesApi.assignVehicle(routeId, vehicleId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ROUTES_KEY })
      qc.invalidateQueries({ queryKey: ['fleet'] })
    },
  })
}
