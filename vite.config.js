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
    {
      name: "html-inject-year",
      transformIndexHtml(html) {
        return html.replace(
          "%BUILD_YEAR%",
          new Date().getFullYear().toString(),
        );
      },
    },
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      workbox: {
        maximumFileSizeToCacheInBytes: 50000000,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,wasm}"],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
