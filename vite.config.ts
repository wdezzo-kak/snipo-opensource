import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'

function copyManifest() {
  return {
    name: 'copy-manifest',
    buildStart() {
      mkdirSync(resolve(__dirname, 'dist'), { recursive: true })
    },
    closeBundle() {
      const manifest = JSON.parse(readFileSync(resolve(__dirname, 'manifest.json'), 'utf-8'))
      const distFiles = readdirSync(resolve(__dirname, 'dist/assets'))

      const backgroundFile = distFiles.find(f => f.startsWith('background-') && f.endsWith('.js'))
      const contentFile = distFiles.find(f => f.startsWith('content-') && f.endsWith('.js'))
      const injectedFile = distFiles.find(f => f.startsWith('injected-') && f.endsWith('.js'))

      if (backgroundFile) manifest.background.service_worker = `assets/${backgroundFile}`
      if (contentFile && injectedFile) {
        manifest.content_scripts[0].js = [
          `assets/${contentFile}`,
          `assets/${injectedFile}`
        ]
      }

      const icons = ['icon.png', 'icon48.png', 'icon128.png']
      icons.forEach(icon => {
        if (existsSync(resolve(__dirname, 'public', icon))) {
          copyFileSync(resolve(__dirname, 'public', icon), resolve(__dirname, 'dist', icon))
        }
      })

      writeFileSync(resolve(__dirname, 'dist/manifest.json'), JSON.stringify(manifest, null, 2))
    }
  }
}

export default defineConfig({
  plugins: [vue(), copyManifest()],
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
  },
  publicDir: 'public'
})