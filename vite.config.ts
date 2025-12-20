import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          'vendor-ui': ['lucide-react', 'recharts'],
          'vendor-utils': ['axios', '@supabase/supabase-js']
        }
      }
    }
  },

  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        configure: (proxy, options) => {
          // Handle API routes by serving from api/ directory
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // This will be handled by vercel dev or we'll add middleware
          });
        }
      }
    }
  },
});
