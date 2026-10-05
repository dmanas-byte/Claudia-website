import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), glsl({ compress: true })],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // three.js + fiber + drei + postprocessing live in one lazily-loaded chunk
          if (
            id.includes('node_modules/three') ||
            id.includes('node_modules/@react-three') ||
            id.includes('node_modules/postprocessing') ||
            id.includes('node_modules/maath') ||
            id.includes('node_modules/@monogrid') ||
            id.includes('node_modules/three-stdlib') ||
            id.includes('node_modules/three-mesh-bvh')
          ) {
            return 'three'
          }
          if (id.includes('node_modules/gsap')) return 'gsap'
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'react'
        },
      },
    },
  },
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 },
})
