import { defineComponent, createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { createI18n, useI18n } from '../src/index'

test('composable mode', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {}
  })

  const App = defineComponent({
    setup() {
      return useI18n({
        locale: 'ja',
        inheritLocale: false,
        messages: {
          ja: { hello: 'こんにちは！' },
          en: { hello: 'hello!' }
        }
      })
    },
    template: `<p>{{ t('hello') }}</p>`
  })
  const app = createSSRApp(App)
  app.use(i18n)

  expect(await renderToString(app)).toMatch(`<p>こんにちは！</p>`)
})

test('legacy mode', async () => {
  const i18n = createI18n({
    locale: 'ja',
    messages: {
      ja: { hello: 'こんにちは！' },
      en: { hello: 'hello!' }
    }
  })

  const App = defineComponent({
    template: `<p>{{ $t('hello') }}</p>`
  })
  const app = createSSRApp(App)
  app.use(i18n)

  expect(await renderToString(app)).toMatch(`<p>こんにちは！</p>`)
})

test('component: i18n-t', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {}
  })

  const App = defineComponent({
    setup() {
      return useI18n({
        locale: 'ja',
        inheritLocale: false,
        messages: {
          ja: { hello: 'こんにちは！' },
          en: { hello: 'hello!' }
        }
      })
    },
    template: `<i18n-t tag="p" keypath="hello"/>`
  })
  const app = createSSRApp(App)
  app.use(i18n)

  expect(await renderToString(app)).toMatch(`<p>こんにちは！</p>`)
})
