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
