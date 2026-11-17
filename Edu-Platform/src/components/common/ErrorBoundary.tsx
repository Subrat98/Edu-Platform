import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resetDemoData } from "@/lib/resetDemoData";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-2xl border border-border/80 bg-card shadow-xl text-center space-y-4">
            <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <AlertTriangle className="size-6" />
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold text-foreground">
                Something went wrong
              </h1>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {this.state.error?.message || "An unexpected rendering error occurred while loading this view."}
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                variant="default"
                size="sm"
                className="w-full text-xs gap-1.5"
                onClick={() => window.location.reload()}
              >
                <RotateCcw className="size-3.5" />
                <span>Reload Page</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs gap-1.5"
                onClick={resetDemoData}
              >
                <RotateCcw className="size-3.5 text-primary" />
                <span>Reset Demo State & Storage</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs gap-1.5"
                onClick={() => (window.location.href = "/")}
              >
                <Home className="size-3.5" />
                <span>Return to Home</span>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
