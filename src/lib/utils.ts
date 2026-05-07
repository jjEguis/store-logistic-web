import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fmtCOP(amount: number | null | undefined): string {
  if (amount == null) return '—'
  return '$ ' + amount.toLocaleString('es-CO', { minimumFractionDigits: 0 })
}

export function fmtKg(kg: number): string {
  return kg.toLocaleString('es-CO') + ' kg'
}

export function fmtPct(value: number): string {
  return value.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%'
}
