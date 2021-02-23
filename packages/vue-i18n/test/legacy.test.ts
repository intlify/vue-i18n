/* eslint-disable @typescript-eslint/no-empty-function */

// utils
jest.mock('@intlify/shared', () => ({
  ...jest.requireActual<object>('@intlify/shared'),
  warn: jest.fn()
}))
import { isString, warn } from '@intlify/shared'

import { VueMessageType } from '../src/composer'
import { createVueI18n } from '../src/legacy'
import { errorMessages, I18nErrorCodes } from '../src/errors'
import { getWarnMessage, I18nWarnCodes } from '../src/warnings'
import { watchEffect, nextTick } from 'vue'
import { compileToFunction, registerMessageCompiler } from '@intlify/core-base'
import { pluralRules as _pluralRules } from './helper'

beforeEach(() => {
  registerMessageCompiler(compileToFunction)
})

test('locale', () => {
  const i18n = createVueI18n()
  expect(i18n.locale).toEqual('en-US')
  i18n.locale = 'ja'
  expect(i18n.locale).toEqual('ja')
})

test('fallbackLocale', () => {
  const i18n = createVueI18n()
  expect(i18n.fallbackLocale).toEqual('en-US')
  i18n.fallbackLocale = 'ja'
  expect(i18n.fallbackLocale).toEqual('ja')
})

test('availableLocales', () => {
  const i18n = createVueI18n({
    messages: {
      en: {},
      ja: {},
      ru: {},
      fr: {}
    }
  })
  expect(i18n.availableLocales).toEqual(['en', 'ja', 'ru', 'fr'].sort())
})

test('formatter', () => {
  const mockWarn = warn as jest.MockedFunction<typeof warn>
  mockWarn.mockImplementation(() => {})

  const i18n = createVueI18n({
    formatter: {
      interpolate() {
        return []
      }
    }
  })

  expect(i18n.formatter).not.toBeUndefined()
  i18n.formatter = {
    interpolate() {
      return []
    }
  }
  expect(mockWarn).toHaveBeenCalledTimes(3)
  expect(mockWarn.mock.calls[0][0]).toEqual(
    getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_FORMATTER)
  )
  expect(mockWarn.mock.calls[1][0]).toEqual(
    getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_FORMATTER)
  )
  expect(mockWarn.mock.calls[2][0]).toEqual(
    getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_FORMATTER)
  )
})

test('missing', () => {
  const i18n = createVueI18n()
  expect(i18n.missing).toEqual(null)
  const handler = (_: unknown, key: string) => {
    return key.toUpperCase()
  }
  i18n.missing = handler
  expect(i18n.missing).toEqual(handler)
  expect(i18n.t('foo.bar.buz')).toEqual('FOO.BAR.BUZ')
})

test('silentTranslationWarn', () => {
  // default
  const i18n = createVueI18n()
  expect(i18n.silentTranslationWarn).toEqual(false)
  i18n.silentTranslationWarn = true
  expect(i18n.silentTranslationWarn).toEqual(true)
  i18n.silentTranslationWarn = /^hi.*$/
  expect(i18n.silentTranslationWarn).toEqual(/^hi.*$/)

  // with option
  const i18nWithOption = createVueI18n({ silentTranslationWarn: true })
  expect(i18nWithOption.silentTranslationWarn).toEqual(true)
})

test('silentFallbackWarn', () => {
  // default
  const i18n = createVueI18n()
  expect(i18n.silentFallbackWarn).toEqual(false)
  i18n.silentFallbackWarn = true
  expect(i18n.silentFallbackWarn).toEqual(true)
  i18n.silentFallbackWarn = /^hi.*$/
  expect(i18n.silentFallbackWarn).toEqual(/^hi.*$/)

  // with option
  const i18nWithOption = createVueI18n({ silentFallbackWarn: true })
  expect(i18nWithOption.silentFallbackWarn).toEqual(true)
})

test('formatFallbackMessages', () => {
  // default
  const i18n = createVueI18n()
  expect(i18n.formatFallbackMessages).toEqual(false)
  i18n.formatFallbackMessages = true
  expect(i18n.formatFallbackMessages).toEqual(true)

  // withOption
  const i18nWithOption = createVueI18n({ formatFallbackMessages: true })
  expect(i18nWithOption.formatFallbackMessages).toEqual(true)
})

test('postTranslation', () => {
  const i18n = createVueI18n()
  expect(i18n.postTranslation).toEqual(null)
  const postTranslation = (str: VueMessageType) =>
    isString(str) ? str.trim() : str
  i18n.postTranslation = postTranslation
  expect(i18n.postTranslation).toEqual(postTranslation)
})

test('pluralizationRules', () => {
  const i18n = createVueI18n({
    locale: 'ru',
    pluralizationRules: _pluralRules,
    messages: {
      ru: {
        car: '0 машин | {n} машина | {n} машины | {n} машин'
      }
    }
  })

  expect(i18n.pluralizationRules).toEqual(_pluralRules)
  expect(i18n.tc('car', 1)).toEqual('1 машина')
  expect(i18n.tc('car', 2)).toEqual('2 машины')
  expect(i18n.tc('car', 4)).toEqual('4 машины')
  expect(i18n.tc('car', 12)).toEqual('12 машин')
  expect(i18n.tc('car', 21)).toEqual('21 машина')
})

test('messages', () => {
  const i18n = createVueI18n()
  expect(i18n.messages).toEqual({
    'en-US': {}
  })
})

test('datetimeFormats', () => {
  const i18n = createVueI18n()
  expect(i18n.datetimeFormats).toEqual({
    'en-US': {}
  })
})

test('numberFormats', () => {
  const i18n = createVueI18n()
  expect(i18n.numberFormats).toEqual({
    'en-US': {}
  })
})

describe('t', () => {
  test('basic', () => {
    const i18n = createVueI18n({
      locale: 'en',
      messages: {
        en: {
          name: 'kazupon',
          hello: 'Hello!',
          hi: 'hi {name}!',
          morning: 'good morning {0}',
          linked: 'hi @.upper:name'
        }
      }
    })

    expect(i18n.t('hello')).toEqual('Hello!')
    expect(i18n.t('hi', { name: 'kazupon' })).toEqual('hi kazupon!')
    expect(i18n.t('morning', ['kazupon'])).toEqual('good morning kazupon')
    expect(i18n.t('linked')).toEqual('hi KAZUPON')
  })

  test(errorMessages[I18nErrorCodes.INVALID_ARGUMENT], () => {
    const i18n = createVueI18n({
      locale: 'en',
      messages: {
        en: {
          name: 'kazupon',
          hello: 'Hello!',
          hi: 'hi {name}!',
          morning: 'good morning {0}',
          linked: 'hi @.upper:name'
        }
      }
    })

    expect(() => {
      i18n.t(4 as unknown)
    }).toThrowError(errorMessages[I18nErrorCodes.INVALID_ARGUMENT])
  })
})

describe('tc', () => {
  test('basic', () => {
    const i18n = createVueI18n({
      locale: 'en',
      messages: {
        en: {
          apple: 'no apples | one apple | {count} apples'
        }
      }
    })

    expect(i18n.tc('apple', 4)).toEqual('4 apples')
  })

  test(errorMessages[I18nErrorCodes.INVALID_ARGUMENT], () => {
    const i18n = createVueI18n({
      locale: 'en',
      messages: {
        en: {
          apple: 'no apples | one apple | {count} apples'
        }
      }
    })

    expect(() => {
      i18n.tc(4 as unknown, 4)
    }).toThrowError(errorMessages[I18nErrorCodes.INVALID_ARGUMENT])
  })
})

test('te', () => {
  const i18n = createVueI18n({
    locale: 'en',
    messages: {
      en: {
        message: {
          hello: 'Hello!'
        }
      }
    }
  })

  expect(i18n.te('message.hello')).toEqual(true)
  expect(i18n.te('message.hallo')).toEqual(false)
  expect(i18n.te('message.hallo', 'ja')).toEqual(false)
})

test('tm', async () => {
  const i18n = createVueI18n({
    locale: 'ja',
    messages: {
      en: {},
      ja: {
        foo: {
          bar: {
            buz: 'hello'
          },
          codes: {
            errors: ['error1', 'error2']
          }
        }
      }
    }
  })

  let messages1 = i18n.tm('foo.bar')
  let messages2 = i18n.tm('foo.codes')
  expect(messages1).toEqual({ buz: 'hello' })
  expect(messages2).toEqual({ errors: ['error1', 'error2'] })

  watchEffect(() => {
    messages1 = i18n.tm('foo.bar')
    messages2 = i18n.tm('foo.codes')
  })

  i18n.locale = 'en'
  await nextTick()

  expect(messages1).toEqual({})
  expect(messages2).toEqual({})
})

test('getLocaleMessage / setLocaleMessage / mergeLocaleMessage', () => {
  const i18n = createVueI18n({
    messages: {
      en: { hello: 'Hello!' }
    }
  })
  expect(i18n.getLocaleMessage('en')).toEqual({ hello: 'Hello!' })

  i18n.setLocaleMessage('en', { hi: { hi: 'hi!' } })
  expect(i18n.getLocaleMessage('en')).toEqual({ hi: { hi: 'hi!' } })

  i18n.mergeLocaleMessage('en', { hi: { hello: 'hello!' } })
  expect(i18n.getLocaleMessage('en')).toEqual({
    hi: {
      hi: 'hi!',
      hello: 'hello!'
    }
  })
})

test('d', () => {
  const i18n = createVueI18n({
    locale: 'en-US',
    fallbackLocale: 'ja-JP',
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
      },
      'ja-JP': {
        long: {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Asia/Tokyo'
        },
        short: {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Tokyo'
        }
      }
    }
  })
  const dt = new Date(Date.UTC(2012, 11, 20, 3, 0, 0))
  expect(i18n.d(dt, 'short', 'ja-JP')).toEqual('2012/12/20 12:00')
})

test('n', () => {
  const i18n = createVueI18n({
    locale: 'en-US',
    fallbackLocale: 'ja-JP',
    numberFormats: {
      'en-US': {
        currency: {
          style: 'currency',
          currency: 'USD',
          currencyDisplay: 'symbol'
        },
        decimal: {
          style: 'decimal',
          useGrouping: false
        }
      },
      'ja-JP': {
        currency: {
          style: 'currency',
          currency: 'JPY' /*, currencyDisplay: 'symbol'*/
        },
        numeric: {
          style: 'decimal',
          useGrouping: false
        },
        percent: {
          style: 'percent',
          useGrouping: false
        }
      }
    }
  })
  expect(i18n.n(0.99, 'percent', 'ja-JP')).toEqual('99%')
})

test('getDateTimeFormat / setDateTimeFormat / mergeDateTimeFormat', () => {
  const i18n = createVueI18n({
    datetimeFormats: {
      'en-US': {
        short: {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }
      }
    }
  })
  expect(i18n.getDateTimeFormat('en-US')).toEqual({
    short: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }
  })

  i18n.setDateTimeFormat('en-US', {
    long: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
  })
  expect(i18n.getDateTimeFormat('en-US')).toEqual({
    long: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
  })

  i18n.mergeDateTimeFormat('en-US', {
    short: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }
  })
  expect(i18n.getDateTimeFormat('en-US')).toEqual({
    short: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    },
    long: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
  })
})

test('getNumberFormat / setNumberFormat / mergeNumberFormat', () => {
  const i18n = createVueI18n({
    numberFormats: {
      'en-US': {
        currency: {
          style: 'currency',
          currency: 'USD',
          currencyDisplay: 'symbol'
        }
      }
    }
  })
  expect(i18n.getNumberFormat('en-US')).toEqual({
    currency: {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'symbol'
    }
  })

  i18n.setNumberFormat('en-US', {
    decimal: {
      style: 'decimal',
      useGrouping: false
    }
  })
  expect(i18n.getNumberFormat('en-US')).toEqual({
    decimal: {
      style: 'decimal',
      useGrouping: false
    }
  })

  i18n.mergeNumberFormat('en-US', {
    currency: {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'symbol'
    }
  })
  expect(i18n.getNumberFormat('en-US')).toEqual({
    currency: {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'symbol'
    },
    decimal: {
      style: 'decimal',
      useGrouping: false
    }
  })
})

test('getChoiceIndex', () => {
  const mockWarn = warn as jest.MockedFunction<typeof warn>
  mockWarn.mockImplementation(() => {})

  const i18n = createVueI18n({})
  i18n.getChoiceIndex(1, 2)
  expect(mockWarn.mock.calls[0][0]).toEqual(
    getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_GET_CHOICE_INDEX)
  )
})

test('warnHtmlInMessage', () => {
  const mockWarn = warn as jest.MockedFunction<typeof warn>
  mockWarn.mockImplementation(() => {})

  const i18n = createVueI18n({
    locale: 'en',
    messages: {
      en: {
        hello: '<p>hello</p>'
      }
    }
  })

  expect(i18n.t('hello')).toEqual('<p>hello</p>')

  i18n.warnHtmlInMessage = 'off'
  expect(i18n.t('hello')).toEqual('<p>hello</p>')

  i18n.warnHtmlInMessage = 'error'
  expect(i18n.t('hello')).toEqual('<p>hello</p>')
  expect(mockWarn).toHaveBeenCalledTimes(2)
})

/* eslint-enable @typescript-eslint/no-empty-function */
