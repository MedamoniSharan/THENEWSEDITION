import { Suspense, lazy } from 'react'
import PageLoader from './components/ui/PageLoader'
import Site from './Site'

/** Loaded only on /admin, so visitors never download the dashboard code. */
const AdminApp = lazy(() => import('./admin/AdminApp'))

const isAdmin = () => window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')

export default function Root() {
  return isAdmin() ? (
    <Suspense fallback={<PageLoader />}>
      <AdminApp />
    </Suspense>
  ) : (
    <Site />
  )
}
