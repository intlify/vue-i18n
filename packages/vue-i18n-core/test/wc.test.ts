/**
 * @vitest-environment jsdom
 */

import {
  compile,
  fallbackWithLocaleChain,
  registerLocaleFallbacker,
  registerMessageCompiler,
  registerMessageResolver,
  resolveValue
} from '@intlify/core-base'
import { defineCustomElement, h, nextTick, provide } from 'vue'
import { createI18n, I18nInjectionKey, useI18n } from '../src/index'
import { getCurrentInstance } from '../src/utils'
import { randStr } from './helper'

import type { ComponentOptions, VueElement } from 'vue'

const container = document.createElement('div')
document.body.appendChild(container)

beforeAll(() => {
  registerMessageCompiler(compile)
  registerMessageResolver(resolveValue)
  registerLocaleFallbacker(fallbackWithLocaleChain)
})

beforeEach(() => {
  container.innerHTML = ''
})

test('basic', async () => {
  const i18n = createI18n({
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

  const randCusumerTag = `my-consumer-${randStr()}`
  const randProviderTag = `my-provider-${randStr()}`

  const Provider = defineCustomElement({
    setup() {
      provide(I18nInjectionKey, i18n)
      return () => h(randCusumerTag)
    }
  })
  customElements.define(randProviderTag, Provider)
  const Consumer = defineCustomElement({
    setup() {
      const { t } = useI18n()
      return () => h('div', t('hello'))
    }
  })
  customElements.define(randCusumerTag, Consumer)

  container.innerHTML = `<${randProviderTag}></${randProviderTag}>`
  await nextTick()
  const provider = container.childNodes[0] as VueElement
  const consumer = provider.shadowRoot!.childNodes[0] as VueElement
  expect(consumer.shadowRoot!.innerHTML).toBe(`<div>hello web components!</div>`)

  i18n.global.locale.value = 'ja'
  await nextTick()
  expect(consumer.shadowRoot!.innerHTML).toBe(`<div>こんにちは Web コンポーネント！</div>`)
})

test('custom blocks', async () => {
  const i18n = createI18n({
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

  const randChildBlockTag = `my-child-block-${randStr()}`
  const randProviderBlockTag = `my-provider-block-${randStr()}`

  const Provider = defineCustomElement({
    setup() {
      provide(I18nInjectionKey, i18n)
      return () => h(randChildBlockTag)
    }
  })
  customElements.define(randProviderBlockTag, Provider)
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
  customElements.define(randChildBlockTag, Child)

  container.innerHTML = `<${randProviderBlockTag}></${randProviderBlockTag}>`
  await nextTick()
  const provider = container.childNodes[0] as VueElement
  const child = provider.shadowRoot!.childNodes[0] as VueElement
  expect(child.shadowRoot!.innerHTML).toBe(`<div>foo!</div>`)

  i18n.global.locale.value = 'ja'
  await nextTick()
  expect(child.shadowRoot!.innerHTML).toBe(`<div>ふー！</div>`)
})
