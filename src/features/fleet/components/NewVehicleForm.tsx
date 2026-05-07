import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Check } from 'lucide-react'
import type { CreateVehiclePayload } from '@/types/domain'
import { useCreateVehicle } from '../hooks/useFleet'

const schema = z.object({
  categoria:       z.enum(['CAMIONETA_URBANA', 'CAMION_SENCILLO', 'TRACTOCAMION_REGIONAL']),
  capacidadCarga:  z.coerce.number().positive('Debe ser mayor a 0'),
  idTransportista: z.coerce.number().int().positive().optional().or(z.literal('')),
})

type FormValues = z.infer<typeof schema>

interface Props { onClose: () => void }

const INPUT_STYLE: React.CSSProperties = {
  width: '100%', padding: '8px 12px', fontSize: 14, fontFamily: 'inherit',
  border: '1px solid var(--border-2)', borderRadius: 'var(--r-input)',
  background: 'var(--bg-surface)', color: 'var(--fg-1)', outline: 'none',
  boxSizing: 'border-box',
}

function Field({ label, required, hint, error, children }: {
  label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg-1)' }}>
        {label}{required && <span style={{ color: 'var(--danger)' }}> *</span>}
      </span>
      {children}
      {hint && !error && <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>{hint}</span>}
      {error && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</span>}
    </label>
  )
}

export default function NewVehicleForm({ onClose }: Props) {
  const { mutate: create, isPending } = useCreateVehicle()
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { categoria: 'CAMION_SENCILLO' },
  })

  const onSubmit = (data: FormValues) => {
    const payload: CreateVehiclePayload = {
      categoria:      data.categoria,
      capacidadCarga: data.capacidadCarga,
      ...(data.idTransportista !== '' && data.idTransportista != null
        ? { idTransportista: Number(data.idTransportista) }
        : {}),
    }
    create(payload, { onSuccess: onClose })
  }

  return (
    <div style={{
      background: 'var(--bg-surface)', borderRadius: 'var(--r-modal)',
      boxShadow: 'var(--shadow-md)', width: 480, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '18px 24px', borderBottom: '1px solid var(--border-1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <h2>Nuevo vehículo</h2>
          <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 2 }}>Registra un vehículo en la flota.</div>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--fg-2)', padding: 4, display: 'flex' }}>
          <X size={18} strokeWidth={1.5} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>

          <Field label="Categoría" required hint="Define el tipo de carga que puede transportar." error={errors.categoria?.message}>
            <select {...register('categoria')} style={{ ...INPUT_STYLE, cursor: 'pointer', appearance: 'none' }}>
              <option value="CAMIONETA_URBANA">Camioneta urbana — entregas dentro de la ciudad</option>
              <option value="CAMION_SENCILLO">Camión sencillo — distribución regional ligera</option>
              <option value="TRACTOCAMION_REGIONAL">Tractocamión regional — viajes interdepartamentales</option>
            </select>
          </Field>

          <Field label="Capacidad de carga (kg)" required hint="Peso máximo permitido en kilogramos." error={errors.capacidadCarga?.message}>
            <input {...register('capacidadCarga')} type="number" placeholder="5000" style={INPUT_STYLE} />
          </Field>

          <Field label="ID Transportista" hint="Opcional · puedes asignarlo más tarde." error={errors.idTransportista?.message}>
            <input {...register('idTransportista')} type="number" placeholder="Sin asignar" style={INPUT_STYLE} />
          </Field>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid var(--border-1)',
          background: 'var(--bg-surface-2)', display: 'flex', justifyContent: 'flex-end', gap: 8,
        }}>
          <button type="button" onClick={onClose} style={{
            padding: '8px 14px', fontSize: 14, fontWeight: 500, fontFamily: 'inherit',
            background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--fg-1)',
            borderRadius: 'var(--r-input)',
          }}>
            Cancelar
          </button>
          <button type="submit" disabled={isPending} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 14px', fontSize: 14, fontWeight: 500, fontFamily: 'inherit',
            background: isPending ? 'var(--brand-hover)' : 'var(--brand)',
            color: 'white', border: 0, borderRadius: 'var(--r-input)',
            cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.7 : 1,
          }}>
            <Check size={16} strokeWidth={2} />
            {isPending ? 'Guardando…' : 'Registrar vehículo'}
          </button>
        </div>
      </form>
    </div>
  )
}
