import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: '../outputs/placewise-studio/build',
    emptyOutDir: true,
    rollupOptions: { input: 'design-preview.html', output: { inlineDynamicImports: true } },
  },
})
