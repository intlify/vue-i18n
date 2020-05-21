/**
 * @jest-environment jsdom
 */

/* eslint-disable @typescript-eslint/no-empty-function */

// utils
jest.mock('../src/utils', () => ({
  ...jest.requireActual('../src/utils'),
  warn: jest.fn()
}))
import { warn } from '../src/utils'

import { mount } from './helper'
import { defineComponent, ref, h, withDirectives, resolveDirective } from 'vue'
import { createI18n } from '../src/i18n'
import { errorMessages, I18nErrorCodes } from '../src/errors'
import { getWarnMessage, I18nWarnCodes } from '../src/warnings'
import { format } from '../src/utils'

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
          return withDirectives(h('p'), [[t, 'hello']])
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
          return withDirectives(h('p'), [[t, msg.value]])
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
      // <p v-t="{ path: 'hello', locale: 'ja', args: { name } }"></p>
      const name = ref('kazupon')
      const t = resolveDirective('t')
      return () => {
        return withDirectives(h('p'), [[t, { path: 'hello', locale: 'ja', args: { name: name.value } }]])
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
        return withDirectives(h('p'), [[t, { path: 'banana', choice: 2 }]])
      }
    }
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual('<p>2 bananas</p>')
})

test('preserve modifier', async () => {
  const mockWarn = warn as jest.MockedFunction<typeof warn>
  mockWarn.mockImplementation(() => {})

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
      // <p v-t.preserve="'hello'"></p>
      const t = resolveDirective('t')
      return () => {
        return withDirectives(h('p'), [[t, 'hello', '', { preserve: true }]])
      }
    }
  })
  const wrapper = await mount(App, i18n)

  expect(mockWarn).toHaveBeenCalledTimes(1)
  expect(mockWarn.mock.calls[0][0]).toEqual(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_PRESERVE))
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
        return withDirectives(h('p'), [[t, 'hello']])
      }
    }
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual('<p>hello!</p>')
})

describe('errors', () => {
  test(errorMessages[I18nErrorCodes.NOT_FOUND_COMPOSER], async () => {
    const i18n = createI18n({
      locale: 'en',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })
    const spy = jest.spyOn(i18n, 'global', 'get')
    spy.mockImplementation(() => null)

    const App = defineComponent({
      setup() {
        const t = resolveDirective('t')
        return () => {
          return withDirectives(h('p'), [[t, { locale: 'ja' }]])
        }
      }
    })

    let error: Error | null = null
    try {
      await mount(App, i18n)
    } catch (e) {
      error = e
    }
    expect(error.message).toEqual(errorMessages[I18nErrorCodes.NOT_FOUND_COMPOSER])
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
          return withDirectives(h('p'), [[t, { locale: 'ja' }]])
        }
      }
    })

    let error: Error | null = null
    try {
      await mount(App, i18n)
    } catch (e) {
      error = e
    }
    expect(error.message).toEqual(format(errorMessages[I18nErrorCodes.REQUIRED_VALUE], 'path'))
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
        return () => withDirectives(h('p'), [[t, 1]])
      }
    })

    let error: Error | null = null
    try {
      await mount(App, i18n)
    } catch (e) {
      error = e
    }
    expect(error.message).toEqual(errorMessages[I18nErrorCodes.INVALID_VALUE])
  })
})

/* eslint-enable @typescript-eslint/no-empty-function */
