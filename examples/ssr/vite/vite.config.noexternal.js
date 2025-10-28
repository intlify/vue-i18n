import config from './vite.config.js'

/**
 * @type {import('vite').UserConfig}
 */
export default Object.assign(config, {
  ssr: {
    noExternal: /./
  },
  resolve: {
    // necessary because vue.ssrUtils is only exported on cjs modules
    alias: [
      {
        find: '@vue/runtime-dom',
        replacement: '@vue/runtime-dom/dist/runtime-dom.cjs.js'
      },
      {
        find: '@vue/runtime-core',
        replacement: '@vue/runtime-core/dist/runtime-core.cjs.js'
      }
    ]
  }
})
