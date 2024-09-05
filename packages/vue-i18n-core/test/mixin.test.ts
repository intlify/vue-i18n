/**
 * @vitest-environment jsdom
 */

// utils
import * as shared from '@intlify/shared'
vi.mock('@intlify/shared', async () => {
  const actual = await vi.importActual<object>('@intlify/shared')
  return {
    ...actual,
    warnOnce: vi.fn()
  }
})

import {
  compile,
  fallbackWithLocaleChain,
  registerLocaleFallbacker,
  registerMessageCompiler,
  registerMessageResolver,
  resolveValue
} from '@intlify/core-base'
import { defineComponent, nextTick } from 'vue'
import { errorMessages, I18nErrorCodes } from '../src/errors'
import { createI18n } from '../src/index'
import { VueI18n } from '../src/legacy'
import { mount } from './helper'

beforeAll(() => {
  registerMessageCompiler(compile)
  registerMessageResolver(resolveValue)
  registerLocaleFallbacker(fallbackWithLocaleChain)
})

describe('beforeCreate', () => {
  test('i18n option', async () => {
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
      template: `<p>{{ $t('bye') }}</p>`,
      i18n: {
        locale: 'ja',
        sync: false,
        messages: {
          ja: {
            bye: 'さようなら'
          }
        }
      }
    })
    const { html } = await mount(App, i18n)

    expect(html()).toEqual('<p>さようなら</p>')
  })

  test('__i18n option', async () => {
    const i18n = createI18n({
      legacy: true,
      locale: 'en',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    const messages = {
      en: {
        bye: 'good bye!'
      }
    }
    const App = defineComponent({
      template: `<p>{{ $t('bye') }}</p>`,
      __i18n: [
        {
          locale: '',
          resource: messages as any // eslint-disable-line @typescript-eslint/no-explicit-any
        }
      ]
    })
    const { html } = await mount(App, i18n)

    expect(html()).toEqual('<p>good bye!</p>')
  })
})

test('$t', async () => {
  const i18n = createI18n({
    legacy: true,
    locale: 'en',
    messages: {
      en: {
        hello: 'hello!'
      }
    }
  })

  const App = defineComponent({ template: '<br/>' })
  const { vm } = await mount(App, i18n)

  expect(vm.$t!('hello')).toEqual('hello!')
})

test('$rt', async () => {
  const i18n = createI18n({
    legacy: true,
    locale: 'en',
    messages: {
      en: {
        contents: [
          {
            title: 'Title {0}'
          },
          {
            title: () => 'Title 2'
          }
        ]
      }
    }
  })

  const App = defineComponent({
    template: `<p v-for="(content, index) in $tm('contents')">{{ $rt(content.title, [index + 1]) }}</p>`
  })
  const { html } = await mount(App, i18n)

  expect(html()).toEqual('<p>Title 1</p><p>Title 2</p>')
})

test('$tc', async () => {
  const mockWarn = vi.spyOn(shared, 'warnOnce')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  mockWarn.mockImplementation(() => {})

  const i18n = createI18n({
    legacy: true,
    locale: 'en',
    messages: {
      en: {
        banana: 'no bananas | {n} banana | {n} bananas'
      }
    }
  })

  const App = defineComponent({ template: '<br/>' })
  const { vm } = await mount(App, i18n)

  expect(vm.$tc!('banana', 2)).toEqual('2 bananas')
  expect(mockWarn).toHaveBeenCalled()
})

test('$te', async () => {
  const i18n = createI18n({
    legacy: true,
    locale: 'en',
    messages: {
      en: {
        hello: 'hello!'
      }
    }
  })

  const App = defineComponent({ template: '<br/>' })
  const { vm } = await mount(App, i18n)

  expect(vm.$te!('hello')).toBe(true)
  expect(vm.$te!('foo')).toBe(false)
})

test('$d', async () => {
  const i18n = createI18n({
    legacy: true,
    locale: 'en-US',
    datetimeFormats: {
      'en-US': {
        short: {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'America/New_York'
        }
      }
    }
  })

  const App = defineComponent({ template: '<br/>' })
  const { vm } = await mount(App, i18n)

  const dt = new Date(Date.UTC(2012, 11, 20, 3, 0, 0))
  expect(vm.$d!(dt, 'short')).toEqual('12/19/2012, 10:00 PM')
})

test('$n', async () => {
  const i18n = createI18n({
    legacy: true,
    locale: 'en-US',
    numberFormats: {
      'en-US': {
        percent: {
          style: 'percent',
          useGrouping: false
        }
      }
    }
  })

  const App = defineComponent({ template: '<br/>' })
  const { vm } = await mount(App, i18n)

  expect(vm.$n!(0.99, 'percent')).toEqual('99%')
})

test('$i18n', async () => {
  const i18n = createI18n({
    legacy: true,
    locale: 'en',
    messages: {
      en: {
        hello: 'hello!'
      }
    }
  })

  const App = defineComponent({ template: '<br/>' })
  const { vm } = await mount(App, i18n)

  expect((vm.$i18n! as VueI18n).t('hello')).toEqual('hello!')
})

test.skip('beforeDestroy', async () => {
  const i18n = createI18n({
    legacy: true,
    locale: 'en',
    messages: {
      en: {
        hello: 'hello!'
      }
    }
  })

  const App = defineComponent({ template: '<br/>' })
  const { app, vm } = await mount(App, i18n)

  app.unmount()
  await nextTick()

  expect(vm.$i18n).toBeUndefined()
})

describe.skip('errors', () => {
  test(errorMessages[I18nErrorCodes.UNEXPECTED_ERROR], async () => {
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
      template: '<p>foo</p>'
    })

    let error: Error | null = null
    try {
      await mount(App, i18n)
    } catch (e) {
      error = e as Error
    }
    expect(error!.message).toEqual(
      errorMessages[I18nErrorCodes.UNEXPECTED_ERROR]
    )
  })
})
