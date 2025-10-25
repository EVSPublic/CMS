import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: env.VITE_BASE_PATH || '/CMS/',
    server: {
      port: 3000,
      host: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'https://test-www.ovolt.com.tr/API',
          changeOrigin: true,
          secure: false,
        },
        '/uploads': {
          target: env.VITE_API_BASE_URL || 'https://test-www.ovolt.com.tr/API',
          changeOrigin: true,
          secure: false,
        },
        '/thumbnails': {
          target: env.VITE_API_BASE_URL || 'https://test-www.ovolt.com.tr/API',
          changeOrigin: true,
          secure: false,
        },
        '/media': {
          target: env.VITE_API_BASE_URL || 'https://test-www.ovolt.com.tr/API',
          changeOrigin: true,
          secure: false,
        }
      }
    },
        build: {
          outDir: 'dist',
          sourcemap: mode === 'development',
          assetsDir: 'assets',
          copyPublicDir: true,
          rollupOptions: {
            output: {
              manualChunks: {
                vendor: ['react', 'react-dom'],
                router: ['react-router-dom'],
                ui: ['@headlessui/react', 'lucide-react'],
                charts: ['chart.js'],
                editor: ['@ckeditor/ckeditor5-build-classic']
              }
            }
          }
        },
    plugins: [
      react()
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "tailwind-config": fileURLToPath(
          new URL("./tailwind.config.js", import.meta.url)
        ),
      },
    },
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@reduxjs/toolkit',
        'react-redux'
      ]
    }
  };
});
