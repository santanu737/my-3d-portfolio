import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'three', '@react-three/fiber'],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replaceAll('\\', '/')
          if (normalizedId.includes('node_modules/three')) return 'three'
          if (normalizedId.includes('node_modules/@react-three/drei')) return 'drei'
          if (normalizedId.includes('node_modules/@react-three/fiber')) return 'fiber'
          if (normalizedId.includes('node_modules/@react-three/postprocessing')) return 'postprocessing'
          if (normalizedId.includes('node_modules/@react-three')) return 'react-three'
          if (normalizedId.includes('node_modules')) return 'vendor'
        },
      },
    },
  },
})
