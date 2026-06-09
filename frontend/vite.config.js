import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['logo.svg'],
      manifest: {
        name: 'LegalEase AI',
        short_name: 'LegalEase',
        description: 'Understand Indian Legal Documents',
        theme_color: '#0A0E1A',
        background_color: '#0A0E1A',
        display: 'standalone',
        icons: [
          {
            src: '/logo.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
