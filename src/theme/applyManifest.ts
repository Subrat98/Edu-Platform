/**
 * A real per-tenant web app manifest needs server-side generation; this
 * demo hand-rolls one static manifest per institution under
 * public/manifest/ (see those files for the full installable-app
 * metadata) and swaps the page's <link rel="manifest"> + apple-touch-icon
 * to match whichever institution is active, so "Add to Home Screen"
 * installs with the right name/icon/start URL for that institution.
 */
export function applyManifest(id: "school" | "college" | "unified") {
  document.getElementById("web-manifest")?.setAttribute("href", `/manifest/${id}.webmanifest`);
  document.getElementById("apple-touch-icon")?.setAttribute("href", `/icons/${id}-512.svg`);
}
