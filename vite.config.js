import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Her derlemede otomatik olarak benzersiz bir version.json üreten Vite eklentisi
function generateVersionPlugin() {
  return {
    name: 'generate-version-plugin',
    buildStart() {
      const publicDir = path.resolve(__dirname, 'public')
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true })
      }
      const versionData = {
        buildTime: Date.now(),
        version: new Date().toISOString()
      }
      fs.writeFileSync(
        path.join(publicDir, 'version.json'),
        JSON.stringify(versionData, null, 2)
      )
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), generateVersionPlugin()],
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  }
})
