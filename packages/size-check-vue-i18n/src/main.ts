import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: {
      hello: 'hello!'
    }
  }
})

const app = createApp(App)
app.use(i18n, { globalInstall: false })
console.log('t', i18n.global.t('hello'))
app.mount('#app')
