import { resolve } from 'path'
import { BuildConfig } from 'vite'

const config: BuildConfig = {
  minify: false,
  define: {
    __VUE_I18N_LEGACY_API__: false,
    __VUE_I18N_FULL_INSTALL__: true
  },
  rollupInputOptions: {
    input: resolve(__dirname, './src/main.js'),
    external: ['vue'],
    treeshake: {
      moduleSideEffects: false
    }
  }
}

export default config
