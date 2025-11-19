import { GitHubButton } from '@/components/auth';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

/**
 * Marketing Page / Landing Page
 *
 * Public page that showcases the product and provides sign-in option.
 * Authenticated users are automatically redirected to /organizations.
 */
const Marketing = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Welcome to Sprinty</h1>
          <p className="text-xl text-gray-600 mb-8">
            Powerful project management and sprint planning tool designed for modern teams.
            Collaborate, track progress, and ship faster.
          </p>

          {/* Auth Section */}
          <div className="flex flex-col items-center gap-4">
            {!user ? (
              <>
                <GitHubButton size="lg" />
                <p className="text-sm text-gray-500">
                  Sign in with your GitHub account to get started
                </p>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {user.avatar_url && (
                    <img
                      src={user.avatar_url}
                      alt={user.login}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <span className="text-gray-700">
                    Signed in as <strong>{user.login}</strong>
                  </span>
                </div>
                <Button onClick={logout} variant="outline">
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Sprint Planning</h3>
            <p className="text-gray-600">
              Plan and manage sprints with ease. Track velocity and team capacity.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
            <p className="text-gray-600">
              Get insights into your team's performance with detailed analytics and reports.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
            <p className="text-gray-600">
              Work together seamlessly with real-time updates and notifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketing;
