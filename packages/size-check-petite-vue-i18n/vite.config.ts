import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
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
    __VUE_I18N_LEGACY_API__: false,
    __VUE_I18N_FULL_INSTALL__: false,
    __VUE_PROD_DEVTOOLS__: false,
    __INTLIFY_DROP_MESSAGE_COMPILER__: true,
    __INTLIFY_PROD_DEVTOOLS__: false,
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  resolve: {
    alias: {
      'vue-i18n': 'petite-vue-i18n/dist/petite-vue-i18n.runtime.esm-bundler.js'
      // 'vue-i18n': 'petite-vue-i18n/dist/petite-vue-i18n.esm-bundler.js'
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
  plugins: [vue()]
})
