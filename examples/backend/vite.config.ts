import vueI18n from '@intlify/unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import bodyParser from 'body-parser'
import { defineConfig } from 'vite'

/**
 * These imports simulate the loading of resources from the database
 */
import en from './db/en.json' // english resources
import ja from './db/ja.json' // japanese resources

import type { ServerResponse } from 'http'
import type { Plugin } from 'vite'
import type { ResourceSchema } from './db/message'

function serialize(res: ServerResponse, locales: ResourceSchema): void {
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify(locales))
}

/**
 * This plugin is simulated back-end server
 */
const backend = (): Plugin => ({
  name: 'backend',
  configureServer(server) {
    server.middlewares.use(bodyParser.json())
    // `/api/resources/en` endpoint returns the response as `en` resources
    server.middlewares.use('/api/resources/en', (req, res) => {
      serialize(res, en)
      res.end()
    })
    // `/api/resources/ja` endpoint returns the response as `ja` resources
    server.middlewares.use('/api/resources/ja', (req, res) => {
      serialize(res, ja)
      res.end()
    })
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext'
  },
  plugins: [backend(), vue(), vueI18n()]
})
