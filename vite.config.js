import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
  server: {
    host: true,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/contactMessages': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  preview: {
    host: true,
    allowedHosts: true,
  },
})
