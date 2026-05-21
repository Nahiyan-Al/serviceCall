import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Banner from '../components/Banner'
import FirebaseConfigNotice from '../components/FirebaseConfigNotice'

const RootLayout = () => (
  <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <FirebaseConfigNotice />
      <Banner />
      <Outlet />
    </div>
    <TanStackRouterDevtools />
  </div>
)

export const Route = createRootRoute({
  component: RootLayout,
})
