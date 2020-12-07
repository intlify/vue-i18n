/**
 * @jest-environment jsdom
 */

import { mount } from './helper'
import { defineComponent, nextTick } from 'vue'
import { createI18n } from '../src/i18n'
import { errorMessages, I18nErrorCodes } from '../src/errors'
import { VueI18n } from '../src/legacy'

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
      __i18n: [JSON.stringify(messages)]
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

test('$tc', async () => {
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

test('VueI18n componentInstanceCreatedListener option', async () => {
  const componentInstanceCreatedListener = jest.fn()
  const i18n = createI18n({
    legacy: true,
    locale: 'en',
    componentInstanceCreatedListener
  })

  const App = defineComponent({
    template: '<br/>',
    i18n: {
      locale: 'ja'
    }
  })
  await mount(App, i18n)

  expect(componentInstanceCreatedListener).toHaveBeenCalled()
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
  const { app, rootEl, vm } = await mount(App, i18n)

  app.unmount(rootEl)
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
      error = e
    }
    expect(error!.message).toEqual(
      errorMessages[I18nErrorCodes.UNEXPECTED_ERROR]
    )
  })
})
