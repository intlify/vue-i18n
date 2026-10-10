// utils
import * as shared from '@intlify/shared'
vi.mock('@intlify/shared', async () => {
  const actual = await vi.importActual<object>('@intlify/shared')
  return {
    ...actual,
    warn: vi.fn()
  }
})

import { createCoreContext as context, getLocaleMessage, setLocaleMessage } from '../src/context'
import { CoreWarnCodes, getWarnMessage } from '../src/warnings'

describe('locale', () => {
  test('default', () => {
    const ctx = context({})
    expect(ctx.locale).toEqual('en-US')
  })

  test('specify', () => {
    const ctx = context({ locale: 'ja' })
    expect(ctx.locale).toEqual('ja')
  })
})

describe('fallbackLocale', () => {
  test('default', () => {
    const ctx = context({})
    expect(ctx.fallbackLocale).toEqual('en-US')
  })

  test('default with locale', () => {
    const ctx = context({ locale: 'en' })
    expect(ctx.fallbackLocale).toEqual('en')
  })

  test('specify: fallbackLocale only', () => {
    const ctx = context({ fallbackLocale: ['ja'] })
    expect(ctx.fallbackLocale).toEqual(['ja'])
  })
})

describe('messages', () => {
  test('default', () => {
    const ctx = context({})
    expect(ctx.messages).toEqual({ 'en-US': {} })
  })

  test('specify', () => {
    const messages = {
      en: { hello: 'hello' },
      ja: { hello: 'こんにちは！' }
    }
    const ctx = context({ messages })
    expect(ctx.messages).toEqual(messages)
  })
})

describe('modifiers', () => {
  test('default', () => {
    const ctx = context({})
    expect(Object.keys(ctx.modifiers).sort()).toEqual(['upper', 'lower', 'capitalize'].sort())
  })

  test('specify', () => {
    const modifiers = { custom: (str: string) => str }
    const ctx = context({ modifiers })
    expect(Object.keys(ctx.modifiers).sort()).toEqual(
      ['upper', 'lower', 'capitalize', 'custom'].sort()
    )
  })
})

describe('pluralRules', () => {
  test('default', () => {
    const ctx = context({})
    expect(ctx.pluralRules).toEqual({})
  })

  test('specify', () => {
    const pluralRules = { ru: () => 0 }
    const ctx = context({ pluralRules })
    expect(Object.keys(ctx.pluralRules!)).toEqual(['ru'])
  })
})

describe('missing', () => {
  test('default', () => {
    const ctx = context({})
    expect(ctx.missing).toEqual(null)
  })

  test('specify', () => {
    const missing = () => ''
    const ctx = context({ missing })
    expect(ctx.missing).toEqual(missing)
  })
})

describe('missingWarn', () => {
  test('default', () => {
    const ctx = context({})
    expect(ctx.missingWarn).toEqual(true)
  })

  test('specify boolean', () => {
    const ctx = context({ missingWarn: false })
    expect(ctx.missingWarn).toEqual(false)
  })

  test('specify Regexp', () => {
    const ctx = context({ missingWarn: /^(hi|hello)/ })
    expect(ctx.missingWarn).toEqual(/^(hi|hello)/)
  })
})

describe('fallbackWarn', () => {
  test('default', () => {
    const ctx = context({})
    expect(ctx.fallbackWarn).toEqual(true)
  })

  test('specify boolean', () => {
    const ctx = context({ fallbackWarn: false })
    expect(ctx.fallbackWarn).toEqual(false)
  })

  test('specify Regexp', () => {
    const ctx = context({ fallbackWarn: /^(hi|hello)/ })
    expect(ctx.fallbackWarn).toEqual(/^(hi|hello)/)
  })
})

describe('fallbackFormat', () => {
  test('default', () => {
    const ctx = context({})
    expect(ctx.fallbackFormat).toEqual(false)
  })

  test('specify', () => {
    const ctx = context({ fallbackFormat: true })
    expect(ctx.fallbackFormat).toEqual(true)
  })
})

describe('unresolving', () => {
  test('default', () => {
    const ctx = context({})
    expect(ctx.unresolving).toEqual(false)
  })

  test('specify', () => {
    const ctx = context({ unresolving: true })
    expect(ctx.unresolving).toEqual(true)
  })
})

describe('postTranslation', () => {
  test('default', () => {
    const ctx = context({})
    expect(ctx.postTranslation).toEqual(null)
  })

  test('specify', () => {
    const hook = (str: string) => str
    const ctx = context({ postTranslation: hook })
    expect(ctx.postTranslation).toEqual(hook)
  })
})

describe('escapeParameter', () => {
  test('default', () => {
    const ctx = context({})
    expect(ctx.escapeParameter).toEqual(false)
  })

  test('specify', () => {
    const ctx = context({ escapeParameter: true })
    expect(ctx.escapeParameter).toEqual(true)
  })
})

describe('getLocaleMessage', () => {
  test('exist locale', () => {
    const ctx = context({
      messages: {
        en: { hello: 'hello' },
        ja: { hello: 'こんにちは！' }
      }
    })
    const messages = getLocaleMessage(ctx, 'en')
    expect(messages).toEqual({ hello: 'hello' })
  })

  test('returns an isolated copy of array messages', () => {
    const ctx = context({
      messages: {
        en: {
          list: [{ value: 'stored' }]
        }
      }
    })
    const messages = getLocaleMessage(ctx, 'en')!

    expect(messages.list).not.toBe(ctx.messages.en.list)
    expect(messages.list[0]).not.toBe(ctx.messages.en.list[0])

    messages.list[0].value = 'changed'
    messages.list.push({ value: 'added' })

    expect(ctx.messages.en.list).toEqual([{ value: 'stored' }])
  })

  test('not exist locale', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: { hello: 'hello' }
      }
    })
    const messages = getLocaleMessage(ctx, 'ja')
    expect(messages).toBeUndefined()
  })
})

test('setMessages', () => {
  const ctx = context({
    locale: 'en',
    messages: {
      en: { hello: 'hello' }
    }
  })

  setLocaleMessage(ctx, 'ja', { hello: 'こんにちは！' })
  expect(getLocaleMessage(ctx, 'ja')).toMatchObject({ hello: 'こんにちは！' })
})

describe('locales named after Object.prototype properties', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test.each(['__proto__', 'constructor', 'toString'])('setLocaleMessage ignores %s', locale => {
    const mockWarn = vi.spyOn(shared, 'warn')
    const messages = { en: { hello: 'hello' } }
    const ctx = context({ locale: 'en', messages })

    setLocaleMessage(ctx, locale as 'en', { ja: { hello: 'injected' } } as any)

    expect(Object.getPrototypeOf(messages)).toBe(Object.prototype)
    expect(Object.keys(messages)).toEqual(['en'])
    expect(mockWarn).toHaveBeenCalledTimes(1)
    expect(mockWarn).toHaveBeenCalledWith(
      getWarnMessage(CoreWarnCodes.IGNORE_UNSAFE_LOCALE, { locale })
    )
  })

  test('setLocaleMessage warns through the onWarn option', () => {
    const onWarn = vi.fn()
    const ctx = context({ locale: 'en', messages: { en: {} }, onWarn })

    setLocaleMessage(ctx, '__proto__' as 'en', {} as any)

    expect(onWarn).toHaveBeenCalledTimes(1)
    expect(onWarn).toHaveBeenCalledWith(
      getWarnMessage(CoreWarnCodes.IGNORE_UNSAFE_LOCALE, { locale: '__proto__' })
    )
  })

  test('setLocaleMessage does not warn for other locales', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    const ctx = context({ locale: 'en', messages: { en: {} } })

    setLocaleMessage(ctx, 'ja', { hello: 'こんにちは！' })

    expect(mockWarn).not.toHaveBeenCalled()
  })

  test.each(['__proto__', 'constructor', 'toString'])('getLocaleMessage ignores %s', locale => {
    const ctx = context({ locale: 'en', messages: { en: { hello: 'hello' } } })
    expect(getLocaleMessage(ctx, locale as 'en')).toBeUndefined()
  })
})
