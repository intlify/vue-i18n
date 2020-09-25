import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import en from './locales/en.json'
import ja from './locales/ja.json'

const i18n = createI18n({
  locale: 'en',
  messages: {
    en,
    ja
  }
})

createApp(App).use(i18n).mount('#app')
