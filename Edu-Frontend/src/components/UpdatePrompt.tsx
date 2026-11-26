export function UpdatePrompt({ show, onUpdate }: { show: boolean; onUpdate: () => void }) {
  if (!show) return null;
  return <div className="pwa-toast" role="status">
    <span>A new version of the site is available.</span>
    <button className="btn btn-primary" onClick={onUpdate}>Refresh</button>
  </div>;
}
