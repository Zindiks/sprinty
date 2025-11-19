import { Route, Routes } from 'react-router-dom';
import Marketing from '@/pages/Marketing';
import SignIn from '@/pages/SignIn';
import Boards from '@/pages/Boards';
import BoardView from '../pages/BoardView';
import CalendarView from '../pages/CalendarView';
import BoardLayout from '@/pages/BoardLayout';
import Organizations from '@/pages/Organization';
import Dashboard from '@/pages/Dashboard';
import ProfilePage from '@/pages/ProfilePage';
import { ProtectedRoute, PublicRoute, OrganizationGuard } from '@/components/auth';

/**
 * AppRoutes - Application Routing Configuration
 *
 * Route Structure:
 * - Public routes (unauthenticated users only, redirects to /organizations if authenticated):
 *   - / (Home/Marketing) - Landing page with product info
 *   - /signin - Dedicated sign-in page
 *
 * - Protected routes (requires authentication, redirects to / if not authenticated):
 *   - /profile - User profile management
 *   - /organizations - Organization selection (default redirect for authenticated users)
 *
 *   - Organization-dependent routes (requires org selection):
 *     - /boards - Board list
 *     - /board/:board_id - Board view
 *     - /board/:board_id/calendar - Calendar view
 *     - /dashboard - Analytics dashboard
 */
const AppRoutes = () => (
  <Routes>
    {/* Public Routes - Redirect authenticated users to /organizations */}
    <Route element={<PublicRoute />}>
      <Route path="/" element={<Marketing />} />
      <Route path="/signin" element={<SignIn />} />
    </Route>

    {/* Protected Routes - Require Authentication */}
    <Route element={<ProtectedRoute />}>
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/organizations" element={<Organizations />} />

      {/* Organization-Dependent Routes - Require Org Selection */}
      <Route element={<OrganizationGuard />}>
        <Route path="/boards" element={<Boards />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="board" element={<BoardLayout />}>
          <Route path=":board_id" element={<BoardView />} />
          <Route path=":board_id/calendar" element={<CalendarView />} />
        </Route>
      </Route>
    </Route>
  </Routes>
);

export default AppRoutes;
