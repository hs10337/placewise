import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  build: { outDir: 'dist-foundation', rollupOptions: { input: ['ios-foundation.html', 'index.html', 'design-preview.html'] } },
})
