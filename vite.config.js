import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  // Ensure correct MIME types (moved inside the configuration object)
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})