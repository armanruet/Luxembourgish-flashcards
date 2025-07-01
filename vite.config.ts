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
        },
        // Manual chunks for better code splitting and smaller file sizes
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          ui: ['lucide-react', 'recharts'],
          store: ['zustand'],
          utils: ['date-fns', 'react-hook-form', 'react-hot-toast']
        }
      }
    },
    // Clear output directory before build
    emptyOutDir: true,
    // Reduce chunk size warning limit
    chunkSizeWarningLimit: 300
  }
})
