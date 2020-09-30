import type { UserConfig } from 'vite'
import i18n from '@intlify/vite-plugin-vue-i18n'

const config: UserConfig = {
  define: {
    __VUE_PROD_DEVTOOLS__: true
  },
  vueCustomBlockTransforms: {
    i18n
  }
}

export default config
