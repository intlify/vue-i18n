import { createApp } from '@vue/runtime-dom'
import { createI18n } from 'vue-i18n'
import App from './App.vue'

const i18n = createI18n({
  // legacy: false,
  locale: 'en',
  messages: {
    en: {
      // hello: () => 'hello!'
      hello: 'hello!'
    }
  }
})

const app = createApp(App)
app.use(i18n, { globalInstall: false })
console.log('t', i18n.global.t('hello'))
app.mount('#app')
