import path from 'path'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

const config = {
  external: ['@vue/runtime-dom'],
  output: {
    file: path.resolve(__dirname, './dist/index.js'),
    format: 'es'
  },
  input: path.resolve(__dirname, './src/index.js'),
  plugins: [
    replace({
      __DEV__: false,
      // this is only used during tests
      __TEST__: false,
      // If the build is expected to run directly in the browser (global / esm builds)
      __BROWSER__: true,
      // is targeting bundlers?
      __BUNDLER__: false,
      __GLOBAL__: false,
      __RUNTIME__: true,
      // is targeting Node (SSR)?
      __NODE_JS__: false,
      // other flags
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_I18N_LEGACY_API__: false,
      __VUE_I18N_FULL_INSTALL__: false,
      __INTLIFY_PROD_DEVTOOLS__: false,
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    resolve(),
    commonjs(),
    terser({
      format: {
        comments: false
      },
      module: true,
      compress: {
        ecma: 2015,
        pure_getters: true
      }
    })
  ]
}

export default config
