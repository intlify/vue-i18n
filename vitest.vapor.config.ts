import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { defineConfig, mergeConfig } from 'vitest/config'
import config from './vitest.config'

// Keep all Vapor imports on the ESM runtime from the overridden Vue version.
// Vitest's Node entry does not expose the Vapor APIs.
const rootRequire = createRequire(import.meta.url)
const vuePackage = rootRequire.resolve('vue/package.json')
const vueRequire = createRequire(vuePackage)
const resolveVueRuntime = (id: string, file: string): string =>
  resolve(dirname(vueRequire.resolve(`${id}/package.json`)), 'dist', file)

export default mergeConfig(
  config,
  defineConfig({
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
    },
    resolve: {
      alias: {
        vue: resolve(dirname(vuePackage), 'dist/vue.runtime.esm-bundler.js'),
        '@vue/runtime-vapor': resolveVueRuntime(
          '@vue/runtime-vapor',
          'runtime-vapor.esm-bundler.js'
        ),
        '@vue/runtime-dom': resolveVueRuntime(
          '@vue/runtime-dom',
          'runtime-dom.esm-bundler.js'
        ),
        '@vue/runtime-core': resolveVueRuntime(
          '@vue/runtime-core',
          'runtime-core.esm-bundler.js'
        ),
        '@vue/reactivity': resolveVueRuntime(
          '@vue/reactivity',
          'reactivity.esm-bundler.js'
        ),
        '@vue/shared': resolveVueRuntime('@vue/shared', 'shared.esm-bundler.js')
      }
    },
    test: {
      environment: 'jsdom',
      include: ['./packages/vue-i18n-core/test/vapor.test.ts']
    }
  })
)
