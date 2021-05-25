import { createApp } from 'vue'
import App from './App.vue'

import { createI18n } from 'vue-i18n'
import enUS from './locales/en-US.json'

import type { MessageSchema, NumberSchema } from './locales/schema'
// type MessageSchema = typeof enUS

/**
 * if you can specify resource schema to type parameter of `createI18n`,
 * you can make to be type-safe the i18n resources.
 */

// const i18n = createI18n<[MessageSchema], 'en-US'>({
const i18n = createI18n<
  {
    message: MessageSchema
    number: NumberSchema
  },
  'en-US',
  false
>({
  locale: 'en-US',
  legacy: false,
  messages: {
    'en-US': enUS
  },
  numberFormats: {
    'en-US': {
      currency: {
        style: 'currency',
        currencyDisplay: 'symbol',
        currency: 'USD'
      }
    }
  }
})

createApp(App).use(i18n).mount('#app')
