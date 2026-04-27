import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    proxy: {
      // Fallback proxy: if you set VITE_API_URL="/api" instead of the
      // full middleware URL, Vite will forward requests to the Symfony
      // middleware, bypassing CORS entirely during development.
      '/api': {
        target: 'http://192.168.0.171:8080',
        changeOrigin: true
      }
    }
  }
})
