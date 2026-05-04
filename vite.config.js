import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Use the repo path only when building for GitHub Pages, not during local dev
  base: command === 'serve' ? '/' : '/MAD_Assignment3/',
}))

