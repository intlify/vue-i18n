import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'

/**
 * import locale messages resoruce from json for global scope
 */
import enUS from './locales/en-US.json'
import jaJP from './locales/ja-JP.json'

/**
 * setup vue-i18n with i18n resources with global type definition.
 * if you define the i18n resource schema in your `*.d.ts`, these is checked with typeScript.
 * you can check global type defition at `./vue-i18n.d.ts`
 */
const i18n = createI18n<false>({
  legacy: false,
  locale: 'ja-JP',
  fallbackLocale: 'en-US',
  messages: {
    'en-US': enUS,
    'ja-JP': jaJP
  },
  datetimeFormats: {
    'ja-JP': {
      short: {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
        timezone: 'Asia/Tokyo'
      }
    }
  },
  numberFormats: {
    'ja-JP': {
      currency: {
        style: 'currency',
        currencyDisplay: 'symbol',
        currency: 'JPY'
      }
    }
  }
})

createApp(App).use(i18n).mount('#app')
