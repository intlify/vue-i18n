// utils
jest.mock('../src/utils', () => ({
  ...jest.requireActual('../src/utils'),
  warn: jest.fn()
}))
import { warn } from '../src/utils'

import { createComposer, MissingHandler } from '../src/composer'
import { watch } from 'vue'

describe('locale', () => {
  test('default value', () => {
    const { locale } = createComposer({})
    expect(locale.value).toEqual('en-US')
  })

  test('initialize at composer creating', () => {
    const { locale } = createComposer({ locale: 'ja' })
    expect(locale.value).toEqual('ja')
  })

  test('reactivity', done => {
    const { locale } = createComposer({})
    watch(locale, () => {
      expect(locale.value).toEqual('en')
      done()
    })
    locale.value = 'en'
  })
})

describe('fallbackLocale', () => {
  test('default value', () => {
    const { fallbackLocale } = createComposer({})
    expect(fallbackLocale.value).toEqual('en-US')
  })

  test('initialize at composer creating', () => {
    const { fallbackLocale } = createComposer({ fallbackLocale: ['ja'] })
    expect(fallbackLocale.value).toEqual(['ja'])
  })
})

describe('availableLocales', () => {
  test('not initialize messages at composer creating', () => {
    const { availableLocales } = createComposer({})
    expect(availableLocales).toEqual(['en-US'])
  })

  test('initialize messages at composer creating', () => {
    const { availableLocales } = createComposer({
      messages: {
        en: {},
        ja: {},
        ru: {},
        fr: {}
      }
    })
    expect(availableLocales).toEqual(['en', 'ja', 'ru', 'fr'].sort())
  })
})

describe('messages', () => {
  test('default value', () => {
    const { messages } = createComposer({})
    expect(messages.value).toEqual({
      'en-US': {}
    })
  })

  test('initialize at composer creating', () => {
    const { messages } = createComposer({
      messages: {
        en: { hello: 'Hello,world!' },
        ja: {
          hello: 'こんにちは、世界！',
          nest: {
            foo: {
              bar: 'ばー'
            }
          }
        }
      }
    })
    expect(messages.value).toEqual({
      en: { hello: 'Hello,world!' },
      ja: {
        hello: 'こんにちは、世界！',
        nest: {
          foo: {
            bar: 'ばー'
          }
        }
      }
    })
  })
})

describe('datetimeFormats', () => {
  test('default value', () => {
    const { datetimeFormats } = createComposer({})
    expect(datetimeFormats.value).toEqual({
      'en-US': {}
    })
  })

  test('initialize at composer creating', () => {
    const { datetimeFormats } = createComposer({
      datetimeFormats: {
        'en-US': {
          short: {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }
        },
        'ja-JP': {
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
    expect(datetimeFormats.value).toEqual({
      'en-US': {
        short: {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }
      },
      'ja-JP': {
        short: {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }
      }
    })
  })
})

describe('numberFormats', () => {
  test('default value', () => {
    const { numberFormats } = createComposer({})
    expect(numberFormats.value).toEqual({
      'en-US': {}
    })
  })

  test('initialize at composer creating', () => {
    const { numberFormats } = createComposer({
      numberFormats: {
        'en-US': {
          currency: {
            style: 'currency',
            currency: 'USD',
            currencyDisplay: 'symbol'
          }
        },
        'ja-JP': {
          currency: {
            style: 'currency',
            currency: 'JPY',
            currencyDisplay: 'symbol'
          }
        }
      }
    })
    expect(numberFormats.value).toEqual({
      'en-US': {
        currency: {
          style: 'currency',
          currency: 'USD',
          currencyDisplay: 'symbol'
        }
      },
      'ja-JP': {
        currency: {
          style: 'currency',
          currency: 'JPY',
          currencyDisplay: 'symbol'
        }
      }
    })
  })
})

describe('modifiers', () => {
  test('default', () => {
    const { modifiers } = createComposer({})
    expect(modifiers).toEqual({})
  })

  test('initialize at composer creating', () => {
    const _modifiers = {
      kebab: (str: string) => str.replace(/\s+/g, '-').toLowerCase()
    }
    const { modifiers, t } = createComposer({
      locale: 'en',
      messages: {
        en: {
          hello: 'hello world',
          hi: 'hi @.kebab:hello'
        }
      },
      modifiers: _modifiers
    })
    expect(modifiers).toEqual(_modifiers)
    expect(t('hi')).toEqual('hi hello-world')
  })
})

describe('pluralRules', () => {
  test('default', () => {
    const { pluralRules } = createComposer({})
    expect(pluralRules).toBeUndefined()
  })

  test('initialize at composer creating', () => {
    const _pluralRules = {
      en: () => {
        return 0
      }
    }
    const { pluralRules } = createComposer({
      pluralRules: _pluralRules
    })
    expect(pluralRules).toEqual(_pluralRules)
  })
})

describe('missingWarn', () => {
  test('default', () => {
    const { missingWarn } = createComposer({})
    expect(missingWarn).toEqual(true)
  })

  test('initialize at composer creating: boolean', () => {
    const { missingWarn } = createComposer({ missingWarn: false })
    expect(missingWarn).toEqual(false)
  })

  test('initialize at composer creating: regexp', () => {
    const { missingWarn } = createComposer({ missingWarn: /^(hi|hello)/ })
    expect(missingWarn).toEqual(/^(hi|hello)/)
  })
})

describe('fallbackWarn', () => {
  test('default', () => {
    const { fallbackWarn } = createComposer({})
    expect(fallbackWarn).toEqual(true)
  })

  test('initialize at composer creating: boolean', () => {
    const { fallbackWarn } = createComposer({ fallbackWarn: false })
    expect(fallbackWarn).toEqual(false)
  })

  test('initialize at composer creating: regexp', () => {
    const { fallbackWarn } = createComposer({ fallbackWarn: /^(hi|hello)/ })
    expect(fallbackWarn).toEqual(/^(hi|hello)/)
  })
})

describe('fallbackFormat', () => {
  test('default', () => {
    const { fallbackFormat } = createComposer({})
    expect(fallbackFormat).toEqual(false)
  })

  test('initialize at composer creating', () => {
    const { fallbackFormat } = createComposer({ fallbackFormat: true })
    expect(fallbackFormat).toEqual(true)
  })

  test('interpolation', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

    const { t } = createComposer({
      locale: 'en',
      fallbackLocale: ['ja', 'fr'],
      fallbackFormat: true,
      messages: {
        en: {},
        ja: {},
        fr: {}
      }
    })

    expect(t('hi, {name}!', { name: 'kazupon' })).toEqual('hi, kazupon!')
    expect(mockWarn).toHaveBeenCalledTimes(5)
  })
})

describe('postTranslation', () => {
  test('default', () => {
    const {
      getPostTranslationHandler,
      setPostTranslationHandler,
      t
    } = createComposer({
      locale: 'en',
      messages: {
        en: { hello: ' hello world! ' }
      }
    })
    expect(getPostTranslationHandler()).toEqual(null)

    const handler = (str: string) => str.trim()
    setPostTranslationHandler(handler)
    expect(t('hello')).toEqual('hello world!')
    expect(getPostTranslationHandler()).toEqual(handler)
  })

  test('initialize at composer creating', () => {
    const handler = (str: string) => str.trim()
    const { getPostTranslationHandler, t } = createComposer({
      locale: 'en',
      messages: {
        en: { hello: ' hello world! ' }
      },
      postTranslation: handler
    })
    expect(t('hello')).toEqual('hello world!')
    expect(getPostTranslationHandler()).toEqual(handler)
  })
})

describe('getMissingHandler / setMissingHandler', () => {
  test('default', () => {
    const { getMissingHandler, setMissingHandler } = createComposer({})
    expect(getMissingHandler()).toEqual(null)

    const missing = () => {} // eslint-disable-line @typescript-eslint/no-empty-function
    setMissingHandler(missing as MissingHandler)
    expect(getMissingHandler()).toEqual(missing)
  })

  test('initialize at composer creating', () => {
    const missing = () => {} // eslint-disable-line @typescript-eslint/no-empty-function
    const { getMissingHandler } = createComposer({ missing })
    expect(getMissingHandler()).toEqual(missing)
  })
})

describe('t', () => {
  test('basic', () => {
    const { t } = createComposer({
      locale: 'en',
      messages: {
        en: { hi: 'hi kazupon !' }
      }
    })
    expect(t('hi')).toEqual('hi kazupon !')
  })

  test('list', () => {
    const { t } = createComposer({
      locale: 'en',
      messages: {
        en: { hi: 'hi {0} !' }
      }
    })
    expect(t('hi', ['kazupon'])).toEqual('hi kazupon !')
  })

  test('named', () => {
    const { t } = createComposer({
      locale: 'en',
      messages: {
        en: { hi: 'hi {name} !' }
      }
    })
    expect(t('hi', { name: 'kazupon' })).toEqual('hi kazupon !')
  })

  test('literal', () => {
    const { t } = createComposer({
      locale: 'en',
      messages: {
        en: {
          ascii: `hi {'kazupon'} !`,
          multibytes: `hi {'かずぽん'} !`,
          emoji: `hi {'😺'} !`,
          specials: `hi {'${'!#%^&*()-_+=[]:;?.<>"`'}'} !`,
          escapedSingleQuote: `hi {'\\''} !`,
          escapedSlash: `hi {'\\\\'} !`,
          unicode4digits: `hi {'${'\u0041'}'} !`,
          escapedUnicode4digits: `hi {'\\\\u0041'} !`,
          unicode6digits: `hi {'${'U01F602'}'} !`,
          escapedUnicode6digits: `hi {'\\\\U01F602'} !`
        }
      }
    })
    expect(t('ascii')).toEqual('hi kazupon !')
    expect(t('multibytes')).toEqual('hi かずぽん !')
    expect(t('emoji')).toEqual('hi 😺 !')
    expect(t('specials')).toEqual(`hi ${'!#%^&*()-_+=[]:;?.<>"`'} !`)
    expect(t('escapedSingleQuote')).toEqual(`hi ' !`)
    expect(t('escapedSlash')).toEqual('hi \\ !')
    expect(t('unicode4digits')).toEqual('hi A !')
    expect(t('escapedUnicode4digits')).toEqual(`hi \\u0041 !`)
    expect(t('unicode6digits')).toEqual('hi U01F602 !')
    expect(t('escapedUnicode6digits')).toEqual(`hi \\U01F602 !`)
  })

  test('linked', () => {
    const { t } = createComposer({
      locale: 'en',
      messages: {
        en: {
          name: 'kazupon',
          hi: 'hi @.upper:name !'
        }
      }
    })
    expect(t('hi')).toEqual('hi KAZUPON !')
  })

  test('plural', () => {
    const { t } = createComposer({
      locale: 'en',
      messages: {
        en: { apple: 'no apples | one apple | {count} apples' }
      }
    })
    expect(t('apple', 0)).toEqual('no apples')
    expect(t('apple', 1)).toEqual('one apple')
    expect(t('apple', 10)).toEqual('10 apples')
    expect(t('apple', { count: 20 }, 10)).toEqual('20 apples')
  })
})

test('d', () => {
  const { d } = createComposer({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
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
  expect(d(dt, { key: 'long', fallbackWarn: false })).toEqual(
    '2012/12/20 12:00:00'
  )
})

test('n', () => {
  const { n } = createComposer({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
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
  expect(n(0.99, { key: 'percent', fallbackWarn: false })).toEqual('99%')
})

describe('getLocaleMessage / setLocaleMessage / mergeLocaleMessage', () => {
  test('basic', () => {
    const {
      getLocaleMessage,
      setLocaleMessage,
      mergeLocaleMessage
    } = createComposer({
      messages: {
        en: { hello: 'Hello!' }
      }
    })
    expect(getLocaleMessage('en')).toEqual({ hello: 'Hello!' })

    setLocaleMessage('en', { hi: 'Hi!' })
    expect(getLocaleMessage('en')).toEqual({ hi: 'Hi!' })

    mergeLocaleMessage('en', { hello: 'Hello!' })
    expect(getLocaleMessage('en')).toEqual({
      hello: 'Hello!',
      hi: 'Hi!'
    })
  })
})

describe('getDateTimeFormat / setDateTimeFormat / mergeDateTimeFormat', () => {
  test('basci', () => {
    const {
      getDateTimeFormat,
      setDateTimeFormat,
      mergeDateTimeFormat
    } = createComposer({
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
    expect(getDateTimeFormat('en-US')).toEqual({
      short: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }
    })

    setDateTimeFormat('en-US', {
      long: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
    })
    expect(getDateTimeFormat('en-US')).toEqual({
      long: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
    })

    mergeDateTimeFormat('en-US', {
      short: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }
    })
    expect(getDateTimeFormat('en-US')).toEqual({
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
})

describe('getNumberFormat / setNumberFormat / mergeNumberFormat', () => {
  test('basic', () => {
    const {
      getNumberFormat,
      setNumberFormat,
      mergeNumberFormat
    } = createComposer({
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
    expect(getNumberFormat('en-US')).toEqual({
      currency: {
        style: 'currency',
        currency: 'USD',
        currencyDisplay: 'symbol'
      }
    })

    setNumberFormat('en-US', {
      decimal: {
        style: 'decimal',
        useGrouping: false
      }
    })
    expect(getNumberFormat('en-US')).toEqual({
      decimal: {
        style: 'decimal',
        useGrouping: false
      }
    })

    mergeNumberFormat('en-US', {
      currency: {
        style: 'currency',
        currency: 'USD',
        currencyDisplay: 'symbol'
      }
    })
    expect(getNumberFormat('en-US')).toEqual({
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
})

describe('__i18n', () => {
  test('default value', () => {
    const { messages } = createComposer({
      __i18n: [
        JSON.stringify({ en: { hello: 'Hello,world!' } }),
        JSON.stringify({
          ja: {
            hello: 'こんにちは、世界！',
            nest: {
              foo: {
                bar: 'ばー'
              }
            }
          }
        })
      ]
    })
    expect(messages.value).toEqual({
      en: { hello: 'Hello,world!' },
      ja: {
        hello: 'こんにちは、世界！',
        nest: {
          foo: {
            bar: 'ばー'
          }
        }
      }
    })
  })
})
