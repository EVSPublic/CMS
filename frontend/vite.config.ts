import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/uploads': 'http://localhost:5050',
      '/thumbnails': 'http://localhost:5050',
      '/media': 'http://localhost:5050'
    }
  },
  build: {
    commonjsOptions: {
      include: ["tailwind.config.js", "node_modules/**"],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  optimizeDeps: {
    include: ["tailwind-config", "react", "react-dom"],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "tailwind-config": fileURLToPath(
        new URL("./tailwind.config.js", import.meta.url)
      ),
    },
  },
});
