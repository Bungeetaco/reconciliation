import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Handle base URL for both GitHub Pages and self-hosting
const base = process.env.GITHUB_PAGES === 'true' ? '/reconciliation/' : '/';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base,  // Use the conditional base URL
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'lodash',
            'xlsx',
            'papaparse'
          ],
          'ui': [
            'lucide-react',
            '@/components/ui/card'
          ]
        },
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 600
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lodash', 'xlsx', 'papaparse', 'lucide-react']
  }
});