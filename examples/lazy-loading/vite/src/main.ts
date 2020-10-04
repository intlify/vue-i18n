import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import { setupRouter } from './router'
import { setupI18n } from './i18n'

const i18n = setupI18n()
const router = setupRouter(i18n)

const app = createApp(App)
app.use(i18n)
app.use(router)
app.mount('#app')
