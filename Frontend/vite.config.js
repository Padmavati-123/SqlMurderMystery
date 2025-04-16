import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://sql-backend-hggtg3ccd8h8fpfv.southindia-01.azurewebsites.net',
        changeOrigin: true,
        secure: false
      },
      '/auth': {
        target: 'https://sql-backend-hggtg3ccd8h8fpfv.southindia-01.azurewebsites.net',
        changeOrigin: true,
        secure: false
      }
    }
  }
})