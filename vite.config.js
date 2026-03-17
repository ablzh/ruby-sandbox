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
          about: 'about.html',
          contact: 'contact.html'
        }
    }
  },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      manifest: {
        name: "Ruby Sandbox",
        short_name: "Ruby Sandbox",
        description: "An interactive Ruby playground and sandbox environment. Run Ruby code directly in your browser using WebAssembly.",
        theme_color: "#cc342d",
        background_color: "#1e1e1e",
        display: "standalone",
        start_url: "./index.html",
        icons: [
          {
            src: "favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable"
          }
        ]
      },
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
