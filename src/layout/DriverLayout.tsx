import { Outlet } from 'react-router-dom'

export default function DriverLayout() {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: 'var(--bg-app)', maxWidth: 430, margin: '0 auto' }}
    >
      <Outlet />
    </div>
  )
}
