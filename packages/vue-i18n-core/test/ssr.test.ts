import {
  compile,
  fallbackWithLocaleChain,
  registerLocaleFallbacker,
  registerMessageCompiler,
  registerMessageResolver,
  resolveValue
} from '@intlify/core-base'
import { renderToString } from '@vue/server-renderer'
import { createSSRApp, defineComponent, h, resolveComponent } from 'vue'
import { createI18n, useI18n } from '../src/index'

// utils
import * as shared from '@intlify/shared'
vi.mock('@intlify/shared', async () => {
  const actual = await vi.importActual<object>('@intlify/shared')
  return {
    ...actual,
    warnOnce: vi.fn()
  }
})

beforeAll(() => {
  registerMessageCompiler(compile)
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
  const mockWarn = vi.spyOn(shared, 'warnOnce')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  mockWarn.mockImplementation(() => {})

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
