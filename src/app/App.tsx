import { RouterProvider } from "react-router-dom";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { router } from "./routes";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UpdatePrompt } from "@/features/pwa/UpdatePrompt";
import { GoogleTranslateManager } from "@/features/i18n/GoogleTranslateManager";

export function App() {
  return (
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
  );
}
