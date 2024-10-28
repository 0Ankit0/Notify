import { Loader2 } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Loading...
        </h2>
      </div>
    </div>
  );
}
