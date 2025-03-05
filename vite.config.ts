import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: false, // Allow fallback to other ports if 3000 is in use
    host: '0.0.0.0', // Listen on all interfaces
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    watch: {
      usePolling: true, // Better for containerized environments
    },
    hmr: {
      // HMR Configuration for e2b sandbox
      protocol: 'ws', // Use WebSocket protocol
      host: '0.0.0.0', // Match the network interface
      port: 3000, // Same as server port
      clientPort: 3000, // Important for proper client connections
      path: '/hmr/', // Specific path for HMR WebSockets
      timeout: 60000, // Increase timeout for slow connections
      overlay: true // Show error overlay for easier debugging
    },
    allowedHosts: ['all', '.blink.new'] // Allow all hosts and specifically .blink.new
  },
  preview: {
    port: 3000,
    host: '0.0.0.0',
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
})