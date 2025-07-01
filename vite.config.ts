import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  base: '/Luxembourgish-flashcards/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Enhanced cache-busting with hash-based filenames and aggressive versioning
    rollupOptions: {
      output: {
        // Add timestamp hash to filenames for aggressive cache busting
        entryFileNames: (chunkInfo) => {
          const timestamp = Date.now();
          return `assets/[name]-[hash]-${timestamp}.js`;
        },
        chunkFileNames: (chunkInfo) => {
          const timestamp = Date.now();
          return `assets/[name]-[hash]-${timestamp}.js`;
        },
        assetFileNames: (assetInfo) => {
          const timestamp = Date.now();
          return `assets/[name]-[hash]-${timestamp}.[ext]`;
        }
      }
    },
    // Clear output directory before build
    emptyOutDir: true
  }
})
