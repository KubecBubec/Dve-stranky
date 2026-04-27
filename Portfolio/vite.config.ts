import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync } from 'fs'
import { resolve } from 'path'

// Plugin na kopírovanie sitemap.xml a robots.txt do dist
const copySeoFiles = () => {
  return {
    name: 'copy-seo-files',
    closeBundle() {
      const root = process.cwd()
      
      // Kopírovanie sitemap.xml
      if (existsSync(resolve(root, 'sitemap.xml'))) {
        copyFileSync(resolve(root, 'sitemap.xml'), resolve(root, 'dist', 'sitemap.xml'))
        console.log('✓ Copied sitemap.xml to dist/')
      } else {
        console.warn('⚠ sitemap.xml not found in root')
      }
      
      // Kopírovanie robots.txt
      if (existsSync(resolve(root, 'robots.txt'))) {
        copyFileSync(resolve(root, 'robots.txt'), resolve(root, 'dist', 'robots.txt'))
        console.log('✓ Copied robots.txt to dist/')
      } else {
        console.warn('⚠ robots.txt not found in root')
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copySeoFiles()],
  // Explicitne načítaj environment variables
  envPrefix: 'VITE_',
})

