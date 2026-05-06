import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // API_PROXY_TARGET is the real backend host used by Vite's dev proxy.
  // Falls back to VITE_API_URL so a single env var works for simple setups.
  const proxyTarget =
    env.API_PROXY_TARGET || env.VITE_API_URL || 'http://localhost:8080'

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // Specific react-* packages first (before the broad react check)
              if (id.includes('react-router')) {
                return 'router'
              }
              if (
                id.includes('date-fns') ||
                id.includes('react-hook-form') ||
                id.includes('@tanstack')
              ) {
                return 'utils-vendor'
              }
              // Core React only: react, react-dom, scheduler
              if (
                /[/\\]node_modules[/\\](react|react-dom|scheduler)[/\\]/.test(
                  id
                )
              ) {
                return 'react-vendor'
              }
              if (id.includes('@radix-ui')) {
                return 'ui-vendor'
              }
              if (id.includes('lucide')) {
                return 'icons'
              }
              if (id.includes('sonner')) {
                return 'toast'
              }
              return 'vendor'
            }
          }
        }
      },
      chunkSizeWarningLimit: 800
    },
    server: {
      port: 5173,
      proxy: {
        // Forward /api/* to the Symfony middleware, bypassing CORS.
        // axios baseURL is "/api", so requests like /api/auth/login
        // are proxied to <target>/api/auth/login.
        '/api': {
          target: proxyTarget,
          changeOrigin: true
        }
      }
    }
  }
})
