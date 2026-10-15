import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const api = process.env.API_PROXY_TARGET ?? 'http://localhost:4000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': api,
      '/media': api,
    },
  },
  build: {
    rolldownOptions: {
      output: {
        // Long-lived vendor chunks survive content/app redeploys in the browser cache.
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: 'admin-vendor', test: /node_modules[\\/](@dnd-kit|@tanstack)[\\/]/ },
          ],
        },
      },
    },
  },
})
