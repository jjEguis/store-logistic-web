import { NavLink, Outlet } from 'react-router-dom'
import { Truck, Route } from 'lucide-react'

const navItems = [
  { to: '/fleet',  icon: Truck,   label: 'Flota' },
  { to: '/routes', icon: Route,   label: 'Rutas' },
]

export default function DispatcherLayout() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-app)' }}>
      <nav
        className="flex flex-col gap-1 p-3 shrink-0"
        style={{
          width: 'var(--rail-w)',
          background: 'var(--bg-rail)',
          borderRight: '1px solid var(--border-rail)',
        }}
      >
        <div className="flex items-center gap-3 px-3 py-4 mb-4">
          <div
            className="flex items-center justify-center rounded-md shrink-0"
            style={{ width: 32, height: 32, background: 'var(--brand)' }}
          >
            <Truck size={18} color="white" strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--fg-on-rail)' }}>
              Store Logistic
            </div>
            <div className="text-xs" style={{ color: 'var(--fg-on-rail-2)' }}>
              Panel de despacho
            </div>
          </div>
        </div>

        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors"
            style={({ isActive }) => ({
              color: isActive ? 'var(--fg-on-rail)' : 'var(--fg-on-rail-2)',
              background: isActive ? 'var(--bg-rail-hover)' : 'transparent',
            })}
          >
            <Icon size={16} strokeWidth={1.5} />
            {label}
          </NavLink>
        ))}
      </nav>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
