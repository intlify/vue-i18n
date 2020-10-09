import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import { setupRouter } from './router'
import { setupI18n } from './i18n'

const i18n = setupI18n()
const router = setupRouter(i18n)

createApp(App).use(router).use(i18n).mount('#app')
