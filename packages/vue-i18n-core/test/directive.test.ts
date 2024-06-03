/**
 * @vitest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
// allow any in error
/* eslint-disable @typescript-eslint/no-empty-function */

// utils
import * as shared from '@intlify/shared'
vi.mock('@intlify/shared', async () => {
  const actual = await vi.importActual<object>('@intlify/shared')
  return {
    ...actual,
    warn: vi.fn()
  }
})

import { mount } from './helper'
import { defineComponent, ref, h, withDirectives, resolveDirective } from 'vue'
import { format } from '@intlify/shared'
import {
  compile,
  registerMessageCompiler,
  resolveValue,
  registerMessageResolver,
  fallbackWithLocaleChain,
  registerLocaleFallbacker
} from '@intlify/core-base'
import { createI18n } from '../src/index'
import { errorMessages, I18nErrorCodes } from '../src/errors'

beforeAll(() => {
  registerMessageCompiler(compile)
  registerMessageResolver(resolveValue)
  registerLocaleFallbacker(fallbackWithLocaleChain)
})

describe('basic', () => {
  test('literal', async () => {
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
        // <p v-t="'hello'"></p>
        const t = resolveDirective('t')
        return () => {
          return withDirectives(h('p'), [[t!, 'hello']])
        }
      }
    })
    const wrapper = await mount(App, i18n)

    expect(wrapper.html()).toEqual('<p>hello!</p>')
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
    const wrapper = await mount(App, i18n)

    expect(wrapper.html()).toEqual('<p>hello!</p>')
  })
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
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual('<p>こんにちは、kazupon！</p>')
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
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual('<p>2 bananas</p>')
})

test('legacy mode', async () => {
  const i18n = createI18n({
    legacy: true,
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
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual('<p>hello!</p>')
})

test('fallback to global scope', async () => {
  const i18n = createI18n({
    locale: 'en',
    messages: {
      en: {
        hello: 'hello!'
      }
    }
  })

  const Child = defineComponent({
    setup() {
      // <p v-t="'hello'"></p>
      const t = resolveDirective('t')
      return () => {
        return withDirectives(h('p'), [[t!, 'hello']])
      }
    }
  })

  const App = defineComponent({
    setup() {
      return () => h('div', [h(Child)])
    }
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual('<div><p>hello!</p></div>')
})

test('using in template', async () => {
  const i18n = createI18n({
    locale: 'en',
    messages: {
      en: {
        hello: 'hello!'
      }
    }
  })

  const App = defineComponent({
    template: `<p v-t="'hello'"></p>`
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual('<p>hello!</p>')
})

describe('errors', () => {
  let org: any // eslint-disable-line @typescript-eslint/no-explicit-any
  let spy: any // eslint-disable-line @typescript-eslint/no-explicit-any
  beforeEach(() => {
    org = console.warn
    spy = vi.fn()
    console.warn = spy
  })
  afterEach(() => {
    console.warn = org
  })

  test(errorMessages[I18nErrorCodes.REQUIRED_VALUE], async () => {
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
        // <p v-t="{ locale: 'ja' }"></p>
        const t = resolveDirective('t')
        return () => {
          return withDirectives(h('p'), [[t!, { locale: 'ja' }]])
        }
      }
    })

    let error: Error | null = null
    try {
      await mount(App, i18n)
    } catch (e: any) {
      error = e
    }
    expect(error!.message).toEqual(
      format(errorMessages[I18nErrorCodes.REQUIRED_VALUE], 'path')
    )
  })

  test(errorMessages[I18nErrorCodes.INVALID_VALUE], async () => {
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
        // <p v-t="1"></p>
        const t = resolveDirective('t')
        return () => withDirectives(h('p'), [[t!, 1]])
      }
    })

    let error: Error | null = null
    try {
      await mount(App, i18n)
    } catch (e: any) {
      error = e
    }
    expect(error!.message).toEqual(errorMessages[I18nErrorCodes.INVALID_VALUE])
  })
})

/* eslint-enable @typescript-eslint/no-empty-function */
