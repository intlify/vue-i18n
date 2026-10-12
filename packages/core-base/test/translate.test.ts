import { baseCompile } from '@intlify/message-compiler'
import { ast } from './fixtures/ast'

// utils
import * as shared from '@intlify/shared'
vi.mock('@intlify/shared', async () => {
  const actual = await vi.importActual<object>('@intlify/shared')
  return {
    ...actual,
    warn: vi.fn(),
    warnOnce: vi.fn()
  }
})

import { compile } from '../src/compilation'
import { createCoreContext, NOT_RESOLVED } from '../src/context'
import { CoreErrorCodes, errorMessages } from '../src/errors'
import { fallbackWithLocaleChain } from '../src/fallbacker'
import { resolveValue, resolveWithKeyValue } from '../src/resolver'
import { translate } from '../src/translate'
import { createTextNode } from './helper'

import type {
  MessageContext,
  MessageFunctionReturn,
  MessageProcessor,
  MessageType
} from '../src/runtime'
import type { PickupKeys } from '../src/types/utils'
import type { VNode } from './helper'

function context<Message = string>(options: any = {}): any {
  return createCoreContext<Message>({
    messageCompiler: compile,
    messageResolver: resolveValue,
    localeFallbacker: fallbackWithLocaleChain,
    ...options
  })
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('features', () => {
  test('simple text', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: { hi: 'hi kazupon !' }
      }
    })
    expect(translate(ctx, 'hi')).toEqual('hi kazupon !')
  })

  test('list', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: { hi: 'hi {0} !', nest: { foo: '' } }
      }
    })
    expect(translate(ctx, 'hi', ['kazupon'])).toEqual('hi kazupon !')
  })

  test('named', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: { hi: 'hi {name} !' }
      }
    })
    expect(translate(ctx, 'hi', { name: 'kazupon' })).toEqual('hi kazupon !')
  })

  test('linked', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: {
          name: 'kazupon',
          hi: 'hi @.upper:name !'
        }
      }
    })
    expect(translate(ctx, 'hi')).toEqual('hi KAZUPON !')
  })

  test('linked with modifier and missing key', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: {
          greeting: 'hello @.upper:nonExistent !'
        }
      }
    })
    expect(translate(ctx, 'greeting')).toEqual('hello NONEXISTENT !')
  })

  test('linked with a modifier that is not found', () => {
    const mockWarnOnce = vi.spyOn(shared, 'warnOnce')
    mockWarnOnce.mockImplementation(() => {})

    const ctx = context({
      locale: 'en',
      modifiers: { snakeCase: (str: string) => str.split(' ').join('_') },
      messages: {
        en: {
          name: 'hello world',
          typo: 'hi @.Upper:name !',
          builtin: 'hi @.toString:name !',
          custom: 'hi @.snakeCase:name !'
        }
      }
    })
    // the modifier is ignored, instead of throwing a TypeError
    expect(translate(ctx, 'typo')).toEqual('hi hello world !')
    expect(translate(ctx, 'builtin')).toEqual('hi hello world !')
    expect(translate(ctx, 'custom')).toEqual('hi hello_world !')
    expect(mockWarnOnce).toHaveBeenCalledTimes(2)
    expect(mockWarnOnce.mock.calls[0][0]).toEqual(
      `Not found 'Upper' modifier for the linked message of 'name' key. ` +
        `Use a built-in modifier, or set a custom modifier with 'modifiers' option. ` +
        `So the linked message is used as is.`
    )
  })

  test('plural', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: { apple: 'no apples | one apple | {count} apples' }
      }
    })
    expect(translate(ctx, 'apple', 0)).toEqual('no apples')
    expect(translate(ctx, 'apple', 1)).toEqual('one apple')
    expect(translate(ctx, 'apple', 10)).toEqual('10 apples')
    expect(translate(ctx, 'apple', { count: 20 }, 10)).toEqual('20 apples')
  })

  test('plural with named n parameter should not override plural index', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: { test: 'one | {n}' }
      }
    })
    // plural=1 (first form), named.n=2 → should select "one"
    expect(translate(ctx, 'test', { n: 2 }, 1)).toEqual('one')
    // plural=2 (second form), named.n=1 → should select "{n}" and display 1
    expect(translate(ctx, 'test', { n: 1 }, 2)).toEqual('1')
  })

  test('plural with named n=0 should preserve zero value', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: {
          testN: 'none | {n} item | {n} items',
          testCount: 'none | {count} item | {count} items'
        }
      }
    })
    // named.n=0 with plural=3 → should select third form and display n=0
    expect(translate(ctx, 'testN', { n: 0 }, 3)).toEqual('0 items')
    // named.count=0 with plural=3 → should select third form and display count=0
    expect(translate(ctx, 'testCount', { count: 0 }, 3)).toEqual('0 items')
  })

  test('plural does not write count and n into the named values', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: {
          apple: 'no apples | one apple | {count} apples for {name}',
          values: (ctx: MessageContext) => JSON.stringify(ctx.values)
        }
      }
    })
    const named = { name: 'vue' }
    expect(translate(ctx, 'apple', named, 2)).toEqual('2 apples for vue')
    expect(named).toEqual({ name: 'vue' })
    // the same named values with other counts
    expect(translate(ctx, 'apple', named, 7)).toEqual('7 apples for vue')
    expect(translate(ctx, 'apple', named, 1)).toEqual('one apple')
    // frozen named values
    expect(translate(ctx, 'apple', Object.freeze({ name: 'vue' }), 3)).toEqual('3 apples for vue')
    // custom message compilers still get count and n from the values
    expect(translate(ctx, 'values', named, 2)).toEqual('{"name":"vue","count":2,"n":2}')
    expect(named).toEqual({ name: 'vue' })
  })
})

describe('locale option', () => {
  test('specify', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: { hi: 'hi kazupon !' },
        ja: { hi: 'こんにちは　かずぽん！' }
      }
    })
    expect(translate(ctx, 'hi', {}, { locale: 'ja' })).toEqual('こんにちは　かずぽん！')
  })
})

describe('default option', () => {
  test('string message', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: {}
      }
    })
    expect(translate(ctx, 'hello', 'hello, default message!')).toEqual('hello, default message!')
    expect(translate(ctx, 'hello', '')).toEqual('')
  })

  test('boolean true', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: {}
      }
    })
    expect(translate(ctx, 'hi {name}!', { name: 'kazupon' }, { default: true })).toEqual(
      'hi kazupon!'
    )
  })
})

describe('context fallbackLocale option', () => {
  test('false', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})

    const ctx = context({
      locale: 'en',
      fallbackLocale: false,
      messages: {
        en: {}
      }
    })

    expect(translate(ctx, 'hello')).toEqual('hello')
    expect(mockWarn.mock.calls[0][0]).toEqual(`Not found 'hello' key in 'en' locale messages.`)
  })

  test('string', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})

    const ctx = context({
      locale: 'en',
      fallbackLocale: 'ja',
      messages: {
        en: {},
        ja: {
          hello: 'こんにちは！'
        }
      }
    })

    expect(translate(ctx, 'hello')).toEqual('こんにちは！')
    expect(mockWarn.mock.calls[0][0]).toEqual(`Not found 'hello' key in 'en' locale messages.`)
  })

  test('array', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})

    const ctx = context({
      locale: 'en',
      fallbackLocale: ['ja'],
      messages: {
        en: {},
        ja: {
          hello: 'こんにちは！'
        }
      }
    })

    expect(translate(ctx, 'hello')).toEqual('こんにちは！')
    expect(mockWarn.mock.calls[0][0]).toEqual(`Not found 'hello' key in 'en' locale messages.`)
  })
})

describe('context missing option', () => {
  test('not specified missing handler', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})

    const ctx = context({
      locale: 'en',
      messages: {
        en: {}
      }
    })

    expect(translate(ctx, 'hello')).toEqual('hello')
    expect(mockWarn.mock.calls[0][0]).toEqual(`Not found 'hello' key in 'en' locale messages.`)
  })

  test('specified missing handler', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})

    const ctx = context({
      locale: 'en',
      missing: (c: any, locale: any, key: any) => {
        expect(c).toEqual(ctx)
        expect(locale).toEqual('en')
        expect(key).toEqual('hello')
        return 'HELLO'
      },
      messages: {
        en: {}
      }
    })
    expect(translate(ctx, 'hello')).toEqual('HELLO')
    expect(mockWarn).not.toHaveBeenCalled()
  })
})

describe('context missingWarn option', () => {
  test('false', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})

    const ctx = context({
      locale: 'en',
      fallbackWarn: false,
      missingWarn: false,
      messages: {
        en: {}
      }
    })

    expect(translate(ctx, 'hello')).toEqual('hello')
    expect(mockWarn).not.toHaveBeenCalled()
  })

  test('regex', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})

    const ctx = context({
      locale: 'en',
      fallbackWarn: false,
      missingWarn: /^hi/,
      messages: {
        en: {}
      }
    })

    expect(translate(ctx, 'hi kazupon!')).toEqual('hi kazupon!')
    expect(translate(ctx, 'hello')).toEqual('hello')
    expect(mockWarn).toHaveBeenCalledTimes(1)
    expect(mockWarn.mock.calls[0][0]).not.toEqual(`Not found 'hello' key in 'en' locale messages.`)
  })

  test('missingWarn option', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})

    const ctx = context({
      locale: 'en',
      fallbackWarn: false,
      messages: {
        en: {}
      }
    })

    expect(translate(ctx, 'hello', {}, { missingWarn: false })).toEqual('hello')
    expect(mockWarn).not.toHaveBeenCalled()
  })
})

describe('context fallbackWarn option', () => {
  test('not specify fallbackLocale', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})

    const ctx = context({
      locale: 'en',
      missingWarn: false,
      messages: {
        en: {}
      }
    })

    expect(translate(ctx, 'hello')).toEqual('hello')
    expect(mockWarn).not.toHaveBeenCalled()
  })

  test('specify fallbackLocale', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})

    const ctx = context({
      locale: 'en',
      fallbackLocale: ['ja'],
      missingWarn: false,
      messages: {
        en: {},
        ja: {
          hello: 'こんにちは！'
        }
      }
    })

    expect(translate(ctx, 'hello')).toEqual('こんにちは！')
    expect(mockWarn).toHaveBeenCalled()
    expect(mockWarn.mock.calls[0][0]).toEqual(
      `Fall back to translate 'hello' key with 'ja' locale.`
    )
  })

  test('not found fallback message', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})

    const ctx = context({
      locale: 'en',
      fallbackLocale: ['ja', 'fr'],
      missingWarn: false,
      messages: {
        en: {},
        ja: {}
      }
    })

    expect(translate(ctx, 'hello.world')).toEqual('hello.world')
    expect(mockWarn).toHaveBeenCalledTimes(2)
    expect(mockWarn.mock.calls[0][0]).toEqual(
      `Fall back to translate 'hello.world' key with 'ja' locale.`
    )
    expect(mockWarn.mock.calls[1][0]).toEqual(
      `Fall back to translate 'hello.world' key with 'fr' locale.`
    )
  })

  test('context option: false', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})

    const ctx = context({
      locale: 'en',
      fallbackLocale: ['ja', 'fr'],
      missingWarn: false,
      fallbackWarn: false,
      messages: {
        en: {},
        ja: {}
      }
    })

    expect(translate(ctx, 'hello.world')).toEqual('hello.world')
    expect(mockWarn).toHaveBeenCalledTimes(0)
  })

  test('context option: regex', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})

    const ctx = context({
      locale: 'en',
      fallbackLocale: ['ja', 'fr'],
      missingWarn: false,
      fallbackWarn: /^hello/,
      messages: {
        en: {},
        ja: {}
      }
    })

    expect(translate(ctx, 'hello.world')).toEqual('hello.world')
    expect(mockWarn).toHaveBeenCalledTimes(2)
  })

  test('specify fallbackWarn option to translate function', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})

    const ctx = context({
      locale: 'en',
      fallbackLocale: ['ja'],
      missingWarn: false,
      messages: {
        en: {},
        ja: {
          hello: 'こんにちは！'
        }
      }
    })

    expect(translate(ctx, 'hello')).toEqual('こんにちは！')
    expect(translate(ctx, 'hi', {}, { fallbackWarn: false })).toEqual('hi')
    expect(mockWarn).toHaveBeenCalledTimes(1)
  })
})

describe('context fallbackFormat option', () => {
  test('specify true', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})

    const ctx = context({
      locale: 'en',
      fallbackLocale: ['ja', 'fr'],
      fallbackFormat: true,
      messages: {
        en: {},
        ja: {},
        fr: {}
      }
    })

    expect(translate(ctx, 'hi, {name}!', { name: 'kazupon' })).toEqual('hi, kazupon!')
    expect(mockWarn).toHaveBeenCalledTimes(5)
    expect(mockWarn.mock.calls[0][0]).toEqual(
      `Not found 'hi, {name}!' key in 'en' locale messages.`
    )
    expect(mockWarn.mock.calls[1][0]).toEqual(
      `Fall back to translate 'hi, {name}!' key with 'ja' locale.`
    )
    expect(mockWarn.mock.calls[2][0]).toEqual(
      `Not found 'hi, {name}!' key in 'ja' locale messages.`
    )
    expect(mockWarn.mock.calls[3][0]).toEqual(
      `Fall back to translate 'hi, {name}!' key with 'fr' locale.`
    )
    expect(mockWarn.mock.calls[4][0]).toEqual(
      `Not found 'hi, {name}!' key in 'fr' locale messages.`
    )
  })

  test('overridden with default option', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})

    const ctx = context({
      locale: 'en',
      fallbackLocale: ['ja', 'fr'],
      fallbackFormat: true,
      messages: {
        en: {},
        ja: {},
        fr: {}
      }
    })

    expect(translate(ctx, 'hi, {name}!', { name: 'kazupon' }, 'hello, {name}!')).toEqual(
      'hello, kazupon!'
    )
    expect(mockWarn).toHaveBeenCalledTimes(5)
    expect(mockWarn.mock.calls[0][0]).toEqual(
      `Not found 'hi, {name}!' key in 'en' locale messages.`
    )
    expect(mockWarn.mock.calls[1][0]).toEqual(
      `Fall back to translate 'hi, {name}!' key with 'ja' locale.`
    )
    expect(mockWarn.mock.calls[2][0]).toEqual(
      `Not found 'hi, {name}!' key in 'ja' locale messages.`
    )
    expect(mockWarn.mock.calls[3][0]).toEqual(
      `Fall back to translate 'hi, {name}!' key with 'fr' locale.`
    )
    expect(mockWarn.mock.calls[4][0]).toEqual(
      `Not found 'hi, {name}!' key in 'fr' locale messages.`
    )
  })

  test('fallbackLocales is nothing', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})

    const ctx = context({
      locale: 'en',
      fallbackFormat: true,
      messages: {
        en: {}
      }
    })

    expect(translate(ctx, 'hi, {name}!', { name: 'kazupon' }, 'hello, {name}!')).toEqual(
      'hello, kazupon!'
    )
    expect(mockWarn).toHaveBeenCalledTimes(1)
    expect(mockWarn.mock.calls[0][0]).toEqual(
      `Not found 'hi, {name}!' key in 'en' locale messages.`
    )
  })

  test('runtimeOnly', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})

    const ctx = context({
      locale: 'en',
      fallbackFormat: true,
      messages: {
        en: {}
      }
    })
    ctx.messageCompiler = null

    expect(translate(ctx, 'hi, {name}!', { name: 'kazupon' })).toEqual('hi, {name}!')
    expect(mockWarn).toHaveBeenCalledTimes(1)
    expect(mockWarn.mock.calls[0][0]).toEqual(
      `Not found 'hi, {name}!' key in 'en' locale messages.`
    )
  })
})

describe('context unresolving option', () => {
  test('fallbackWarn is truth', () => {
    const ctx = context({
      locale: 'en',
      fallbackLocale: ['ja', 'fr'],
      missingWarn: false,
      fallbackWarn: /^hello/,
      unresolving: true,
      messages: {
        en: {},
        ja: {}
      }
    })
    expect(translate(ctx, 'hello.world')).toEqual(NOT_RESOLVED)
  })

  test('fallbackWarn is false', () => {
    const ctx = context({
      locale: 'en',
      fallbackLocale: ['ja', 'fr'],
      missingWarn: false,
      fallbackWarn: false,
      unresolving: true,
      messages: {
        en: {},
        ja: {}
      }
    })
    expect(translate(ctx, 'hello.world')).toEqual(NOT_RESOLVED)
  })

  test('fallbackFormat is true', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})

    const ctx = context({
      locale: 'en',
      fallbackLocale: ['ja', 'fr'],
      fallbackFormat: true,
      unresolving: true,
      messages: {
        en: {},
        ja: {}
      }
    })
    expect(translate(ctx, 'hi, {name}!', { name: 'kazupon' })).toEqual('hi, kazupon!')
  })
})

describe('context pluralRule option', () => {
  test('basic', () => {
    const pluralRules = {
      ru: (choice: number, choicesLength: number) => {
        if (choice === 0) {
          return 0
        }

        const teen = choice > 10 && choice < 20
        const endsWithOne = choice % 10 === 1
        if (!teen && endsWithOne) {
          return 1
        }
        if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
          return 2
        }

        return choicesLength < 4 ? 2 : 3
      }
    }
    const ctx = context({
      locale: 'ru',
      pluralRules,
      messages: {
        ru: {
          car: '0 машин | {n} машина | {n} машины | {n} машин'
        }
      }
    })
    expect(translate(ctx, 'car', 1)).toEqual('1 машина')
    expect(translate(ctx, 'car', 2)).toEqual('2 машины')
    expect(translate(ctx, 'car', 4)).toEqual('4 машины')
    expect(translate(ctx, 'car', 12)).toEqual('12 машин')
    expect(translate(ctx, 'car', 21)).toEqual('21 машина')
  })
})

describe('Intl.PluralRules based default plural', () => {
  test('English 2 cases - same behavior as before', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: {
          car: 'car | cars'
        }
      }
    })
    expect(translate(ctx, 'car', 1)).toEqual('car')
    expect(translate(ctx, 'car', 2)).toEqual('cars')
    expect(translate(ctx, 'car', 0)).toEqual('cars')
  })

  test('English 3 cases - falls back to pluralDefault', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: {
          apple: 'no apples | one apple | {count} apples'
        }
      }
    })
    expect(translate(ctx, 'apple', 0)).toEqual('no apples')
    expect(translate(ctx, 'apple', 1)).toEqual('one apple')
    expect(translate(ctx, 'apple', 10)).toEqual('10 apples')
  })

  test('Russian 4 cases - auto plural via Intl.PluralRules without custom pluralRules', () => {
    const ctx = context({
      locale: 'ru',
      messages: {
        ru: {
          // CLDR order for Russian: one | few | many | other
          car: '{n} машина | {n} машины | {n} машин | {n} машин'
        }
      }
    })
    expect(translate(ctx, 'car', 1)).toEqual('1 машина')
    expect(translate(ctx, 'car', 2)).toEqual('2 машины')
    expect(translate(ctx, 'car', 5)).toEqual('5 машин')
    expect(translate(ctx, 'car', 21)).toEqual('21 машина')
    expect(translate(ctx, 'car', 11)).toEqual('11 машин')
    expect(translate(ctx, 'car', 22)).toEqual('22 машины')
  })

  test('custom pluralRules takes priority over Intl.PluralRules', () => {
    const customRule = (choice: number, _choicesLength: number) => {
      return choice === 42 ? 0 : 1
    }
    const ctx = context({
      locale: 'en',
      pluralRules: { en: customRule },
      messages: {
        en: {
          msg: 'special | normal'
        }
      }
    })
    expect(translate(ctx, 'msg', 42)).toEqual('special')
    expect(translate(ctx, 'msg', 1)).toEqual('normal')
  })

  test('Arabic plural categories', () => {
    const ctx = context({
      locale: 'ar',
      messages: {
        ar: {
          // CLDR order for Arabic: zero | one | two | few | many | other
          file: 'لا ملفات | ملف واحد | ملفان | {n} ملفات | {n} ملفًا | {n} ملف'
        }
      }
    })
    expect(translate(ctx, 'file', 0)).toEqual('لا ملفات')
    expect(translate(ctx, 'file', 1)).toEqual('ملف واحد')
    expect(translate(ctx, 'file', 2)).toEqual('ملفان')
  })

  test('falls back to pluralDefault for a locale that is not a language tag', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})
    const ctx = context({
      locale: 'pt_BR',
      messages: {
        pt_BR: {
          apple: 'no apples | one apple | {count} apples',
          car: 'car | cars'
        }
      }
    })
    expect(translate(ctx, 'apple', 0)).toEqual('no apples')
    expect(translate(ctx, 'apple', 1)).toEqual('one apple')
    expect(translate(ctx, 'apple', 2)).toEqual('2 apples')
    expect(translate(ctx, 'car', 1)).toEqual('car')
    expect(translate(ctx, 'car', 2)).toEqual('cars')
    expect(translate(ctx, 'a | b | c', 2, { resolvedMessage: true })).toEqual('c')
    expect(mockWarn).toHaveBeenCalledTimes(1)
    expect(mockWarn.mock.calls[0][0]).toEqual(
      `Fall back to the default plural rule for 'pt_BR' locale: Intl.PluralRules does not support it`
    )
  })

  test('falls back to pluralDefault for a locale that Intl.PluralRules does not support', () => {
    // emulate a runtime whose default locale is `ru`: Intl.PluralRules uses the rules of the default
    // locale for a locale that it does not support
    const IntlPluralRules = Intl.PluralRules
    vi.stubGlobal(
      'Intl',
      Object.assign(Object.create(Intl), {
        PluralRules: class extends IntlPluralRules {
          constructor(locales?: string | string[], options?: Intl.PluralRulesOptions) {
            super(
              IntlPluralRules.supportedLocalesOf(locales ?? []).length > 0 ? locales : 'ru',
              options
            )
          }
        }
      })
    )
    try {
      const mockWarn = vi.spyOn(shared, 'warn')
      mockWarn.mockImplementation(() => {})
      const ctx = context({
        locale: 'xx',
        messages: {
          xx: {
            apple: 'no apples | one apple | {count} apples'
          }
        }
      })
      expect(translate(ctx, 'apple', 0)).toEqual('no apples')
      expect(translate(ctx, 'apple', 1)).toEqual('one apple')
      expect(translate(ctx, 'apple', 2)).toEqual('2 apples')
      expect(mockWarn).toHaveBeenCalledTimes(1)
      expect(mockWarn.mock.calls[0][0]).toEqual(
        `Fall back to the default plural rule for 'xx' locale: Intl.PluralRules does not support it`
      )
    } finally {
      vi.unstubAllGlobals()
    }
  })

  test('keeps the cache of Intl.PluralRules within its size', () => {
    // count the Intl.PluralRules instances that are created
    const IntlPluralRules = Intl.PluralRules
    let created = 0
    vi.stubGlobal(
      'Intl',
      Object.assign(Object.create(Intl), {
        PluralRules: class extends IntlPluralRules {
          constructor(locales?: string | string[], options?: Intl.PluralRulesOptions) {
            super(locales, options)
            created++
          }
        }
      })
    )
    try {
      const ctx = context({ locale: 'en', messages: {} })
      const plural = (locale: string) =>
        translate(ctx, 'a | b', 1, { resolvedMessage: true, locale })
      for (let i = 0; i <= 1000; i++) {
        plural(`en-x-size${i}`)
      }
      expect(created).toEqual(1001)
      // the newest locale is in the cache
      plural('en-x-size1000')
      expect(created).toEqual(1001)
      // the oldest locale has been deleted from the cache
      plural('en-x-size0')
      expect(created).toEqual(1002)
    } finally {
      vi.unstubAllGlobals()
    }
  })
})

describe('context postTranslation option', () => {
  test('basic', () => {
    let key = ''
    const postTranslation = (str: MessageFunctionReturn<string>, _key: string) => {
      key = _key
      return str.trim()
    }
    const ctx = context({
      locale: 'en',
      postTranslation,
      messages: {
        en: {
          hello: ' hello world! '
        }
      }
    })
    expect(translate(ctx, 'hello')).toEqual('hello world!')
    expect(key).toEqual('hello')
  })
})

describe('warnHtmlMessage', () => {
  test('default', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})

    const ctx = context({
      locale: 'en',
      messages: {
        en: {
          hello: '<p>hello</p>'
        }
      }
    })

    expect(translate(ctx, 'hello')).toEqual('<p>hello</p>')
    expect(mockWarn).toHaveBeenCalled()
  })
})

describe('escapeParameter', () => {
  test('context option', () => {
    const ctx = context({
      locale: 'en',
      warnHtmlMessage: false,
      escapeParameter: true,
      messages: {
        en: {
          hello: 'hello, {name}!'
        }
      }
    })

    expect(translate(ctx, 'hello', { name: '<b>kazupon</b>' })).toEqual(
      'hello, &lt;b&gt;kazupon&lt;&#x2F;b&gt;!'
    )
  })

  test('override with params', () => {
    const ctx = context({
      locale: 'en',
      warnHtmlMessage: false,
      escapeParameter: false,
      messages: {
        en: {
          hello: 'hello, {0}!'
        }
      }
    })

    expect(translate(ctx, 'hello', ['<b>kazupon</b>'], { escapeParameter: true })).toEqual(
      'hello, &lt;b&gt;kazupon&lt;&#x2F;b&gt;!'
    )
  })

  test('escape both list and named values', () => {
    const ctx = context({
      locale: 'en',
      warnHtmlMessage: false,
      escapeParameter: true,
      messages: {
        en: {
          hello: '{0}, {name}!'
        }
      }
    })

    expect(
      translate(ctx, 'hello', ['<b>hello</b>'], { named: { name: '<b>kazupon</b>' } })
    ).toEqual('&lt;b&gt;hello&lt;&#x2F;b&gt;, &lt;b&gt;kazupon&lt;&#x2F;b&gt;!')
  })

  test('keep the named values of the caller as they are', () => {
    const ctx = context({
      locale: 'en',
      warnHtmlMessage: false,
      escapeParameter: true,
      messages: {
        en: {
          hello: 'hello, {name}!'
        }
      }
    })
    const named = { name: '<b>kazupon</b>' }

    expect(translate(ctx, 'hello', named)).toEqual('hello, &lt;b&gt;kazupon&lt;&#x2F;b&gt;!')
    // the same object is not escaped twice on the next call
    expect(translate(ctx, 'hello', named)).toEqual('hello, &lt;b&gt;kazupon&lt;&#x2F;b&gt;!')
    expect(named).toEqual({ name: '<b>kazupon</b>' })
  })

  test('no escape', () => {
    const ctx = context({
      locale: 'en',
      warnHtmlMessage: false,
      escapeParameter: false,
      messages: {
        en: {
          hello: 'hello, {name}!'
        }
      }
    })

    expect(translate(ctx, 'hello', { name: '<b>kazupon</b>' })).toEqual('hello, <b>kazupon</b>!')
  })

  test('vulnerable case from GHSA report - img onerror attack', () => {
    // Mock console.warn to suppress warnings for this test
    const originalWarn = console.warn
    console.warn = vi.fn()

    const ctx = context({
      locale: 'en',
      warnHtmlMessage: false,
      escapeParameter: true,
      messages: {
        en: {
          vulnerable: 'Caution: <img src=x onerror="{payload}">'
        }
      }
    })

    const result = translate(ctx, 'vulnerable', {
      payload: '<script>alert("xss")</script>'
    })

    // with the fix, the payload should be escaped, preventing the attack
    // The onerror attribute is neutralized by converting 'o' to &#111;
    expect(result).toEqual(
      'Caution: <img src=x &#111;nerror="&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;">'
    )

    // result should NOT contain executable script tags
    expect(result).not.toContain('<script>')
    expect(result).not.toContain('</script>')

    // Restore console.warn
    console.warn = originalWarn
  })

  test('vulnerable case - attribute injection attack', () => {
    const ctx = context({
      locale: 'en',
      warnHtmlMessage: false,
      escapeParameter: true,
      messages: {
        en: {
          message: 'Click <a href="{url}">here</a>'
        }
      }
    })

    const result = translate(ctx, 'message', {
      url: 'javascript:alert(1)'
    })

    // with the fix, javascript: URLs are replaced with a non-executable value
    expect(result).toEqual('Click <a href="about:blank">here</a>')

    // another attack vector with quotes
    const result2 = translate(ctx, 'message', {
      url: '" onclick="alert(1)"'
    })

    expect(result2).toEqual('Click <a href="&quot; onclick&#x3D;&quot;alert(1)&quot;">here</a>')

    // `onclick` attribute should be escaped
    expect(result2).not.toContain('onclick=')
  })

  test('neutralize srcdoc in messages and in parameters', () => {
    const ctx = context({
      locale: 'en',
      warnHtmlMessage: false,
      escapeParameter: true,
      messages: {
        en: {
          inMessage: '<iframe srcdoc="<b>x</b>"></iframe>',
          inParameter: '<iframe srcdoc="{content}"></iframe>'
        }
      }
    })

    expect(translate(ctx, 'inMessage')).toEqual(
      '<iframe &#115;rcdoc="&lt;b&gt;x&lt;/b&gt;"></iframe>'
    )
    // escaping the parameter alone is undone when the `srcdoc` value is decoded
    expect(translate(ctx, 'inParameter', { content: '<b>x</b>' })).toEqual(
      '<iframe &#115;rcdoc="&lt;b&gt;x&lt;&#x2F;b&gt;"></iframe>'
    )
  })
})

describe('error', () => {
  test(errorMessages[CoreErrorCodes.INVALID_ARGUMENT], () => {
    const ctx = context({
      locale: 'ja',
      messages: {
        ja: {}
      }
    })
    expect(() => {
      translate(ctx, {} as any)
    }).toThrowError(errorMessages[CoreErrorCodes.INVALID_ARGUMENT])
  })
})

test('resolvedMessage', () => {
  const ctx = context({
    locale: 'en',
    messages: {
      en: {}
    }
  })
  expect(translate(ctx, 'car', 1, { resolvedMessage: true })).toEqual('car')
  expect(
    translate(ctx, () => 'hello!', 1, {
      resolvedMessage: true
    })
  ).toEqual('hello!')
  expect(translate(ctx, 'list {0}', [1], { resolvedMessage: true })).toEqual('list 1')
  expect(
    // oxlint-disable-next-line @typescript-eslint/restrict-template-expressions --- ignore for testing
    translate(ctx, (ctx: MessageContext) => `list ${ctx.list(0)}`, [1], {
      resolvedMessage: true
    })
  ).toEqual('list 1')
  expect(translate(ctx, 'named {name}', { name: 'dio' }, { resolvedMessage: true })).toEqual(
    'named dio'
  )
  expect(
    translate(
      ctx,
      // oxlint-disable-next-line @typescript-eslint/restrict-template-expressions --- ignore for testing
      (ctx: MessageContext) => `named ${ctx.named('name')}`,
      { name: 'dio' },
      { resolvedMessage: true }
    )
  ).toEqual('named dio')
})

const ErrorCodes = {
  CODE1: 1
} as const

type ErrorCodes = (typeof ErrorCodes)[keyof typeof ErrorCodes]

describe('message compiler', () => {
  test('warn without a message compiler', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})

    const ctx = createCoreContext({
      locale: 'en',
      messages: {
        en: { hello: 'hello {name}' }
      }
    })

    // the message is returned as is, as in production
    expect(translate(ctx, 'hello', { name: 'core' })).toEqual('hello {name}')
    expect(mockWarn.mock.calls[0][0]).toEqual(
      `Cannot compile the message of 'hello' key, because no message compiler is set. ` +
        `Use 'messageCompiler' option of 'createCoreContext', or pre-compile the message. ` +
        `So translate function returns the message as is.`
    )
    // the default message too
    expect(translate(ctx, 'missing', {}, { default: 'hi {name}', missingWarn: false })).toEqual(
      'hi {name}'
    )
  })
})

describe('edge cases', () => {
  test('multi bytes key', () => {
    const ctx = context({
      locale: 'ja',
      messages: {
        ja: {
          こんにちは: 'こんにちは！'
        }
      }
    })
    expect(translate(ctx, 'こんにちは')).toEqual('こんにちは！')
  })

  test('object path key', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: {
          'side.left': 'Left'
        }
      }
    })
    expect(translate(ctx, 'side.left')).toEqual('Left')
  })

  test('computed property name', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: {
          [ErrorCodes.CODE1]: 'error code1'
        }
      }
    })
    expect(translate(ctx, ErrorCodes.CODE1)).toEqual('error code1')
  })
})

describe('fallback context', () => {
  test('root (parent context)', () => {
    const parent = context({
      locale: 'en',
      messages: {
        en: { hello: 'hello man!', hi: 'hi' }
      }
    })

    const ctx = context({
      locale: 'en',
      messages: {
        en: { hi: 'hi! @:hello' }
      }
    })
    ctx.fallbackContext = parent

    expect(translate(ctx, 'hi')).toEqual('hi! hello man!')
  })

  test('local (self context)', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: {
          apples: 'Apples',
          no_results: 'No @.lower:{0} found'
        },
        'en-variant': {
          no_results: 'No @.lower:{0} found'
        }
      }
    })

    expect(translate(ctx, 'no_results', ['apples'])).toEqual('No apples found')
    expect(translate(ctx, 'no_results', ['apples'], { locale: 'en-variant' })).toEqual(
      'No apples found'
    )
  })
})

describe('processor', () => {
  // VNode processor
  function normalize(values: MessageType<string | VNode>[]): MessageType<VNode>[] {
    return values.map(val =>
      shared.isString(val) || shared.isNumber(val) || shared.isBoolean(val)
        ? createTextNode(String(val))
        : val
    )
  }
  const interpolate = (val: unknown): MessageType<VNode> => val as VNode
  const processor = {
    normalize,
    interpolate,
    type: 'vnode'
  } as MessageProcessor<VNode>

  test('basic', () => {
    const ctx = context<VNode>({
      locale: 'en',
      messages: {
        en: { hi: 'hi kazupon !' }
      }
    })
    ctx.processor = processor
    expect(
      // @ts-ignore -- deep type instantiation with any context
      translate<typeof ctx, string, PickupKeys<typeof ctx.messages>, VNode>(ctx, 'hi')
    ).toEqual([{ __v_isVNode: true, children: 'hi kazupon !' }])
  })

  test('list', () => {
    const ctx = context<VNode>({
      locale: 'en',
      messages: {
        en: { hi: 'hi {0} !', nest: { foo: '' } }
      }
    })
    ctx.processor = processor
    expect(
      translate<typeof ctx, string, PickupKeys<typeof ctx.messages>, VNode>(ctx, 'hi', ['kazupon'])
    ).toEqual([
      { __v_isVNode: true, children: 'hi ' },
      { __v_isVNode: true, children: 'kazupon' },
      { __v_isVNode: true, children: ' !' }
    ])
  })

  test('named', () => {
    const ctx = context<VNode>({
      locale: 'en',
      messages: {
        en: { hi: 'hi {name} !' }
      }
    })
    ctx.processor = processor
    expect(
      translate<typeof ctx, string, PickupKeys<typeof ctx.messages>, VNode>(ctx, 'hi', {
        name: 'kazupon'
      })
    ).toEqual([
      { __v_isVNode: true, children: 'hi ' },
      { __v_isVNode: true, children: 'kazupon' },
      { __v_isVNode: true, children: ' !' }
    ])
  })

  test('linked', () => {
    const ctx = context<VNode>({
      locale: 'en',
      messages: {
        en: {
          name: 'kazupon',
          hi: 'hi @.upper:name !'
        }
      }
    })
    ctx.processor = processor
    expect(
      translate<typeof ctx, string, PickupKeys<typeof ctx.messages>, VNode>(ctx, 'hi')
    ).toEqual([
      { __v_isVNode: true, children: 'hi ' },
      { __v_isVNode: true, children: 'KAZUPON' },
      { __v_isVNode: true, children: ' !' }
    ])
  })

  test('linked with a modifier that is not found', () => {
    const ctx = context<VNode>({
      locale: 'en',
      messages: {
        en: {
          name: 'kazupon',
          hi: 'hi @.unknown:name !'
        }
      }
    })
    ctx.processor = processor
    expect(
      translate<typeof ctx, string, PickupKeys<typeof ctx.messages>, VNode>(ctx, 'hi')
    ).toEqual([
      { __v_isVNode: true, children: 'hi ' },
      { __v_isVNode: true, children: 'kazupon' },
      { __v_isVNode: true, children: ' !' }
    ])
  })

  test('plural', () => {
    const ctx = context<VNode>({
      locale: 'en',
      messages: {
        en: { apple: 'no apples | one apple | {count} apples from {name}' }
      }
    })
    ctx.processor = processor
    expect(
      translate<typeof ctx, string, PickupKeys<typeof ctx.messages>, VNode>(ctx, 'apple', 0)
    ).toEqual([{ __v_isVNode: true, children: 'no apples' }])
    expect(
      translate<typeof ctx, string, PickupKeys<typeof ctx.messages>, VNode>(ctx, 'apple', 1)
    ).toEqual([{ __v_isVNode: true, children: 'one apple' }])
    expect(
      translate<typeof ctx, string, PickupKeys<typeof ctx.messages>, VNode>(ctx, 'apple', 10)
    ).toEqual([
      { __v_isVNode: true, children: '10' },
      { __v_isVNode: true, children: ' apples from ' },
      undefined
    ])
    expect(
      translate<typeof ctx, string, PickupKeys<typeof ctx.messages>, VNode>(
        ctx,
        'apple',
        { count: 20, name: 'kazupon' },
        10
      )
    ).toEqual([
      { __v_isVNode: true, children: '20' },
      { __v_isVNode: true, children: ' apples from ' },
      { __v_isVNode: true, children: 'kazupon' }
    ])
  })
})

describe('AST passing', () => {
  test('simple text', () => {
    const msg = 'hi kazupon !'
    const { ast } = baseCompile(msg, { jit: true, location: false })

    const ctx = context({
      locale: 'en',
      messages: {
        en: { hi: ast }
      }
    })
    expect(translate(ctx, 'hi')).toEqual('hi kazupon !')
  })

  test('json path key', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: ast
      }
    })
    expect(translate(ctx, 'languages')).toEqual('languages')
    expect(translate(ctx, 'product')).toEqual('Product')
    expect(translate(ctx, 'product.type')).toEqual('Product type')
    expect(translate(ctx, 'product.test.type')).toEqual('Product test type')
  })
})

test('locale detector', () => {
  const locale = vi.fn().mockImplementation(() => 'en')
  const ctx = context({
    locale,
    messages: {
      en: { hi: 'hi kazupon !' },
      ja: { hi: 'こんにちは　かずぽん！' }
    }
  })
  expect(translate(ctx, 'hi')).toEqual('hi kazupon !')
  expect(translate(ctx, 'hi')).toEqual('hi kazupon !')
  expect(locale).toHaveBeenCalledTimes(2)
})

describe('locales and keys named after Object.prototype properties', () => {
  const messages = {
    en: { hello: 'Hello', name: 'Name', keys: 'Keys', linked: 'x @:toString' }
  }
  const builtinNames = ['__proto__', 'constructor', 'toString', 'valueOf', 'hasOwnProperty']

  test.each(builtinNames)('falls back from the %s locale', locale => {
    const ctx = context({
      locale,
      fallbackLocale: 'en',
      missingWarn: false,
      fallbackWarn: false,
      messages
    })
    expect(translate(ctx, 'hello')).toEqual('Hello')
    expect(translate(ctx, 'name')).toEqual('Name')
    expect(translate(ctx, 'keys')).toEqual('Keys')
    for (const key of ['toString', 'valueOf', 'defineProperty', 'prototype']) {
      expect(translate(ctx, key)).toEqual(key)
    }
  })

  test.each(builtinNames)('falls back from the %s locale given per call', locale => {
    const ctx = context({
      locale: 'en',
      fallbackLocale: 'en',
      missingWarn: false,
      fallbackWarn: false,
      messages
    })
    expect(translate(ctx, 'name', {}, { locale })).toEqual('Name')
    expect(translate(ctx, 'keys', {}, { locale })).toEqual('Keys')
    expect(translate(ctx, 'toString', {}, { locale })).toEqual('toString')
  })

  test.each(['__proto__', 'constructor'])(
    'does not resolve through the %s fallback locale',
    fallbackLocale => {
      const ctx = context({
        locale: 'ja',
        fallbackLocale,
        missingWarn: false,
        fallbackWarn: false,
        messages: { ja: {}, ...messages }
      })
      expect(translate(ctx, 'name')).toEqual('name')
      expect(translate(ctx, 'keys')).toEqual('keys')
      expect(translate(ctx, 'toString')).toEqual('toString')
    }
  )

  test('treats keys named after Object.prototype properties as missing', () => {
    const ctx = context({ locale: 'en', missingWarn: false, messages })
    for (const key of [
      'toString',
      'constructor',
      'valueOf',
      'hasOwnProperty',
      '__proto__',
      '__defineGetter__'
    ]) {
      expect(translate(ctx, key)).toEqual(key)
    }
    expect(translate(ctx, 'linked')).toEqual('x toString')
  })

  test('treats keys named after Object.prototype properties as missing with the key-value message resolver', () => {
    const ctx = context({
      locale: 'en',
      missingWarn: false,
      messageResolver: resolveWithKeyValue,
      messages: { en: { ...messages.en, valueOf: 'Value of' } }
    })
    for (const key of [
      'toString',
      'constructor',
      'hasOwnProperty',
      '__proto__',
      '__defineGetter__'
    ]) {
      expect(translate(ctx, key)).toEqual(key)
    }
    // an own property named after a built-in is a message
    expect(translate(ctx, 'valueOf')).toEqual('Value of')
    expect(translate(ctx, 'hello')).toEqual('Hello')
    expect(translate(ctx, 'linked')).toEqual('x toString')
  })

  test('does not use a built-in function as the plural rule', () => {
    const ctx = context({ locale: 'toString', pluralRules: { ru: () => 0 }, messages: {} })
    expect(translate(ctx, 'a | b | c', 2, { resolvedMessage: true })).toEqual('c')
  })

  test('does not read Object.prototype properties as named values', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: {
          builtins: '[{toString}][{valueOf}][{constructor}][{__proto__}]',
          hi: 'hi {name} !'
        }
      }
    })
    expect(translate(ctx, 'builtins', { name: 'kazupon' })).toEqual('[][][][]')
    // own properties named after Object.prototype properties are named values
    expect(translate(ctx, 'builtins', { toString: 'a', valueOf: 'b', constructor: 'c' })).toEqual(
      '[a][b][c][]'
    )
    expect(translate(ctx, 'builtins', JSON.parse('{"__proto__": "d"}'))).toEqual('[][][][d]')
    // the getters of class instances are named values
    class Person {
      first = 'kazuya'
      get name(): string {
        return `${this.first} kawaguchi`
      }
    }
    expect(translate(ctx, 'hi', new Person() as any)).toEqual('hi kazuya kawaguchi !')
  })
})
