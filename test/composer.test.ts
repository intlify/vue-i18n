/* eslint-disable @typescript-eslint/no-empty-function */

// utils
jest.mock('../src/utils', () => ({
  ...jest.requireActual('../src/utils'),
  warn: jest.fn()
}))
import { warn } from '../src/utils'

import {
  createComposer,
  MissingHandler,
  addPreCompileMessages,
  Composer,
  ComposerInternal
} from '../src/composer'
import { generateFormatCacheKey } from '../src/utils'
import { watch, nextTick, createTextVNode } from 'vue'

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

describe('inheritLocale', () => {
  test('default value', () => {
    const root = createComposer({ locale: 'en' })
    const { inheritLocale, locale } = createComposer({
      locale: 'ja',
      __root: root
    })
    expect(inheritLocale).toEqual(false)
    expect(locale.value).toEqual('ja')
  })

  test('initialize with composer option', () => {
    const root = createComposer({ locale: 'en' })
    const { inheritLocale, locale } = createComposer({
      locale: 'ja',
      inheritLocale: true,
      __root: root
    })
    expect(inheritLocale).toEqual(true)
    expect(locale.value).toEqual('en')
  })

  test('sync root locale, fallbackLocale', async () => {
    const root = createComposer({
      locale: 'en',
      fallbackLocale: ['ja', 'fr']
    })
    const composer = createComposer({
      locale: 'ja',
      fallbackLocale: ['zh', 'de'],
      inheritLocale: true,
      __root: root
    })
    await nextTick()

    expect(composer.locale.value).toEqual('en')
    expect(composer.fallbackLocale.value).toEqual(['ja', 'fr'])

    root.locale.value = 'ja'
    root.fallbackLocale.value = ['zh', 'de']
    await nextTick()

    expect(composer.locale.value).toEqual('ja')
    expect(composer.fallbackLocale.value).toEqual(['zh', 'de'])

    composer.inheritLocale = false
    await nextTick()

    root.locale.value = 'en'
    root.fallbackLocale.value = ['ja', 'fr']
    await nextTick()

    expect(composer.locale.value).toEqual('ja')
    expect(composer.fallbackLocale.value).toEqual(['zh', 'de'])

    composer.inheritLocale = true
    await nextTick()

    expect(composer.locale.value).toEqual('en')
    expect(composer.fallbackLocale.value).toEqual(['ja', 'fr'])
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
    mockWarn.mockImplementation(() => {})

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

describe('fallbackRoot', () => {
  test('default', () => {
    const { fallbackRoot } = createComposer({})
    expect(fallbackRoot).toEqual(true)
  })

  test('initialize at composer creating', () => {
    const composer = createComposer({ fallbackRoot: false })
    expect(composer.fallbackRoot).toEqual(false)
    composer.fallbackRoot = true
    expect(composer.fallbackRoot).toEqual(true)
  })
})

describe('warnHtmlMessage', () => {
  test('default', () => {
    const { warnHtmlMessage } = createComposer({})
    expect(warnHtmlMessage).toEqual(true)
  })

  test('initialize at composer creating', () => {
    const composer = createComposer({ warnHtmlMessage: false })
    expect(composer.warnHtmlMessage).toEqual(false)
    composer.warnHtmlMessage = true
    expect(composer.warnHtmlMessage).toEqual(true)
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

    const missing = () => {}
    setMissingHandler(missing as MissingHandler)
    expect(getMissingHandler()).toEqual(missing)
  })

  test('initialize at composer creating', () => {
    const missing = () => {}
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

  test('missing', () => {
    const missing = () => {}
    const { t } = createComposer({
      locale: 'en',
      missing,
      messages: {
        en: {}
      }
    })
    expect(t('foo.bar.buz')).toEqual('foo.bar.buz')
  })
})

describe('d', () => {
  test('basic', () => {
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

  test('missing', () => {
    const { d } = createComposer({
      locale: 'en-US',
      datetimeFormats: {
        'en-US': {}
      }
    })
    const dt = new Date(Date.UTC(2012, 11, 20, 3, 0, 0))
    expect(d(dt, { key: 'long' })).toEqual('')
  })
})

describe('n', () => {
  test('basic', () => {
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

  test('missing', () => {
    const { n } = createComposer({
      locale: 'en-US',
      numberFormats: {
        'en-US': {}
      }
    })
    expect(n(0.99, { key: 'percent' })).toEqual('')
  })
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

describe('__transrateVNode', () => {
  test('basic', () => {
    const composer = createComposer({
      locale: 'en',
      messages: {
        en: {
          hello: 'hello, {name}!'
        }
      }
    })
    expect(
      (composer as Composer & ComposerInternal).__transrateVNode('hello', {
        name: createTextVNode('kazupon')
      })
    ).toMatchObject([
      { children: 'hello, ' },
      { children: 'kazupon' },
      { children: '!' }
    ])
  })

  test('missing', () => {
    const composer = createComposer({
      locale: 'en',
      messages: {
        en: {}
      }
    })
    expect(
      (composer as Composer & ComposerInternal).__transrateVNode('hello', {
        name: createTextVNode('kazupon')
      })
    ).toEqual('hello')
  })
})

describe('__numberParts', () => {
  test('basic', () => {
    const composer = createComposer({
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
    expect(
      (composer as Composer & ComposerInternal).__numberParts(0.99, {
        key: 'percent',
        part: true
      })
    ).toMatchObject([
      { value: '99' },
      { value: '%' }
    ])
  })

  test('missing', () => {
    const composer = createComposer({
      locale: 'en-US',
      numberFormats: {
        'en-US': {}
      }
    })
    expect(
      (composer as Composer & ComposerInternal).__numberParts(0.99, {
        key: 'percent',
        part: true
      })
    ).toEqual([])
  })
})

describe('__datetimeParts', () => {
  test('basic', () => {
    const composer = createComposer({
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
    const dt = new Date(Date.UTC(2012, 11, 20, 3, 0, 0))
    expect(
      (composer as Composer & ComposerInternal).__datetimeParts(dt, {
        key: 'short',
        part: true
      })
    ).toMatchObject([
      { value: '12' },
      { value: '/' },
      { value: '19' },
      { value: '/' },
      { value: '2012' },
      { value: ', ' },
      { value: '10' },
      { value: ':' },
      { value: '00' },
      { value: ' ' },
      { value: 'PM' }
    ])
  })

  test('missing', () => {
    const composer = createComposer({
      locale: 'en-US',
      datetimeFormats: {
        'en-US': {}
      }
    })
    const dt = new Date(Date.UTC(2012, 11, 20, 3, 0, 0))
    expect(
      (composer as Composer & ComposerInternal).__datetimeParts(dt, {
        key: 'short',
        part: true
      })
    ).toEqual([])
  })
})

test('addPreCompileMessages', () => {
  const messages = {}
  const functions = Object.create(null)
  const msg1 = () => {}
  const msg2 = () => {}
  functions[generateFormatCacheKey('en', 'hello', 'hello,world')] = msg1
  functions[
    generateFormatCacheKey('ja', 'foo.bar.hello', 'こんにちは、世界')
  ] = msg2
  addPreCompileMessages(messages, functions)
  expect(messages['en']).toMatchObject({
    hello: msg1
  })
  expect(messages['ja']).toMatchObject({
    foo: {
      bar: {
        hello: msg2
      }
    }
  })
})

describe('root', () => {
  test('global', () => {
    const __root = createComposer({
      locale: 'en'
    })

    const composer = createComposer({
      locale: 'en',
      __root
    })

    expect(__root.isGlobal).toBe(true)
    expect(composer.isGlobal).toBe(false)
  })

  test('t', () => {
    const __root = createComposer({
      locale: 'en',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    const { t } = createComposer({
      locale: 'en',
      messages: {
        en: {}
      },
      __root
    })

    expect(t('hello')).toEqual('hello!')
  })

  test('d', () => {
    const __root = createComposer({
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

    const { d } = createComposer({
      locale: 'en-US',
      datetimeFormats: {
        'en-US': {}
      },
      __root
    })

    const dt = new Date(Date.UTC(2012, 11, 20, 3, 0, 0))
    expect(d(dt, { key: 'short' })).toEqual('12/19/2012, 10:00 PM')
  })

  test('n', () => {
    const __root = createComposer({
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

    const { n } = createComposer({
      locale: 'en-US',
      numberFormats: {
        'en-US': {}
      },
      __root
    })

    expect(n(0.99, { key: 'percent' })).toEqual('99%')
  })
})

/* eslint-enable @typescript-eslint/no-empty-function */
