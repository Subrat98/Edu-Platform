import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // manifest: false — each institution's installable-app metadata is a
    // hand-rolled static file under public/manifest/, swapped at runtime
    // by src/theme/applyManifest.ts, since a single build-time manifest
    // can't reflect whichever tenant is currently active. This plugin
    // only supplies the offline app-shell service worker + update prompt.
    VitePWA({
      registerType: "prompt",
      manifest: false,
      injectRegister: false,
      // Dev-mode SW registration (devOptions.enabled) throws ENOENT on a
      // cold start — it expects dev-dist/sw.js to already exist, which it
      // won't on a fresh checkout (dev-dist is git-ignored, generated
      // on demand). The real service worker is still fully exercised by
      // `npm run build` (verified every phase); this only disables the
      // dev-server convenience registration, not the feature itself.
      devOptions: { enabled: false },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,woff2}"],
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
