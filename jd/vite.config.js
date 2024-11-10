import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  //反代链接到127.0.0.1:300
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
       
      }
    }

  },
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {

    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
