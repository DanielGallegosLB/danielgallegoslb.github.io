import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://github.com/DanielGallegosLB/39_Portfolio_Three.js',
  plugins: [react()],
})
