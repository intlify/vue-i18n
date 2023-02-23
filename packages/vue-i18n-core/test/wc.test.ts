/**
 * @vitest-environment jsdom
 */

import {
  h,
  provide,
  nextTick,
  defineCustomElement,
  getCurrentInstance
} from 'vue'
import {
  compileToFunction,
  registerMessageCompiler,
  resolveValue,
  registerMessageResolver,
  fallbackWithLocaleChain,
  registerLocaleFallbacker
} from '@intlify/core-base'
import { createI18n, useI18n, I18nInjectionKey } from '../src/index'

import type { VueElement, ComponentOptions } from 'vue'

const container = document.createElement('div')
document.body.appendChild(container)

beforeAll(() => {
  registerMessageCompiler(compileToFunction)
  registerMessageResolver(resolveValue)
  registerLocaleFallbacker(fallbackWithLocaleChain)
})

beforeEach(() => {
  container.innerHTML = ''
})

test('basic', async () => {
  const i18n = createI18n<false>({
    legacy: false,
    locale: 'en',
    messages: {
      en: {
        hello: 'hello web components!'
      },
      ja: {
        hello: 'こんにちは Web コンポーネント！'
      }
    }
  })

  const Provider = defineCustomElement({
    setup() {
      provide(I18nInjectionKey, i18n)
      return () => h('my-consumer')
    }
  })
  customElements.define('my-provider', Provider)
  const Consumer = defineCustomElement({
    setup() {
      const { t } = useI18n()
      return () => h('div', t('hello'))
    }
  })
  customElements.define('my-consumer', Consumer)

  container.innerHTML = `<my-provider></my-provider>`
  await nextTick()
  const provider = container.childNodes[0] as VueElement
  const consumer = provider.shadowRoot!.childNodes[0] as VueElement
  expect(consumer.shadowRoot!.innerHTML).toBe(
    `<div>hello web components!</div>`
  )

  i18n.global.locale.value = 'ja'
  await nextTick()
  expect(consumer.shadowRoot!.innerHTML).toBe(
    `<div>こんにちは Web コンポーネント！</div>`
  )
})

test('custom blocks', async () => {
  const i18n = createI18n<false>({
    legacy: false,
    locale: 'en',
    messages: {
      en: {
        hello: 'hello web components!'
      },
      ja: {
        hello: 'こんにちは Web コンポーネント！'
      }
    }
  })

  const Provider = defineCustomElement({
    setup() {
      provide(I18nInjectionKey, i18n)
      return () => h('my-child-block')
    }
  })
  customElements.define('my-provider-block', Provider)
  const Child = defineCustomElement({
    setup() {
      const instance = getCurrentInstance()
      if (instance == null) {
        throw new Error()
      }
      const options = instance.type as ComponentOptions
      options.__i18n = [
        {
          locale: 'en',
          resource: { foo: 'foo!' }
        },
        {
          locale: 'ja',
          resource: { foo: 'ふー！' }
        }
      ]
      const { t } = useI18n({
        inheritLocale: true,
        useScope: 'local'
      })
      return () => h('div', t('foo'))
    }
  })
  customElements.define('my-child-block', Child)

  container.innerHTML = `<my-provider-block></my-provider-block>`
  await nextTick()
  const provider = container.childNodes[0] as VueElement
  const child = provider.shadowRoot!.childNodes[0] as VueElement
  expect(child.shadowRoot!.innerHTML).toBe(`<div>foo!</div>`)

  i18n.global.locale.value = 'ja'
  await nextTick()
  expect(child.shadowRoot!.innerHTML).toBe(`<div>ふー！</div>`)
})
