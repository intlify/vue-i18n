import { h, createApp } from '@vue/runtime-dom'
import { createI18n, useI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      hello: () => 'hello!'
    }
  }
})

const app = createApp({
  setup() {
    const { t } = useI18n({ useScope: 'global' })
    return () => h('div', t('hello'))
  }
})
app.use(i18n, { globalInstall: false })
console.log('t', i18n.global.t('hello'))
app.mount('#app')
