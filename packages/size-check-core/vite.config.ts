import { defineConfig } from 'vite'

export default defineConfig({
  define: {
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
    'process.env.NODE_ENV': JSON.stringify('production'),
    __INTLIFY_PROD_DEVTOOLS__: false
  },
  resolve: {
    alias: {
      '@intlify/core': '@intlify/core/dist/core.runtime.esm-bundler.mjs'
    }
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  },
  plugins: []
})
