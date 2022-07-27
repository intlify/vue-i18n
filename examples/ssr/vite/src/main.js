import App from './App.vue'
import { createSSRApp } from 'vue'
import { createRouter } from './router'
import { createI18n } from './i18n'

// SSR requires a fresh app instance per request, therefore we export a function
// that creates a fresh app instance. If using Vuex, we'd also be creating a
// fresh store here.
export function createApp() {
  const app = createSSRApp(App)
  const router = createRouter()
  const i18n = createI18n()
  app.use(router)
  app.use(i18n)
  return { app, router }
}
