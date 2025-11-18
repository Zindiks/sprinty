import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useStore } from "@/hooks/store/useStore";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/auth/LoadingScreen";

/**
 * Marketing/Landing Page
 *
 * Public page shown to non-authenticated users.
 * Features:
 * - GitHub OAuth signin
 * - Auto-redirect authenticated users with smart routing
 * - Remember intended destination
 * - Error handling
 */
const Marketing = () => {
  const { user, loading, error } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const organization_id = useStore((state) => state.organization_id);

  /**
   * Smart redirect for authenticated users
   * - If user tried to access a protected route, redirect there
   * - Otherwise, check if organization is selected:
   *   - If org selected → /boards
   *   - If no org → /organizations
   */
  useEffect(() => {
    if (!loading && user) {
      // Check if user was trying to access a specific route
      const intendedDestination = location.state?.from;

      if (intendedDestination && intendedDestination !== '/signin') {
        // Redirect to the originally intended destination
        navigate(intendedDestination, { replace: true });
      } else {
        // Smart redirect based on organization selection
        const storedOrgId = organization_id || localStorage.getItem('organization_id');
        const destination = storedOrgId ? '/boards' : '/organizations';
        navigate(destination, { replace: true });
      }
    }
  }, [user, loading, navigate, location, organization_id]);

  /**
   * Initiate GitHub OAuth flow
   */
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/v1/oauth/github`;
  };

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  // Show marketing page only for non-authenticated users
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-md w-full space-y-8 p-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-2">Sprinty</h1>
          <p className="text-xl text-slate-300">
            Agile Project Management Made Simple
          </p>
        </div>

        {/* Features */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 space-y-4 border border-slate-700">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Why Sprinty?
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="text-green-400 mt-1">✓</div>
              <div>
                <p className="text-white font-medium">Intuitive Kanban Boards</p>
                <p className="text-slate-400 text-sm">
                  Visualize your workflow with drag-and-drop simplicity
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-green-400 mt-1">✓</div>
              <div>
                <p className="text-white font-medium">Real-time Collaboration</p>
                <p className="text-slate-400 text-sm">
                  Work together seamlessly with your team
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-green-400 mt-1">✓</div>
              <div>
                <p className="text-white font-medium">Powerful Analytics</p>
                <p className="text-slate-400 text-sm">
                  Track progress and optimize your sprints
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-lg text-center">
            <p className="font-medium">Authentication failed</p>
            <p className="text-sm mt-1">Please try again or contact support if the issue persists.</p>
          </div>
        )}

        {/* GitHub OAuth Sign In */}
        <div className="space-y-4">
          <Button
            onClick={handleLogin}
            className="w-full h-12 text-base bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg border border-slate-600 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                clipRule="evenodd"
              />
            </svg>
            Continue with GitHub
          </Button>
          <p className="text-sm text-slate-400 text-center">
            Sign in to get started with your projects
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-500 text-sm pt-4">
          <p>Secure authentication powered by GitHub OAuth</p>
        </div>
      </div>
    </div>
  );
};

export default Marketing;
