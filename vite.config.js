import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: change base to '/<nom-du-repo>/' before pushing to GitHub Pages project site
export default defineConfig({
  plugins: [react()],
  base: '/akw/', // ex: '/a-kaz-aw/' ; si ton dépôt = username.github.io, remplace par '/'
})
