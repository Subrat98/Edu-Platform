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

  const iconHref =
    id === "college"
      ? "/college-logo.png"
      : id === "unified"
        ? "/icons/unified-512.svg"
        : "/icons/school-512.svg";
  document.getElementById("apple-touch-icon")?.setAttribute("href", iconHref);

  // Dynamically update the browser tab favicon
  const favicon = document.getElementById("app-favicon") || document.querySelector("link[rel*='icon']");
  if (favicon) {
    favicon.setAttribute("href", id === "college" ? "/college-logo.png" : "/favicon.png");
  }

  // Update browser tab title
  if (id === "college") {
    document.title = "Our College";
  } else if (id === "school") {
    document.title = "Our School";
  } else if (id === "unified") {
    document.title = "EduPlatform";
  }
}
