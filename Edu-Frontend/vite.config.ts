import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      devOptions: { enabled: false },
      includeAssets: ['icons/*.png', 'apple-touch-icon.png', 'favicon.png'],
      manifest: {
        name: 'Our College',
        short_name: 'Our College',
        description: 'Our College — learning today, leading tomorrow.',
        theme_color: '#17345f',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        runtimeCaching: [{
          urlPattern: ({ url, request }) => /\/api\//.test(url.pathname) && !request.headers.has('Authorization'),
          handler: 'NetworkFirst',
          method: 'GET',
          options: {
            cacheName: 'api-cache',
            networkTimeoutSeconds: 4,
            expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 3 },
            cacheableResponse: { statuses: [0, 200] },
          },
        }],
      },
    }),
  ],
});
