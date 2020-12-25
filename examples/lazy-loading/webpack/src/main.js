import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import { setupRouter } from './router'
import { setupI18n } from './i18n'
import en from './locales/en.json'

const i18n = setupI18n({
  globalInjection: true,
  legacy: false,
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
