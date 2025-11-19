import { GitHubButton } from '@/components/auth';

/**
 * SignIn Page
 *
 * Dedicated authentication page for users to sign in.
 * Authenticated users are automatically redirected to /organizations.
 */
const SignIn = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sprinty</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Sign In Section */}
          <div className="space-y-4">
            <GitHubButton size="lg" className="w-full" />

            <p className="text-xs text-center text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-center text-gray-600">
              Don't have an account? Sign in with GitHub to create one automatically.
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
