import { createApp, defineCustomElement } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import I18nHost from './components/I18nHost.ce.vue'
import HelloI18n from './components/HelloI18n.ce.vue'
import HelloBlock from './components/HelloBlock.ce.vue'

const I18nHostElement = defineCustomElement(I18nHost)
const HelloI18nElement = defineCustomElement(HelloI18n)
const HelloBlockElement = defineCustomElement(HelloBlock)
customElements.define('i18n-host', I18nHostElement)
customElements.define('hello-i18n', HelloI18nElement)
customElements.define('hello-block', HelloBlockElement)

const i18n = createI18n<false>({
  legacy: false,
  locale: 'en',
  messages: {}
})

createApp(App).use(i18n).mount('#app')
