import { createApp } from 'vue'
import App from './App.vue'
import { setupI18n } from './i18n'
import './index.css' with { type: 'css' }
import en from './locales/en.json' with { type: 'json' }
import { setupRouter } from './router'

const i18n = setupI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en
  }
})
const router = setupRouter(i18n)

const app = createApp(App)
app.use(i18n)
app.use(router)
app.mount('#app')
