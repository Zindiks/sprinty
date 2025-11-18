import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useUser } from '@/contexts/UserContext'
import { LoadingScreen } from './LoadingScreen'

/**
 * ProtectedRoute - Authentication Guard Component
 *
 * Ensures user is authenticated before accessing protected routes.
 * If user is not authenticated, redirects to signin page and saves
 * the intended destination for post-login redirect.
 * Shows loading screen while checking authentication status.
 */
export const ProtectedRoute = () => {
  const { user, loading } = useUser()
  const location = useLocation()

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />
  }

  // Redirect to signin if not authenticated, save intended destination
  if (!user) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />
  }

  // User is authenticated, render child routes
  return <Outlet />
}
