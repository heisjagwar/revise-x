import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <WifiOff className="h-24 w-24 text-muted-foreground mb-4" />
      <h1 className="text-4xl font-bold">You are offline</h1>
      <p className="text-muted-foreground mt-2">
        Please check your internet connection.
      </p>
      <p className="text-muted-foreground mt-1">
        Some pages may be available if you have visited them before.
      </p>
    </div>
  );
}
