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
    __INTLIFY_DROP_MESSAGE_COMPILER__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  resolve: {
    alias: {
      '@intlify/core': '@intlify/core/dist/core.esm-bundler.js'
    }
  },
  build: {
    minify: false,
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
