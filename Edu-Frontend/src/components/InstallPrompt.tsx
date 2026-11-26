import { useEffect, useState } from 'react';
import { Download, Share2, X } from 'lucide-react';

const DISMISS_KEY = 'pwa_install_dismissed_at';
const DISMISS_DAYS = 14;

function isDismissed() {
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  return Date.now() - Number(raw) < DISMISS_DAYS * 86400000;
}

export function InstallPrompt({ suppressed }: { suppressed: boolean }) {
  const [deferred, setDeferred] = useState<any>(null);
  const [dismissed, setDismissed] = useState(isDismissed());

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;

  useEffect(() => {
    const onPrompt = (e: Event) => { e.preventDefault(); setDeferred(e); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  function dismiss() { localStorage.setItem(DISMISS_KEY, String(Date.now())); setDismissed(true); }

  if (suppressed || dismissed || isStandalone) return null;

  if (deferred) {
    return <div className="pwa-toast install-toast">
      <Download size={18} />
      <span>Install Our College for quick, offline-friendly access.</span>
      <button className="btn btn-primary" onClick={async () => { await deferred.prompt(); setDeferred(null); }}>Install</button>
      <button aria-label="Dismiss" onClick={dismiss}><X size={16} /></button>
    </div>;
  }

  if (isIOS) {
    return <div className="pwa-toast install-toast">
      <Share2 size={18} />
      <span>Install this app: tap Share, then "Add to Home Screen".</span>
      <button aria-label="Dismiss" onClick={dismiss}><X size={16} /></button>
    </div>;
  }

  return null;
}
