import { renderToString } from '@vue/server-renderer'
import { createSSRApp, defineComponent, h, resolveComponent } from 'vue'
import { createI18n, useI18n } from '../src/index'

// @ts-ignore -- NOTE(kazupon): import mock
// utils
vi.mock('@intlify/shared', async () => {
  const actual = await vi.importActual<object>('@intlify/shared')
  return {
    ...actual,
    warnOnce: vi.fn()
  }
})

test('ssr', async () => {
  const i18n = createI18n({
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

test('component: i18n-t', async () => {
  const i18n = createI18n({
    locale: 'en',
    messages: {}
  })

  const App = defineComponent({
    setup() {
      useI18n({
        locale: 'ja',
        inheritLocale: false,
        messages: {
          ja: { hello: 'やあ！' },
          en: { hello: 'hi!' }
        }
      })
      return () => h(resolveComponent('i18n-t'), { tag: 'p', keypath: 'hello' })
    }
    // template: `<i18n-t tag="p" keypath="hello"/>`
  })
  const app = createSSRApp(App)
  app.use(i18n)

  expect(await renderToString(app)).toMatch(`<p>やあ！</p>`)
})

test('escapeParameter: neutralize script elements in v-html', async () => {
  const i18n = createI18n({
    locale: 'en',
    escapeParameter: true,
    warnHtmlMessage: false,
    messages: {
      en: { hello: '<script>alert(1)</script>hello' }
    }
  })

  const App = defineComponent({
    setup() {
      const { t } = useI18n()
      return () => h('p', { innerHTML: t('hello') })
    }
  })
  const app = createSSRApp(App)
  app.use(i18n)

  // the browser runs a `<script>` in the HTML rendered on the server
  expect(await renderToString(app)).toBe('<p>&lt;script>alert(1)</script>hello</p>')
})

test('escapeParameter: turn unclosed tags in v-html into text', async () => {
  const i18n = createI18n({
    locale: 'en',
    escapeParameter: true,
    warnHtmlMessage: false,
    messages: {
      en: { tag: 'hello <a title="x', element: 'hello <textarea>x' }
    }
  })

  const App = defineComponent({
    setup() {
      const { t } = useI18n()
      return () => [h('p', { innerHTML: t('tag') }), h('p', { innerHTML: t('element') })]
    }
  })
  const app = createSSRApp(App)
  app.use(i18n)

  // on the server, the rest of the page follows the translation, and would be read as a part of the tag
  expect(await renderToString(app)).toBe(
    '<!--[--><p>hello &lt;a title="x</p><p>hello &lt;textarea>x</p><!--]-->'
  )
})
