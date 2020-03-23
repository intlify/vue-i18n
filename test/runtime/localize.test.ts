// utils
jest.mock('../../src/utils', () => ({
  ...jest.requireActual('../../src/utils'),
  warn: jest.fn()
}))
import { warn } from '../../src/utils'

import { createRuntimeContext as context, translate } from '../../src/runtime'

describe('features', () => {
  it('simple text', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: { hi: 'hi kazupon !' }
      }
    })
    expect(translate(ctx, 'hi')).toEqual('hi kazupon !')
  })

  it('list', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: { hi: 'hi {0} !' }
      }
    })
    expect(translate(ctx, 'hi', { list: ['kazupon']})).toEqual('hi kazupon !')
  })

  it('named', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: { hi: 'hi {name} !' }
      }
    })
    expect(translate(ctx, 'hi', { named: { name: 'kazupon' } })).toEqual('hi kazupon !')
  })

  it('linked', () => {
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

  it('plural', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: { apple: 'no apples | one apple | {count} apples' }
      }
    })
    expect(translate(ctx, 'apple', { plural: 0 })).toEqual('no apples')
    expect(translate(ctx, 'apple', { plural: 1 })).toEqual('one apple')
    expect(translate(ctx, 'apple', { plural: 10 })).toEqual('10 apples')
    expect(translate(ctx, 'apple', { plural: 10, named: { count: 20 } })).toEqual('20 apples')
  })
})

describe('locale', () => {
  it('option', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: { hi: 'hi kazupon !' },
        ja: { hi: 'こんにちは　かずぽん！'}
      }
    })
    expect(translate(ctx, 'hi', { locale: 'ja' })).toEqual('こんにちは　かずぽん！')
  })
})

describe('default message', () => {
  it('string message option', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: {}
      }
    })
    expect(
      translate(ctx, 'hello', { default: 'hello, default message!' })
    ).toEqual(
      'hello, default message!'
    )
  })

  it('true option', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: {}
      }
    })
    expect(
      translate(ctx, 'hi {name}!', {
        named: { name: 'kazupon' },
        default: true
      })
    ).toEqual(
      'hi kazupon!'
    )
  })
})

describe('missing', () => {
  it('none missing handler', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

    const ctx = context({
      locale: 'en',
      messages: {
        en: {}
      }
    })

    expect(translate(ctx, 'hello')).toEqual('hello')
    expect(mockWarn.mock.calls[0][0])
      .toEqual(`Cannot translate the value of 'hello'. Use the value of key as default.`)
  })

  it('missing handler', () => {
    const ctx = context({
      locale: 'en',
      missing: (c, locale, key) => {
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
  })
})

describe('missingWarn', () => {
  it('false', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

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

  it('regex', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

    const ctx = context({
      locale: 'en',
      missingWarn: /^hi/,
      messages: {
        en: {}
      }
    })

    expect(translate(ctx, 'hi kazupon!')).toEqual('hi kazupon!')
    expect(translate(ctx, 'hello')).toEqual('hello')
    expect(mockWarn).toHaveBeenCalledTimes(1)
  })

  it('missingWarn option', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

    const ctx = context({
      locale: 'en',
      messages: {
        en: {}
      }
    })

    expect(translate(ctx, 'hello', { missingWarn: false })).toEqual('hello')
    expect(mockWarn).not.toHaveBeenCalled()
  })
})

describe('fallbackWarn', () => {
  it('not specify fallbackLocales', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

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

  it('specify fallbackLocales', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

    const ctx = context({
      locale: 'en',
      fallbackLocales: ['ja'],
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
    expect(mockWarn.mock.calls[0][0])
      .toEqual(`Fall back to translate 'hello' with 'ja' locale.`)
  })

  it('not found fallback message', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

    const ctx = context({
      locale: 'en',
      fallbackLocales: ['ja', 'fr'],
      missingWarn: false,
      messages: {
        en: {},
        ja: {}
      }
    })

    expect(translate(ctx, 'hello.world')).toEqual('hello.world')
    expect(mockWarn).toHaveBeenCalledTimes(2)
    expect(mockWarn.mock.calls[0][0])
      .toEqual(`Fall back to translate 'hello.world' with 'ja,fr' locale.`)
    expect(mockWarn.mock.calls[1][0])
      .toEqual(`Fall back to translate 'hello.world' with 'fr' locale.`)
  })

  it('false', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

    const ctx = context({
      locale: 'en',
      fallbackLocales: ['ja', 'fr'],
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

  it('regex', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

    const ctx = context({
      locale: 'en',
      fallbackLocales: ['ja', 'fr'],
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

  it('fallbackWarn option', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

    const ctx = context({
      locale: 'en',
      fallbackLocales: ['ja'],
      missingWarn: false,
      messages: {
        en: {},
        ja: {
          hello: 'こんにちは！'
        }
      }
    })

    expect(translate(ctx, 'hello')).toEqual('こんにちは！')
    expect(translate(ctx, 'hi', { fallbackWarn: false })).toEqual('hi')
    expect(mockWarn).toHaveBeenCalledTimes(1)
  })
})
