import { h, defineComponent, resolveComponent, createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import {
  compileToFunction,
  registerMessageCompiler,
  resolveValue,
  registerMessageResolver,
  fallbackWithLocaleChain,
  registerLocaleFallbacker
} from '@intlify/core-base'
import { createI18n, useI18n } from '../src/index'

beforeAll(() => {
  registerMessageCompiler(compileToFunction)
  registerMessageResolver(resolveValue)
  registerLocaleFallbacker(fallbackWithLocaleChain)
})

test('composition mode', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {}
  })

  const App = defineComponent({
    setup() {
      const { t } = useI18n({
        locale: 'ja',
        inheritLocale: false,
        messages: {
          ja: { hello: 'こんにちは！' },
          en: { hello: 'hello!' }
        }
      })
      return () => h('p', t('hello'))
    }
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

  // NOTE: template: `<p>{{ $t('hello') }}</p>`
  const App = () => h('p', i18n.global.t('hello'))
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
      useI18n({
        locale: 'ja',
        inheritLocale: false,
        messages: {
          ja: { hello: 'こんにちは！' },
          en: { hello: 'hello!' }
        }
      })
      return () => h(resolveComponent('i18n-t'), { tag: 'p', keypath: 'hello' })
    }
    // template: `<i18n-t tag="p" keypath="hello"/>`
  })
  const app = createSSRApp(App)
  app.use(i18n)

  expect(await renderToString(app)).toMatch(`<p>こんにちは！</p>`)
})
