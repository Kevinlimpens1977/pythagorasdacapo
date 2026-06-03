import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

const PROJECT_KOMPAS_MODULE_ID = 'virtual:project-kompas'
const RESOLVED_PROJECT_KOMPAS_MODULE_ID = `\0${PROJECT_KOMPAS_MODULE_ID}`

const projectKompasPlugin = () => ({
  name: 'helix-project-kompas',
  resolveId(id) {
    if (id === PROJECT_KOMPAS_MODULE_ID) return RESOLVED_PROJECT_KOMPAS_MODULE_ID
    return null
  },
  load(id) {
    if (id !== RESOLVED_PROJECT_KOMPAS_MODULE_ID) return null

    const filePath = resolve(process.cwd(), 'PROJECTKOMPAS-HELIX.md')
    const markdown = readFileSync(filePath, 'utf8')
    const stats = statSync(filePath)

    this.addWatchFile(filePath)

    return `
      export const projectKompasMarkdown = ${JSON.stringify(markdown)};
      export const projectKompasUpdatedAt = ${JSON.stringify(stats.mtime.toISOString())};
    `
  }
})

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/__/auth': {
        target: 'https://pythagoras-eoa.firebaseapp.com',
        changeOrigin: true,
        secure: true
      },
      '/__/firebase': {
        target: 'https://pythagoras-eoa.firebaseapp.com',
        changeOrigin: true,
        secure: true
      }
    }
  },
  plugins: [
    tailwindcss(),
    react(),
    projectKompasPlugin()
  ],
})
