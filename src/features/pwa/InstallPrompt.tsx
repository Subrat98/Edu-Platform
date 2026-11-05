import { Download, Share, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInstallPrompt } from "./useInstallPrompt";

export function InstallPrompt() {
  const { visible, canPromptNatively, showIOSGuide, promptInstall, dismiss } = useInstallPrompt();

  if (!visible) return null;

  return (
    <div className="border-border bg-surface fixed right-4 bottom-4 left-4 z-50 mx-auto max-w-sm rounded-xl border p-4 shadow-lg sm:left-auto">
      <button type="button" onClick={dismiss} aria-label="Dismiss" className="text-muted-foreground hover:text-foreground absolute top-2 right-2">
        <X className="size-4" />
      </button>
      {canPromptNatively ? (
        <>
          <p className="text-sm font-medium">Install this app</p>
          <p className="text-muted-foreground mt-1 text-xs">Add it to your home screen for one-tap access, even offline.</p>
          <Button size="sm" className="mt-3 gap-1.5" onClick={promptInstall}>
            <Download className="size-4" /> Install
          </Button>
        </>
      ) : showIOSGuide ? (
        <>
          <p className="text-sm font-medium">Add to Home Screen</p>
          <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
            Tap <Share className="mx-0.5 inline size-3.5" /> Share, then "Add to Home Screen".
          </p>
        </>
      ) : null}
    </div>
  );
}
