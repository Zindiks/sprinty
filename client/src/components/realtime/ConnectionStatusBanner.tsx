import { ConnectionStatus } from "@/types/websocket.types";
import { AlertCircle, Wifi, WifiOff, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ConnectionStatusBannerProps {
  status: ConnectionStatus;
  onRetry?: () => void;
}

export function ConnectionStatusBanner({ status, onRetry }: ConnectionStatusBannerProps) {
  if (status === ConnectionStatus.CONNECTED) {
    return null;
  }

  const config = getStatusConfig(status);

  return (
    <Alert
      className={`border-l-4 ${config.borderColor} ${config.bgColor} mb-2 animate-in slide-in-from-top duration-300`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {config.icon}
          <div>
            <AlertDescription className={`${config.textColor} font-medium`}>
              {config.title}
            </AlertDescription>
            <p className={`text-sm ${config.textColor} opacity-80 mt-0.5`}>
              {config.description}
            </p>
          </div>
        </div>

        {status === ConnectionStatus.ERROR && onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1.5 text-sm font-medium text-red-700 hover:text-red-900 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
          >
            Retry Connection
          </button>
        )}

        {status === ConnectionStatus.DISCONNECTED && (
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 text-sm font-medium text-yellow-700 hover:text-yellow-900 bg-yellow-100 hover:bg-yellow-200 rounded-md transition-colors"
          >
            Refresh Page
          </button>
        )}
      </div>
    </Alert>
  );
}

function getStatusConfig(status: ConnectionStatus) {
  switch (status) {
    case ConnectionStatus.CONNECTING:
      return {
        icon: <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />,
        title: "Connecting to real-time updates...",
        description: "Establishing connection to the server",
        borderColor: "border-blue-500",
        bgColor: "bg-blue-50",
        textColor: "text-blue-800",
      };

    case ConnectionStatus.DISCONNECTED:
      return {
        icon: <WifiOff className="h-5 w-5 text-yellow-600" />,
        title: "Disconnected from real-time updates",
        description: "You won't see changes made by others until reconnected",
        borderColor: "border-yellow-500",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-800",
      };

    case ConnectionStatus.ERROR:
      return {
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
        title: "Connection error",
        description: "Unable to connect to real-time server. Click retry or refresh the page.",
        borderColor: "border-red-500",
        bgColor: "bg-red-50",
        textColor: "text-red-800",
      };

    default:
      return {
        icon: <Wifi className="h-5 w-5 text-gray-600" />,
        title: "Unknown status",
        description: "",
        borderColor: "border-gray-500",
        bgColor: "bg-gray-50",
        textColor: "text-gray-800",
      };
  }
}
