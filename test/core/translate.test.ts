/* eslint-disable @typescript-eslint/no-empty-function */

// utils
jest.mock('../../src/utils', () => ({
  ...jest.requireActual('../../src/utils'),
  warn: jest.fn()
}))
import { warn } from '../../src/utils'

import {
  createRuntimeContext as context,
  NOT_REOSLVED
} from '../../src/core/context'
import { translate } from '../../src/core/translate'
import { CoreErrorCodes, errorMessages } from '../../src/core/errors'

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
        en: { hi: 'hi {0} !' }
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
    expect(translate(ctx, 'hi', {}, { locale: 'ja' })).toEqual(
      'こんにちは　かずぽん！'
    )
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
    expect(translate(ctx, 'hello', 'hello, default message!')).toEqual(
      'hello, default message!'
    )
  })

  test('boolean true', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: {}
      }
    })
    expect(
      translate(ctx, 'hi {name}!', { name: 'kazupon' }, { default: true })
    ).toEqual('hi kazupon!')
  })
})

describe('context missing option', () => {
  test('not specified missing handler', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {})

    const ctx = context({
      locale: 'en',
      messages: {
        en: {}
      }
    })

    expect(translate(ctx, 'hello')).toEqual('hello')
    expect(mockWarn.mock.calls[0][0]).toEqual(
      `Not found 'hello' key in 'en' locale messages.`
    )
  })

  test('specified missing handler', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {})

    const ctx = context({
      locale: 'en',
      missing: (c, locale, key) => {
        expect(c).toEqual(ctx)
        expect(locale).toEqual('en')
        expect(key).toEqual('hello')
      },
      messages: {
        en: {}
      }
    })
    expect(translate(ctx, 'hello')).toEqual('hello')
    expect(mockWarn).not.toHaveBeenCalled()
  })
})

describe('context missingWarn option', () => {
  test('false', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
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
    const mockWarn = warn as jest.MockedFunction<typeof warn>
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
    expect(mockWarn.mock.calls[0][0]).not.toEqual(
      `Not found 'hello' key in 'en' locale messages.`
    )
  })

  test('missingWarn option', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
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
    const mockWarn = warn as jest.MockedFunction<typeof warn>
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
    const mockWarn = warn as jest.MockedFunction<typeof warn>
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
    const mockWarn = warn as jest.MockedFunction<typeof warn>
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
    const mockWarn = warn as jest.MockedFunction<typeof warn>
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
    const mockWarn = warn as jest.MockedFunction<typeof warn>
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
    const mockWarn = warn as jest.MockedFunction<typeof warn>
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
    const mockWarn = warn as jest.MockedFunction<typeof warn>
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

    expect(translate(ctx, 'hi, {name}!', { name: 'kazupon' })).toEqual(
      'hi, kazupon!'
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

  test('overrided with default option', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
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

    expect(
      translate(ctx, 'hi, {name}!', { name: 'kazupon' }, 'hello, {name}!')
    ).toEqual('hello, kazupon!')
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
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {})

    const ctx = context({
      locale: 'en',
      fallbackFormat: true,
      messages: {
        en: {}
      }
    })

    expect(
      translate(ctx, 'hi, {name}!', { name: 'kazupon' }, 'hello, {name}!')
    ).toEqual('hello, kazupon!')
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
    expect(translate(ctx, 'hello.world')).toEqual(NOT_REOSLVED)
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
    expect(translate(ctx, 'hello.world')).toEqual(NOT_REOSLVED)
  })

  test('fallbackFormat is true', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
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
    expect(translate(ctx, 'hi, {name}!', { name: 'kazupon' })).toEqual(
      'hi, kazupon!'
    )
  })
})

describe('context pluralRule option', () => {
  test('basic', () => {
    const pluralRules = {
      ru: (choice, choicesLength) => {
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

describe('context postTranslation option', () => {
  test('basic', () => {
    const postTranslation = (str: string) => str.trim()
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
  })
})

describe('warnHtmlMessage', () => {
  test('default', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
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

describe('error', () => {
  test(errorMessages[CoreErrorCodes.INVALID_ARGUMENT], () => {
    const ctx = context({
      locale: 'ja',
      messages: {
        ja: {}
      }
    })
    expect(() => {
      translate(ctx, 1)
    }).toThrowError(errorMessages[CoreErrorCodes.INVALID_ARGUMENT])
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
})

/* eslint-enable @typescript-eslint/no-empty-function */
