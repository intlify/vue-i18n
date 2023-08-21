import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

import './style.css'
import App from './App.vue'
import { messageCompiler } from './compilation'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messageCompiler,
  messages: {
    en: {
      hello: 'hello world!',
      greeting: 'hi, {name}!',
      photo: `You have {numPhotos, plural,
        =0 {no photos.}
        =1 {one photo.}
        other {# photos.}
      }`
    }
  }
})

createApp(App).use(i18n).mount('#app')
