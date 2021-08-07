import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import execa from 'execa'

const commit = execa.sync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7)
console.log('commit', commit)

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __COMMIT__: JSON.stringify(commit)
  },
  plugins: [vue()]
})
