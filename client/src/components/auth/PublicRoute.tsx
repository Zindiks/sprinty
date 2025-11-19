import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { LoadingScreen } from './LoadingScreen';

/**
 * PublicRoute - Public Page Guard Component
 *
 * Ensures authenticated users are redirected away from public pages
 * (like marketing and sign-in pages) to their default dashboard.
 *
 * If user is authenticated, redirects to /organizations.
 * If user is not authenticated, allows access to public page.
 * Shows loading screen while checking authentication status.
 */
export const PublicRoute = () => {
  const { user, loading } = useUser();

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  // Redirect to organizations if already authenticated
  if (user) {
    return <Navigate to="/organizations" replace />;
  }

  // User is not authenticated, render public page
  return <Outlet />;
};
