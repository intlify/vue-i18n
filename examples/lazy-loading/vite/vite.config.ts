import vueI18n from '@intlify/unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    vueI18n({
      include: path.resolve(import.meta.dirname, './src/locales/**')
    })
  ]
})
