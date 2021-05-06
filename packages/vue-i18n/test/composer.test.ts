/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any */

// utils
jest.mock('@intlify/shared', () => ({
  ...jest.requireActual<object>('@intlify/shared'),
  warn: jest.fn()
}))
import { isString, warn } from '@intlify/shared'
import { pluralRules as _pluralRules } from './helper'

import {
  createComposer,
  MissingHandler,
  ComposerOptions,
  VueMessageType,
  TransrateVNodeSymbol,
  NumberPartsSymbol,
  DatetimePartsSymbol
} from '../src/composer'
import { getWarnMessage, I18nWarnCodes } from '../src/warnings'
import { watch, watchEffect, nextTick, Text, createVNode } from 'vue'
import {
  Locale,
  compileToFunction,
  registerMessageCompiler,
  MessageContext,
  Path,
  PathValue,
  MessageResolver
} from '@intlify/core-base'

beforeEach(() => {
  registerMessageCompiler(compileToFunction)
})

describe('locale', () => {
  test('default value', () => {
    const { locale } = createComposer({})
    expect(locale.value).toEqual('en-US')
  })

  test('initialize at composer creating', () => {
    const { locale } = createComposer({ locale: 'ja' })
    expect(locale.value).toEqual('ja')
  })

  test('reactivity', async () => {
    const fn = jest.fn()

    const { locale } = createComposer({})
    watch(locale, fn)
    locale.value = 'en'
    await nextTick()

    expect(fn).toBeCalled()
    expect(fn.mock.calls[0][0]).toEqual('en')
    expect(fn.mock.calls[0][1]).toEqual('en-US')
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
    expect(inheritLocale).toEqual(true)
    expect(locale.value).toEqual('en')
  })

  test('initialize with composer option', () => {
    const root = createComposer({ locale: 'en' })
    const { inheritLocale, locale } = createComposer({
      locale: 'ja',
      inheritLocale: false,
      __root: root
    })
    expect(inheritLocale).toEqual(false)
    expect(locale.value).toEqual('ja')
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
      kebab: (str: VueMessageType) =>
        isString(str) ? str.replace(/\s+/g, '-').toLowerCase() : str
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
    expect(pluralRules).toEqual({})
  })

  test('specified', () => {
    const { pluralRules, t } = createComposer({
      locale: 'ru',
      pluralRules: _pluralRules,
      messages: {
        ru: {
          car: '0 машин | {n} машина | {n} машины | {n} машин'
        }
      }
    })

    expect(pluralRules).toEqual(_pluralRules)
    expect(t('car', 1)).toEqual('1 машина')
    expect(t('car', 2)).toEqual('2 машины')
    expect(t('car', 4)).toEqual('4 машины')
    expect(t('car', 12)).toEqual('12 машин')
    expect(t('car', 21)).toEqual('21 машина')
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

  test('warnings', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {})

    const root = createComposer({
      locale: 'en',
      missingWarn: false,
      fallbackWarn: true,
      fallbackRoot: true
    })
    const { t } = createComposer({
      locale: 'en',
      fallbackLocale: ['fr', 'jp'],
      missingWarn: false,
      fallbackWarn: true,
      fallbackRoot: true,
      messages: {
        ja: {},
        en: {},
        fr: {}
      },
      __root: root
    } as any)
    expect(t('hello')).toEqual('hello')
    expect(mockWarn).toHaveBeenCalled()
    expect(mockWarn.mock.calls[0][0]).toEqual(
      getWarnMessage(I18nWarnCodes.FALLBACK_TO_ROOT, {
        type: 'translate',
        key: 'hello'
      })
    )
  })

  test('not warnings', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {})

    const root = createComposer({
      locale: 'en',
      missingWarn: false,
      fallbackWarn: false,
      fallbackRoot: true
    })
    const { t } = createComposer({
      locale: 'en',
      fallbackLocale: ['fr', 'jp'],
      missingWarn: false,
      fallbackWarn: false,
      fallbackRoot: true,
      messages: {
        ja: {},
        en: {},
        fr: {}
      },
      __root: root
    } as any)
    expect(t('hello')).toEqual('hello')
    expect(mockWarn).not.toHaveBeenCalledTimes(1)
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

    const handler = (str: VueMessageType) => (isString(str) ? str.trim() : str)
    setPostTranslationHandler(handler)
    expect(t('hello')).toEqual('hello world!')
    expect(getPostTranslationHandler()).toEqual(handler)
  })

  test('initialize at composer creating', () => {
    const handler = (str: VueMessageType) => (isString(str) ? str.trim() : str)
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

const ErrorCodes = {
  Code1: 1
}

type ErrorCodes = typeof ErrorCodes[keyof typeof ErrorCodes]

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
          hi: 'hi @.upper:name !',
          actions: {
            photo: 'added {count} @:photo'
          },
          photo: 'photo | photos',
          collection: 'Collection | Collections',
          file: 'File | Files',
          collection_name: '@:collection @:name',
          file_name: '@:file @:name'
        }
      }
    })
    expect(t('hi')).toEqual('hi KAZUPON !')
    expect(t('actions.photo', { count: 2 })).toEqual('added 2 photos') // linked pluralization
    expect(t('collection_name', { count: 2 })).toEqual('Collections kazupon')
    expect(t('file_name', { count: 1 })).toEqual('File kazupon')
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
    const missing = (locale: Locale, key: string) => {
      return key.toUpperCase()
    }
    const { t } = createComposer({
      locale: 'en',
      missing,
      messages: {
        en: {}
      }
    })
    expect(t('foo.bar.buz')).toEqual('FOO.BAR.BUZ')
  })

  test('computed property name', () => {
    const { t } = createComposer({
      locale: 'en',
      messages: {
        en: {
          [ErrorCodes.Code1]: 'computed property name'
        }
      }
    })

    expect(t(ErrorCodes.Code1)).toEqual('computed property name')
  })

  test('reactivity', async () => {
    const EN_HELLO = 'Hello!'
    const JA_HELLO = 'こんにちは！'
    const { t, locale } = createComposer({
      locale: 'en',
      messages: {
        en: { hello: EN_HELLO },
        ja: { hello: JA_HELLO }
      }
    })

    expect(t('hello')).toEqual(EN_HELLO)
    locale.value = 'ja'
    await nextTick()
    expect(t('hello')).toEqual(JA_HELLO)
    locale.value = 'en'
    await nextTick()
    expect(t('hello')).toEqual(EN_HELLO)
    locale.value = 'ja'
    await nextTick()
    expect(t('hello')).toEqual(JA_HELLO)
  })
})

describe('rt', () => {
  test('compilation', () => {
    const { rt, messages } = createComposer({
      locale: 'en',
      messages: {
        en: {
          text: 'hi dio!',
          list: 'hi {0}!',
          named: 'hi {name}!',
          name: 'dio',
          linked: 'hi @.upper:name !',
          pural: 'no apples | one apple | {count} apples'
        }
      }
    })

    expect(rt(messages.value.en.text)).toEqual('hi dio!')
    expect(rt(messages.value.en.list, ['dio'])).toEqual('hi dio!')
    expect(rt(messages.value.en.named, { name: 'dio' })).toEqual('hi dio!')
    expect(rt(messages.value.en.linked)).toEqual('hi DIO !')
    expect(rt(messages.value.en.pural, 2)).toEqual('2 apples')
  })

  test('message functions', () => {
    const { rt, messages } = createComposer({
      locale: 'en',
      messages: {
        en: {
          text: () => 'hi dio!',
          list: (ctx: MessageContext<VueMessageType>) => `hi ${ctx.list(0)}!`,
          named: (ctx: MessageContext<VueMessageType>) =>
            `hi ${ctx.named('name')}!`,
          name: 'dio',
          linked: (ctx: MessageContext<VueMessageType>) =>
            `hi ${ctx.linked('name', 'upper')} !`,
          pural: (ctx: MessageContext<VueMessageType>) =>
            ctx.plural([
              'no apples',
              'one apple',
              `${ctx.named('count')} apples`
            ])
        }
      }
    })

    expect(rt(messages.value.en.text)).toEqual('hi dio!')
    expect(rt(messages.value.en.list, ['dio'])).toEqual('hi dio!')
    expect(rt(messages.value.en.named, { name: 'dio' })).toEqual('hi dio!')
    expect(rt(messages.value.en.linked)).toEqual('hi DIO !')
    expect(rt(messages.value.en.pural, 2)).toEqual('2 apples')
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

  test('iso', () => {
    const { d } = createComposer({
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
    const dt = '2012-12-20T12:00:00Z'
    expect(d(dt, { key: 'short', fallbackWarn: false })).toEqual(
      '12/20/2012, 07:00 AM'
    )
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

  test('minimumFractionDigits, maximumFractionDigits', () => {
    const { n } = createComposer({
      locale: 'en-US',
      fallbackLocale: ['ja-JP'],
      numberFormats: {
        'en-US': {
          currency: {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
          },
          decimal: {
            style: 'decimal',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
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
    expect(n(0.99, { key: 'currency', fallbackWarn: false })).toEqual('$0.99')
    expect(n(1.1111, { key: 'decimal', fallbackWarn: false })).toEqual('1.11')
    expect(n(12345.1161, { key: 'decimal', fallbackWarn: false })).toEqual(
      '12,345.12'
    )
  })
  test('minimumSignificantDigits, maximumSignificantDigits', () => {
    const { n } = createComposer({
      locale: 'en-US',
      fallbackLocale: ['ja-JP'],
      numberFormats: {
        'en-US': {
          decimal: {
            style: 'decimal',
            currency: 'USD',
            minimumSignificantDigits: 3,
            maximumSignificantDigits: 5
          }
        },
        'ja-JP': {
          decimal: {
            style: 'decimal',
            currency: 'JPY',
            minimumSignificantDigits: 3,
            maximumSignificantDigits: 5
          }
        }
      }
    })
    expect(n(1, { key: 'decimal', fallbackWarn: false })).toEqual('1.00')
    expect(n(214528.1161, { key: 'decimal', fallbackWarn: false })).toEqual(
      '214,530'
    )
    expect(n(12145281111, 'decimal')).toEqual('12,145,000,000')
  })

  test('notation', () => {
    const { n } = createComposer({
      locale: 'en-US',
      fallbackLocale: ['ja-JP'],
      numberFormats: {
        'en-US': {
          decimal: {
            style: 'decimal',
            currency: 'USD',
            notation: 'scientific'
          }
        },
        'ja-JP': {
          decimal: {
            style: 'decimal',
            currency: 'JPY',
            notation: 'engineering'
          }
        },
        'zh-CN': {
          decimal: {
            style: 'decimal',
            currency: 'CNY',
            notation: 'compact'
          }
        }
      }
    })
    expect(n(12145281111, { key: 'decimal' })).toEqual('1.215E10')
    expect(n(12145281111, 'decimal', 'ja-JP')).toEqual('12.145E9')
    expect(n(123456789, 'decimal', 'zh-CN')).toEqual('1.2亿')
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

describe('tm', () => {
  test('basic', async () => {
    const composer = createComposer({
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

    let messages1 = composer.tm('foo.bar')
    let messages2 = composer.tm('foo.codes')
    expect(messages1).toEqual({ buz: 'hello' })
    expect(messages2).toEqual({ errors: ['error1', 'error2'] })

    watchEffect(() => {
      messages1 = composer.tm('foo.bar')
      messages2 = composer.tm('foo.codes')
    })

    composer.locale.value = 'en'
    await nextTick()

    expect(messages1).toEqual({ buz: 'hello' })
    expect(messages2).toEqual({ errors: ['error1', 'error2'] })
  })

  test('fallback to local locale', () => {
    const composer = createComposer({
      locale: 'en',
      fallbackLocale: 'ja',
      messages: {
        ja: {
          foo: {
            bar: {
              buz: 'hello'
            }
          }
        }
      }
    })

    const messages1 = composer.tm('foo')
    expect(messages1).toEqual({ bar: { buz: 'hello' } })
  })

  test('fallback to global locale', () => {
    const __root = createComposer({
      locale: 'en',
      fallbackLocale: 'ja',
      messages: {
        ja: {
          foo: {
            bar: {
              buz: 'hello'
            }
          }
        }
      }
    })
    const child = createComposer({
      inheritLocale: true,
      __root
    })

    const messages1 = child.tm('foo')
    expect(messages1).toEqual({ bar: { buz: 'hello' } })
  })

  test('resolved with rt', () => {
    const { rt, tm } = createComposer({
      locale: 'ja',
      messages: {
        en: {},
        ja: {
          foo: {
            bar: {
              buz: 'hello, {name}!'
            },
            codes: {
              errors: [() => 'error1', () => 'error2']
            }
          }
        }
      }
    })

    expect(rt((tm('foo.bar') as any).buz, { name: 'dio' })).toEqual(
      'hello, dio!'
    )
    const errors = tm('foo.codes.errors') as (() => string)[]
    for (const [index, err] of errors.entries()) {
      expect(rt(err)).toEqual(`error${index + 1}`)
    }
  })
})

test('te', async () => {
  const { te } = createComposer({
    locale: 'en',
    messages: {
      en: {
        message: {
          hello: 'Hello!'
        }
      }
    }
  })

  expect(te('message.hello')).toEqual(true)
  expect(te('message.hallo')).toEqual(false)
  expect(te('message.hallo', 'ja')).toEqual(false)
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

    setLocaleMessage('en', { hi: { hi: 'Hi!' } })
    expect(getLocaleMessage('en')).toEqual({ hi: { hi: 'Hi!' } })

    mergeLocaleMessage('en', { hi: { hello: 'Hello!' } })
    expect(getLocaleMessage('en')).toEqual({
      hi: {
        hi: 'Hi!',
        hello: 'Hello!'
      }
    })
  })
})

describe('getDateTimeFormat / setDateTimeFormat / mergeDateTimeFormat', () => {
  test('basic', () => {
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

describe('messageResolver', () => {
  test('basic', () => {
    const fn = jest.fn()
    const mockMessageResolver = fn as jest.MockedFunction<MessageResolver>
    mockMessageResolver.mockImplementation(
      (obj: unknown, path: Path): PathValue => {
        return (obj as any)[path]
      }
    )

    const en = {
      'path.to.message': 'hello'
    }
    const { t } = createComposer({
      locale: 'en',
      messageResolver: fn,
      messages: { en }
    })

    expect(t('path.to.message')).toEqual('hello')
    expect(mockMessageResolver).toHaveBeenCalledTimes(1)
    expect(mockMessageResolver.mock.calls[0][0]).toEqual(en)
    expect(mockMessageResolver.mock.calls[0][1]).toEqual('path.to.message')
  })

  test('fallback', () => {
    const fn = jest.fn()
    const mockMessageResolver = fn as jest.MockedFunction<MessageResolver>
    mockMessageResolver.mockImplementation(
      (obj: unknown, path: Path): PathValue => {
        return (obj as any)[path]
      }
    )

    const ja = {
      'path.to.message': 'こんにちは',
      'api.errors': ['error 1']
    }
    const { t, te, tm } = createComposer({
      locale: 'en',
      fallbackLocale: 'ja',
      messageResolver: fn,
      messages: { ja }
    })

    expect(t('path.to.message')).toEqual('こんにちは')
    expect(te('path.to.message')).toEqual(true)
    expect(tm('api.errors')).toEqual(ja['api.errors'])
    expect(mockMessageResolver).toHaveBeenCalledTimes(5)
    expect(mockMessageResolver.mock.calls[0][0]).toEqual({})
    expect(mockMessageResolver.mock.calls[0][1]).toEqual('path.to.message')
    expect(mockMessageResolver.mock.calls[1][0]).toEqual(ja)
    expect(mockMessageResolver.mock.calls[1][1]).toEqual('path.to.message')
    expect(mockMessageResolver.mock.calls[1][0]).toEqual(ja)
    expect(mockMessageResolver.mock.calls[1][1]).toEqual('path.to.message')
    expect(mockMessageResolver.mock.calls[2][0]).toEqual({})
    expect(mockMessageResolver.mock.calls[2][1]).toEqual('path.to.message')
    expect(mockMessageResolver.mock.calls[3][0]).toEqual({})
    expect(mockMessageResolver.mock.calls[3][1]).toEqual('api.errors')
    expect(mockMessageResolver.mock.calls[4][0]).toEqual(ja)
    expect(mockMessageResolver.mock.calls[4][1]).toEqual('api.errors')
  })
})

describe('__i18n', () => {
  test('locale included locale messages', () => {
    const enResource = {
      locale: '',
      resource: {
        en: { hello: () => 'Hello,world!' }
      }
    }
    const jaResource = {
      locale: '',
      resource: {
        ja: {
          hello: () => 'こんにちは、世界！',
          nest: {
            foo: {
              bar: () => 'ばー'
            }
          }
        }
      }
    }
    const options = {
      __i18n: [enResource, jaResource]
    }
    const { messages } = createComposer(
      options as ComposerOptions<VueMessageType>
    )
    expect(messages.value).toEqual({
      en: enResource.resource.en,
      ja: jaResource.resource.ja
    })
  })

  test('locale not included locale messages', () => {
    const enResource = {
      locale: 'en',
      resource: { hello: () => 'Hello,world!' }
    }
    const jaResource = {
      locale: 'ja',
      resource: {
        hello: () => 'こんにちは、世界！',
        nest: {
          foo: {
            bar: () => 'ばー'
          }
        }
      }
    }
    const options = {
      __i18n: [enResource, jaResource]
    }
    const { messages } = createComposer(
      options as ComposerOptions<VueMessageType>
    )
    expect(messages.value).toEqual({
      en: enResource.resource,
      ja: jaResource.resource
    })
  })

  test('merge locale messages', () => {
    const msgFnEn = () => 'foo'
    const msgFnJa = () => 'ふー'
    const enI18nFn = () => 'Hello,world!'
    const jaI18nFn = () => 'こんにちは、世界！'
    const options = {
      __i18n: [
        {
          locale: 'en',
          resource: { hello: enI18nFn }
        },
        {
          locale: 'ja',
          resource: { hello: jaI18nFn }
        }
      ],
      messages: {
        en: { foo: msgFnEn },
        ja: { foo: msgFnJa }
      }
    }
    const { messages } = createComposer(
      options as ComposerOptions<VueMessageType>
    )
    expect(messages.value!.en).toEqual({
      hello: enI18nFn,
      foo: msgFnEn
    })
    expect(messages.value!.ja).toEqual({
      hello: jaI18nFn,
      foo: msgFnJa
    })
  })

  test('deepCopy', () => {
    const options = {
      __i18n: [
        {
          locale: 'en',
          resource: {
            str: 'str_custom',
            array1: ['array1_custom'],
            array2: ['array2_custom'],
            array3: ['array3_custom'],
            map1: { key1: 'key1_custom' },
            map2: { key1: 'key1_custom' },
            map3: { key1: 'key1_custom' }
          }
        }
      ],
      messages: {
        en: {
          str: 'str_messages',
          array2: ['array2_messages'],
          array3: { key1: 'array3_messages' },
          map1: { key1: 'key1_messages', key2: 'key2_messages' },
          map2: 'map2_messages',
          map3: ['key1_messages']
        }
      }
    }
    const { messages } = createComposer(
      options as ComposerOptions<VueMessageType>
    )
    expect(messages.value!.en).toEqual({
      str: 'str_custom',
      array1: ['array1_custom'],
      array2: ['array2_custom'],
      array3: ['array3_custom'],
      map1: { key1: 'key1_custom', key2: 'key2_messages' },
      map2: { key1: 'key1_custom' },
      map3: { key1: 'key1_custom' }
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
      (composer as any)[TransrateVNodeSymbol]('hello', {
        name: createVNode(Text, null, 'kazupon', 0)
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
      (composer as any)[TransrateVNodeSymbol]('hello', {
        name: createVNode(Text, null, 'kazupon', 0)
      })
    ).toMatchSnapshot()
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
      (composer as any)[NumberPartsSymbol](0.99, {
        key: 'percent',
        part: true
      })
    ).toMatchObject([{ value: '99' }, { value: '%' }])
  })

  test('missing', () => {
    const composer = createComposer({
      locale: 'en-US',
      numberFormats: {
        'en-US': {}
      }
    })
    expect(
      (composer as any)[NumberPartsSymbol](0.99, {
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
      (composer as any)[DatetimePartsSymbol](dt, {
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
      (composer as any)[DatetimePartsSymbol](dt, {
        key: 'short',
        part: true
      })
    ).toEqual([])
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

/* eslint-enable @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any */
