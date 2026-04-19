import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { URL } from 'node:url'
import { defineConfig } from 'vite'
import { execSync } from 'node:child_process'

const commit = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).slice(0, 7)
console.log('commit', commit)

const __dirname = path.dirname(new URL(import.meta.url).pathname)

// https://vitejs.dev/config/
const config = defineConfig({
  define: {
    __COMMIT__: JSON.stringify(commit),
    __BROWSER__: false
  },
  resolve: {
    alias: {
      '@intlify/message-compiler': path.resolve(__dirname, '../message-compiler/src/index.ts')
    }
  },
  plugins: [vue()]
})

export default config
