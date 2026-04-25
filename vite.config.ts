import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background/background.ts'),
        content: resolve(__dirname, 'src/content/content.ts'),
        injected: resolve(__dirname, 'src/content/injected.ts'),
        sidepanel: resolve(__dirname, 'sidepanel.html')
      }
    }
  }
})