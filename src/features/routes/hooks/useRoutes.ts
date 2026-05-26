import { useQuery } from '@tanstack/react-query'
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


