/**
 * @jest-environment jsdom
 */

import { defineComponent } from 'vue'
import { mount } from './helper'
import { createI18n, useI18n } from '../src/i18n'
import { errorMessages, I18nErrorCodes } from '../src/errors'
import { Composer } from '../src/composer'

describe('createI18n', () => {
  test('legay mode', () => {
    const i18n = createI18n({
      legacy: true
    })

    expect(i18n.mode).toEqual('legacy')
  })

  test('composable mode', () => {
    const i18n = createI18n({})

    expect(i18n.mode).toEqual('composable')
  })
})

describe('useI18n', () => {
  let org, spy
  beforeEach(() => {
    org = console.warn
    spy = jest.fn()
    console.warn = spy
  })
  afterEach(() => {
    console.warn = org
  })

  test('basic', async () => {
    const i18n = createI18n({
      locale: 'ja',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    let composer: Composer | null = null
    const App = defineComponent({
      template: `<p>foo</p>`,
      setup() {
        composer = useI18n({
          locale: 'en',
          messages: {
            en: {
              hello: 'hello!'
            }
          }
        })
        return {}
      }
    })
    await mount(App, i18n)

    expect(i18n.global !== composer).toEqual(true)
    expect(composer.locale.value).toEqual('en')
  })

  test('global scope', async () => {
    const i18n = createI18n({
      locale: 'ja',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    let composer: Composer | null = null
    const App = defineComponent({
      template: `<p>foo</p>`,
      setup() {
        composer = useI18n({ useScope: 'global' })
        return {}
      }
    })
    await mount(App, i18n)

    expect(i18n.global === composer).toEqual(true)
    expect(composer.locale.value).toEqual('ja')
  })

  test('parent scope', async () => {
    const i18n = createI18n({
      locale: 'ja',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    let leaf: Composer | null = null
    let parent: Composer | null = null
    const App = defineComponent({
      components: {
        Leaf: {
          template: '<p>local</p>',
          setup() {
            leaf = useI18n({ useScope: 'parent' })
            return {}
          }
        }
      },
      template: `<div>parent</div><Leaf />`,
      setup() {
        parent = useI18n({
          locale: 'en',
          messages: {
            en: {
              hello: 'hello!'
            }
          }
        })
        return {}
      }
    })
    await mount(App, i18n)

    expect(i18n.global !== leaf).toEqual(true)
    expect(i18n.global !== parent).toEqual(true)
    expect(parent === leaf).toEqual(true)
    expect(leaf.locale.value).toEqual('en')
  })

  test('not found parent composer with parent scope', async () => {
    const i18n = createI18n({
      locale: 'ja',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    let composer: Composer | null = null
    const App = defineComponent({
      components: {
        Leaf: {
          template: '<p>local</p>',
          setup() {
            composer = useI18n({ useScope: 'parent' })
            return {}
          }
        }
      },
      template: `<div>parent</div><Leaf />`,
      setup() {
        return {}
      }
    })
    await mount(App, i18n)

    expect(i18n.global === composer).toEqual(true)
    expect(composer.locale.value).toEqual('ja')
  })

  test('empty options', async () => {
    const i18n = createI18n({
      locale: 'ja',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    let composer: Composer | null = null
    const App = defineComponent({
      template: `<p>foo</p>`,
      setup() {
        composer = useI18n()
        return {}
      }
    })
    await mount(App, i18n)

    expect(i18n.global === composer).toEqual(true)
    expect(composer.locale.value).toEqual('ja')
  })

  test(errorMessages[I18nErrorCodes.NOT_INSLALLED], () => {
    expect(() => {
      useI18n()
    }).toThrowError(errorMessages[I18nErrorCodes.NOT_INSLALLED])
  })

  test(errorMessages[I18nErrorCodes.NOT_AVAILABLE_IN_LEGACY_MODE], async () => {
    const i18n = createI18n({
      legacy: true,
      locale: 'ja',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    let error = ''
    const App = defineComponent({
      template: `<p>foo</p>`,
      setup() {
        try {
          useI18n({
            locale: 'en',
            messages: {
              en: {
                hello: 'hello!'
              }
            }
          })
        } catch (e) {
          error = e.message
        }
        return {}
      }
    })
    await mount(App, i18n)
    expect(error).toEqual(
      errorMessages[I18nErrorCodes.NOT_AVAILABLE_IN_LEGACY_MODE]
    )
  })
})
