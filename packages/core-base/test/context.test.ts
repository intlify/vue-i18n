import { createCoreContext as context } from '../src/context'

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
    expect(Object.keys(ctx.modifiers).sort()).toEqual(
      ['upper', 'lower', 'capitalize'].sort()
    )
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
