import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "eduplatform:install-prompt-dismissed";

function isStandalone(): boolean {
  return window.matchMedia?.("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
}

/**
 * iOS/iPadOS Safari never fires beforeinstallprompt and has no
 * programmatic install API — spec §6.7 calls for an in-page "Add to Home
 * Screen" guide there instead. Detecting iOS here is the one place that's
 * actually appropriate: it's not a layout/device-class decision, it's
 * "which install mechanism does this browser support," and the spec
 * prescribes exactly this check for exactly this purpose.
 */
function isIOSSafari(): boolean {
  const ua = navigator.userAgent;
  const isIOS = /iphone|ipad|ipod/i.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
  return isIOS;
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  function dismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* private browsing / storage blocked — dismiss still works for this page view */
    }
  }

  async function promptInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  const installed = isStandalone();
  const canPromptNatively = !!deferredPrompt;
  const showIOSGuide = isIOSSafari() && !installed && !canPromptNatively;
  const visible = !installed && !dismissed && (canPromptNatively || showIOSGuide);

  return { visible, canPromptNatively, showIOSGuide, promptInstall, dismiss };
}
