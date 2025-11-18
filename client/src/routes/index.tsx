import { Route, Routes } from "react-router-dom";
import User from "../pages/User";
import Marketing from "@/pages/Marketing";
import Boards from "@/pages/Boards";
import BoardView from "../pages/BoardView";
import CalendarView from "../pages/CalendarView";
import BoardLayout from "@/pages/BoardLayout";
import Organizations from "@/pages/Organization";
import Dashboard from "@/pages/Dashboard";
import ProfilePage from "@/pages/ProfilePage";
import { ProtectedRoute, OrganizationGuard } from "@/components/auth";

/**
 * AppRoutes - Application Routing Configuration
 *
 * Route Structure:
 * - / (Marketing/Landing) - Public route with GitHub OAuth signin
 * - /signin - Signin page (alias to Marketing)
 * - /user - Legacy user page (consider removing)
 * - Protected routes (requires authentication):
 *   - /profile - User profile management
 *   - /organizations - Organization selection
 *   - Organization-dependent routes (requires org selection):
 *     - /boards - Board list
 *     - /board/:board_id - Board view
 *     - /board/:board_id/calendar - Calendar view
 *     - /dashboard - Analytics dashboard
 *
 * Authentication Flow:
 * - Unauthenticated users → /signin
 * - Authenticated users on public routes → /boards
 * - Protected routes without auth → /signin
 */
const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Marketing />} />
    <Route path="/signin" element={<Marketing />} /> {/* Alias for marketing/login */}
    <Route path="/user" element={<User />} /> {/* Legacy - consider removing */}

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
