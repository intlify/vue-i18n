/**
 * @jest-environment jsdom
 */

import { defineComponent } from 'vue'
import { mount } from './helper'
import { createI18n, useI18n } from '../src/i18n'
import { errorMessages, I18nErrorCodes } from '../src/errors'

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
  test.todo('basic')
  test.todo('global scope')
  test.todo('parent scope')

  let org
  beforeEach(() => {
    org = console.warn
    console.warn = () => {} // eslint-disable-line @typescript-eslint/no-empty-function
  })
  afterEach(() => {
    console.warn = org
  })

  test(errorMessages[I18nErrorCodes.I18N_NOT_INSLALLED], () => {
    expect(() => {
      useI18n()
    }).toThrowError(errorMessages[I18nErrorCodes.I18N_NOT_INSLALLED])
  })

  test(
    errorMessages[I18nErrorCodes.I18N_NOT_AVAILABLE_IN_LEGACY_MODE],
    async () => {
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
        errorMessages[I18nErrorCodes.I18N_NOT_AVAILABLE_IN_LEGACY_MODE]
      )
    }
  )
})
