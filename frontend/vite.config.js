import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  // Vite sometimes struggles with CommonJS modules that use `require`.
  // Adding the problematic packages to `optimizeDeps.include` forces Vite to pre‑bundle them
  // with esbuild, which correctly transforms the `require` calls.
  optimizeDeps: {
    include: ['react-simple-maps', 'prop-types'],
  },
});