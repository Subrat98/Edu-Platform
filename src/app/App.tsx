import { RouterProvider } from "react-router-dom";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { router } from "./routes";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UpdatePrompt } from "@/features/pwa/UpdatePrompt";
import { GoogleTranslateManager } from "@/features/i18n/GoogleTranslateManager";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

export function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider>
          <TooltipProvider>
            <GoogleTranslateManager />
            <RouterProvider router={router} />
            <Toaster position="top-right" richColors />
            <UpdatePrompt />
          </TooltipProvider>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}
