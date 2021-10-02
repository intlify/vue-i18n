const path = require('path')
const vuePlugin = require('@vitejs/plugin-vue')
const vueJsx = require('@vitejs/plugin-vue-jsx')
const vueI18n = require('@intlify/vite-plugin-vue-i18n').default // TODO

/**
 * @type {import('vite').UserConfig}
 */
module.exports = {
  plugins: [
    vuePlugin(),
    vueJsx(),
    {
      name: 'virtual',
      resolveId(id) {
        if (id === '@foo') {
          return id
        }
      },
      load(id) {
        if (id === '@foo') {
          return `export default { msg: 'hi' }`
        }
      }
    },
    vueI18n({
      include: path.resolve(__dirname, './src/locales/**')
    })
  ],
  build: {
    minify: false
  }
}
