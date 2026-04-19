import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Tech Store - Premium Technology',
        short_name: 'TechStore',
        description: 'Cửa hàng công nghệ cao cấp chính hãng',
        theme_color: '#ea580c',
        icons: [
          { src: 'favicon.png', sizes: '192x192', type: 'image/png' },
          { src: 'favicon.png', sizes: '512x512', type: 'image/png' },
          { src: 'favicon.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        // ✅ Tăng giới hạn precache lên 3MB để hết warning
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /\/api\/v1\/(products|categories|featured).*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom'],
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
    // ✅ Cảnh báo khi 1 chunk vượt quá 600KB
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // ✅ Tách bundle thành nhiều chunk nhỏ → load nhanh hơn, cache tốt hơn
        manualChunks(id) {
          // React core
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router-dom/') ||
              id.includes('node_modules/scheduler/')) {
            return 'vendor-react'
          }

          // State management & data fetching
          if (id.includes('node_modules/@tanstack/') ||
              id.includes('node_modules/axios/') ||
              id.includes('node_modules/zustand/') ||
              id.includes('node_modules/redux/') ||
              id.includes('node_modules/@reduxjs/')) {
            return 'vendor-state'
          }

          // UI component libraries
          if (id.includes('node_modules/@radix-ui/') ||
              id.includes('node_modules/lucide-react/') ||
              id.includes('node_modules/class-variance-authority/') ||
              id.includes('node_modules/clsx/') ||
              id.includes('node_modules/tailwind-merge/')) {
            return 'vendor-ui'
          }

          // Form & validation
          if (id.includes('node_modules/react-hook-form/') ||
              id.includes('node_modules/zod/') ||
              id.includes('node_modules/@hookform/')) {
            return 'vendor-form'
          }

          // Utilities
          if (id.includes('node_modules/date-fns/') ||
              id.includes('node_modules/lodash/') ||
              id.includes('node_modules/dayjs/')) {
            return 'vendor-utils'
          }

          // Mọi node_modules còn lại gom vào vendor chung
          if (id.includes('node_modules/')) {
            return 'vendor-misc'
          }
        }
      }
    }
  }
})
