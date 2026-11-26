import { useState } from 'react';
import { Check, Share2 } from 'lucide-react';

export function ShareButton({ title, text, url }: { title: string; text?: string; url?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareUrl = url || window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title, text, url: shareUrl }); } catch { /* user cancelled share sheet */ }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch { /* clipboard unavailable, fail silently */ }
    }
  }

  return <button className="download-link" onClick={handleShare} aria-label="Share this page">
    {copied ? <Check size={16} /> : <Share2 size={16} />} {copied ? 'Link copied' : 'Share'}
  </button>;
}
