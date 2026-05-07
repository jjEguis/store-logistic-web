import type { PillTone } from '@/components/Pill'
import type { VehicleCategory, VehicleState } from '@/types/domain'

export const STATE_LABEL: Record<VehicleState, string> = {
  DISPONIBLE:        'Disponible',
  EN_RUTA:           'En ruta',
  EN_MANTENIMIENTO:  'En mantenimiento',
  FUERA_DE_SERVICIO: 'Fuera de servicio',
}

export const STATE_TONE: Record<VehicleState, PillTone> = {
  DISPONIBLE:        'success',
  EN_RUTA:           'info',
  EN_MANTENIMIENTO:  'warning',
  FUERA_DE_SERVICIO: 'danger',
}

export const CAT_LABEL: Record<VehicleCategory, string> = {
  CAMIONETA_URBANA:      'Camioneta urbana',
  CAMION_SENCILLO:       'Camión sencillo',
  TRACTOCAMION_REGIONAL: 'Tractocamión regional',
}

export const CAT_COLORS: Record<VehicleCategory, { bg: string; fg: string }> = {
  CAMIONETA_URBANA:      { bg: 'var(--cat-urbana-soft)',   fg: 'var(--cat-urbana)' },
  CAMION_SENCILLO:       { bg: 'var(--cat-sencillo-soft)', fg: 'var(--cat-sencillo)' },
  TRACTOCAMION_REGIONAL: { bg: 'var(--cat-tracto-soft)',   fg: 'var(--cat-tracto)' },
}

export const ALL_STATES = Object.keys(STATE_LABEL) as VehicleState[]
