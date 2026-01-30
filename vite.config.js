import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "./", // Ensures assets are loaded correctly on GitHub Pages
  build: {
    target: "esnext", // WebAssembly requires modern browser support
    rollupOptions: {
      input: {
        main: 'index.html',
        docs: 'docs.html',
        about: 'about.html'
      }
    }
  },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      workbox: {
        maximumFileSizeToCacheInBytes: 50000000,
        // Removed 'wasm' from precache so it doesn't download on page load
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        cleanupOutdatedCaches: true,
        // Add runtime caching for WASM files
        runtimeCaching: [{
          urlPattern: ({ url }) => url.pathname.endsWith('.wasm'),
          handler: 'CacheFirst',
          options: {
            cacheName: 'ruby-wasm-cache',
            expiration: {
              maxEntries: 2,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }]
      },
    }),
  ],
});
