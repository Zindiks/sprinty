import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from '@/contexts/UserContext'
import { LoadingScreen } from './LoadingScreen'

/**
 * ProtectedRoute - Authentication Guard Component
 *
 * Ensures user is authenticated before accessing protected routes.
 * If user is not authenticated, redirects to home page (Marketing).
 * Shows loading screen while checking authentication status.
 */
export const ProtectedRoute = () => {
  const { user, loading } = useUser()

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />
  }

  // Redirect to home if not authenticated
  if (!user) {
    return <Navigate to="/" replace />
  }

  // User is authenticated, render child routes
  return <Outlet />
}
