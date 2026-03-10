import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '修仙传',
        short_name: '修仙传',
        description: '问道长生 - 修仙题材放置修行游戏',
        theme_color: '#1a0a1a',
        background_color: '#0f0612',
        display: 'standalone',
        start_url: './',
      },
    }),
  ],
  base: './',
})
