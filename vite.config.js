import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/airlabs': {
        target: 'https://airlabs.co/api/v9',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/airlabs/, ''),
      },
      '/pixabay': {
        target: 'https://pixabay.com/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pixabay/, ''),
      },
      '/newsdata': {
        target: 'https://newsdata.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/newsdata/, ''),
      },
      '/railradar': {
        target: 'https://api.railradar.in/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/railradar/, ''),
      },
    },
  },
})
