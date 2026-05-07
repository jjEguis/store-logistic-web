import { Truck } from 'lucide-react'
import type { VehicleCategory } from '@/types/domain'
import { CAT_LABEL, CAT_COLORS } from './constants'

export default function CategoryTag({ value }: { value: VehicleCategory }) {
  const c = CAT_COLORS[value]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '2px 8px', borderRadius: 4,
      fontSize: 11, fontWeight: 600, letterSpacing: 0.2,
      background: c.bg, color: c.fg,
    }}>
      <Truck size={12} strokeWidth={1.5} />
      {CAT_LABEL[value]}
    </span>
  )
}
