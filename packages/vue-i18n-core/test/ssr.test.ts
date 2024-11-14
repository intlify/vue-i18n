import {
  compile,
  fallbackWithLocaleChain,
  registerLocaleFallbacker,
  registerMessageCompiler,
  registerMessageResolver,
  resolveValue
} from '@intlify/core-base'
import { renderToString } from '@vue/server-renderer'
import {
  createSSRApp,
  defineComponent,
  h,
  ref,
  resolveComponent,
  resolveDirective,
  withDirectives
} from 'vue'
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

describe('custom directive: v-t', () => {
  test('basic', async () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'en',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    const App = defineComponent({
      setup() {
        // <p v-t="'hello'"></p>
        const t = resolveDirective('t')
        return () => {
          return withDirectives(h('p'), [[t!, 'hello']])
        }
      }
    })
    const app = createSSRApp(App)
    app.use(i18n)

    expect(await renderToString(app)).toEqual('<p>hello!</p>')
  })

  test('binding', async () => {
    const i18n = createI18n({
      locale: 'en',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    const App = defineComponent({
      setup() {
        // <p v-t="msg"></p>
        const msg = ref('hello')
        const t = resolveDirective('t')
        return () => {
          return withDirectives(h('p'), [[t!, msg.value]])
        }
      }
    })
    const app = createSSRApp(App)
    app.use(i18n)

    expect(await renderToString(app)).toEqual('<p>hello!</p>')
  })

  test('object literal', async () => {
    const i18n = createI18n({
      locale: 'en',
      messages: {
        en: {
          hello: 'hello, {name}!'
        },
        ja: {
          hello: 'こんにちは、{name}！'
        }
      }
    })

    const App = defineComponent({
      setup() {
        // <p v-t="{ path: 'hello', locale: 'ja', args: { name: name.value } }"></p>
        const name = ref('kazupon')
        const t = resolveDirective('t')
        return () => {
          return withDirectives(h('p'), [
            [t!, { path: 'hello', locale: 'ja', args: { name: name.value } }]
          ])
        }
      }
    })
    const app = createSSRApp(App)
    app.use(i18n)

    expect(await renderToString(app)).toEqual('<p>こんにちは、kazupon！</p>')
  })

  test('plural', async () => {
    const i18n = createI18n({
      locale: 'en',
      messages: {
        en: {
          banana: 'no bananas | {n} banana | {n} bananas'
        }
      }
    })

    const App = defineComponent({
      setup() {
        // <p v-t="{ path: 'banana', choice: 2 }"></p>
        const t = resolveDirective('t')
        return () => {
          return withDirectives(h('p'), [[t!, { path: 'banana', choice: 2 }]])
        }
      }
    })
    const app = createSSRApp(App)
    app.use(i18n)

    expect(await renderToString(app)).toEqual('<p>2 bananas</p>')
  })
})
