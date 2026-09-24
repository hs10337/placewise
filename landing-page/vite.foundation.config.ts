import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  base: './',
  // Keep local credentials out of exported previews.
  define: command === 'build' ? { 'import.meta.env.VITE_MAPBOX_ACCESS_TOKEN': JSON.stringify('') } : {},
  build: { outDir: 'dist-foundation', rollupOptions: { input: ['ios-foundation.html', 'index.html', 'design-preview.html'] } },
}))
