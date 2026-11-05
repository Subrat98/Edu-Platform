import { useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { toast } from "sonner";

/**
 * Mounted once at the app root. The service worker caches the static app
 * shell for offline/poor-network access (spec §6.7); when a new build is
 * deployed, this prompts the user to reload rather than silently serving
 * a stale version forever.
 */
export function UpdatePrompt() {
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      registration?.update();
    },
  });

  useEffect(() => {
    if (!needRefresh) return;
    toast("A new version is available", {
      description: "Reload to get the latest EduPlatform build.",
      duration: Infinity,
      action: { label: "Reload", onClick: () => updateServiceWorker(true) },
    });
  }, [needRefresh, updateServiceWorker]);

  return null;
}
