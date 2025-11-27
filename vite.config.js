import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwind(),
    VitePWA({
      registerType: "autoUpdate",

      // ❗ Ini tempat yang BENAR untuk preset di V1.x
      assetsGenerator: {
        preset: "modern"
      },

      includeAssets: [
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
        "Logo.png"
      ],

      manifest: {
        name: "Network Device Management",
        short_name: "NDM",
        start_url: "/",
        display: "standalone",
        theme_color: "#2563eb",
        background_color: "#ffffff",
        icons: []
      },

      devOptions: {
        enabled: true
      }
    })
  ],
  server: { port: 5182 }
})
