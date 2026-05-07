import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fleetApi } from '../api'
import type { VehicleState, CreateVehiclePayload } from '@/types/domain'

const FLEET_KEY = ['fleet'] as const

export function useFleet() {
  return useQuery({ queryKey: FLEET_KEY, queryFn: fleetApi.list })
}

export function useVehicle(id: number) {
  return useQuery({ queryKey: [...FLEET_KEY, id], queryFn: () => fleetApi.get(id) })
}

export function useCreateVehicle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateVehiclePayload) => fleetApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: FLEET_KEY }),
  })
}

export function useUpdateVehicleState() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: VehicleState }) =>
      fleetApi.updateState(id, estado),
    onSuccess: () => qc.invalidateQueries({ queryKey: FLEET_KEY }),
  })
}
