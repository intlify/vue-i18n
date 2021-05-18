import { createApp } from 'vue'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import type { ResourceSchema } from './locales/schema'

/**
 * if you can specify resource schema to type parameter of `createI18n`,
 * you can make to be type-safe the i18n resources.
 */
const i18n = createI18n<[ResourceSchema], 'en' | 'ja', false>({
  locale: 'en',
  legacy: false,
  fallbackLocale: 'en',
  messages: {
    en
  }
})

createApp(App).use(i18n).mount('#app')
