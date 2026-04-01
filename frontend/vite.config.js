import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'swiper/react': path.resolve(__dirname, 'node_modules/swiper/swiper-react.mjs'),
      'swiper/modules': path.resolve(__dirname, 'node_modules/swiper/modules/index.mjs'),
    }
  },
  optimizeDeps: {
    include: ['swiper/react', 'swiper/modules']
  }
})
