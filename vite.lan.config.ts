import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// A compiled website, never a public Vite server. The SDK preset owns dist/.
export default defineConfig({ root: 'server/client', plugins: [react()],
  build: { outDir: '../../lan-dist', emptyOutDir: true, sourcemap: false,
    rollupOptions: { output: { entryFileNames: 'client.js', chunkFileNames: '[name]-[hash].js', assetFileNames: '[name][extname]' } } },
})
