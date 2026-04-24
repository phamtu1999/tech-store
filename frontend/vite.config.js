import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom', 'react-redux'],
  },

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },

  build: {
    chunkSizeWarningLimit: 600,
    sourcemap: false,
    // Deleting manualChunks to prevent duplicate instance risks
  }
})
