import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: './',
  // Checked-in exports use the no-token map fallback; local dev still reads .env.
  define: command === 'build' ? { 'import.meta.env.VITE_MAPBOX_ACCESS_TOKEN': JSON.stringify('') } : {},
  build: {
    outDir: '../outputs/placewise-studio/build',
    emptyOutDir: true,
    rollupOptions: { input: 'design-preview.html', output: { inlineDynamicImports: true } },
  },
}))
