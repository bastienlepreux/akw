import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  base: '/akw/',   // ← impératif pour https://bastienlepreux.github.io/akw/
})
