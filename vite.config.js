import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    assetsDir: '.',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    port: 5174,
    strictPort: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  optimizeDeps: {
    include: ['@react-three/fiber', '@react-three/drei', 'three']
  }
});