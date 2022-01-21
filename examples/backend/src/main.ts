import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import { load } from './locales'
import { locales } from './constants'

import type { ResourceSchema } from '../db/message'
import type { Locales } from './constants'

// load resources
const messages = await load<Locales>(locales)

// create i18n instance
const i18n = createI18n<[ResourceSchema], Locales, false>({
  legacy: false,
  locale: 'en',
  messages
})

// setup vue
const app = createApp(App)
// @ts-ignore: this example cannot do type inference on monorepo
app.use(i18n)
app.mount('#app')
