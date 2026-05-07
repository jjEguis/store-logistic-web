import { createBrowserRouter, Navigate } from 'react-router-dom'
import DispatcherLayout from '@/layout/DispatcherLayout'
import DriverLayout from '@/layout/DriverLayout'
import FleetPage from '@/pages/dispatcher/FleetPage'
import RoutesPage from '@/pages/dispatcher/RoutesPage'
import StopsPage from '@/pages/driver/StopsPage'
import OrdersPage from '@/pages/driver/OrdersPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DispatcherLayout />,
    children: [
      { index: true, element: <Navigate to="/fleet" replace /> },
      { path: 'fleet',  element: <FleetPage /> },
      { path: 'routes', element: <RoutesPage /> },
    ],
  },
  {
    path: '/driver',
    element: <DriverLayout />,
    children: [
      { index: true, element: <Navigate to="/driver/stops" replace /> },
      { path: 'stops',  element: <StopsPage /> },
      { path: 'orders', element: <OrdersPage /> },
    ],
  },
])
