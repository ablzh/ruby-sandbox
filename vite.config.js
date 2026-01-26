import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Ensures assets are loaded correctly on GitHub Pages
  build: {
    target: 'esnext' // WebAssembly requires modern browser support
  }
});
