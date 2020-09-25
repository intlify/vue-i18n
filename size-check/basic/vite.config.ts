import { resolve } from 'path'
import { BuildConfig } from 'vite'

const config: BuildConfig = {
  minify: false,
  rollupInputOptions: {
    input: resolve(__dirname, './src/main.js'),
    external: ['vue'],
    treeshake: {
      moduleSideEffects: false
    }
  }
}

export default config
