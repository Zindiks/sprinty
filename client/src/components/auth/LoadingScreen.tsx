/**
 * LoadingScreen - Full-page Loading Component
 *
 * Displays a centered loading spinner with message.
 * Used during authentication checks and other async operations.
 */
export const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
