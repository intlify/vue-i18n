import {
  createCoreContext as context,
  getLocaleChain,
  CoreContext
} from '../src/context'

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

describe('getLocaleChain', () => {
  let ctx: CoreContext<unknown, unknown, unknown, string>
  beforeEach(() => {
    ctx = context({})
  })

  describe('none', () => {
    test('en', () => {
      expect(getLocaleChain(ctx, false, 'en')).toEqual(['en'])
    })

    test('en-GB', () => {
      expect(getLocaleChain(ctx, false, 'en-GB')).toEqual(['en-GB', 'en'])
    })

    test('en-GB!', () => {
      expect(getLocaleChain(ctx, false, 'en-GB!')).toEqual(['en-GB'])
    })

    test('de-DE-bavarian', () => {
      expect(getLocaleChain(ctx, false, 'de-DE-bavarian')).toEqual([
        'de-DE-bavarian',
        'de-DE',
        'de'
      ])
    })
  })

  describe(`simple: 'en'`, () => {
    test('en', () => {
      expect(getLocaleChain(ctx, 'en', 'en')).toEqual(['en'])
    })

    test('ja', () => {
      expect(getLocaleChain(ctx, 'en', 'ja')).toEqual(['ja', 'en'])
    })

    test('en-GB', () => {
      expect(getLocaleChain(ctx, 'en', 'en-GB')).toEqual(['en-GB', 'en'])
    })

    test('en-GB!', () => {
      expect(getLocaleChain(ctx, 'en', 'en-GB!')).toEqual(['en-GB', 'en'])
    })

    test('de-DE-bavarian', () => {
      expect(getLocaleChain(ctx, 'en', 'de-DE-bavarian')).toEqual([
        'de-DE-bavarian',
        'de-DE',
        'de',
        'en'
      ])
    })

    test('de', () => {
      expect(getLocaleChain(ctx, 'en', 'de')).toEqual(['de', 'en'])
    })

    test('de-CH', () => {
      expect(getLocaleChain(ctx, 'en', 'de-CH')).toEqual(['de-CH', 'de', 'en'])
    })
  })

  describe(`array: ['en', 'ja']`, () => {
    test('en', () => {
      expect(getLocaleChain(ctx, ['en', 'ja'], 'en')).toEqual(['en', 'ja'])
    })

    test('en-GB', () => {
      expect(getLocaleChain(ctx, ['en', 'ja'], 'en-GB')).toEqual([
        'en-GB',
        'en',
        'ja'
      ])
    })

    test('en-GB!', () => {
      expect(getLocaleChain(ctx, ['en', 'ja'], 'en-GB!')).toEqual([
        'en-GB',
        'en',
        'ja'
      ])
    })

    test('de-DE-bavarian', () => {
      expect(getLocaleChain(ctx, ['en', 'ja'], 'de-DE-bavarian')).toEqual([
        'de-DE-bavarian',
        'de-DE',
        'de',
        'en',
        'ja'
      ])
    })

    test('de', () => {
      expect(getLocaleChain(ctx, ['en', 'ja'], 'de')).toEqual([
        'de',
        'en',
        'ja'
      ])
    })

    test('de-CH', () => {
      expect(getLocaleChain(ctx, ['en', 'ja'], 'de-CH')).toEqual([
        'de-CH',
        'de',
        'en',
        'ja'
      ])
    })
  })

  describe('complex', () => {
    const fallbackLocale = {
      'de-CH': ['fr', 'it'],
      'zh-Hant': ['zh-Hans'],
      'es-CL': ['es-AR'],
      es: ['en-GB'],
      pt: ['es-AR'],
      default: ['en', 'da']
    }

    test('de-CH', () => {
      expect(getLocaleChain(ctx, fallbackLocale, 'de-CH')).toEqual([
        'de-CH',
        'fr',
        'it',
        'en',
        'da'
      ])
    })

    test('de-CH!', () => {
      expect(getLocaleChain(ctx, fallbackLocale, 'de-CH!')).toEqual([
        'de-CH',
        'fr',
        'it',
        'en',
        'da'
      ])
    })

    test('de-DE-bavarian', () => {
      expect(getLocaleChain(ctx, fallbackLocale, 'de-DE-bavarian')).toEqual([
        'de-DE-bavarian',
        'de-DE',
        'de',
        'en',
        'da'
      ])
    })

    test('de', () => {
      expect(getLocaleChain(ctx, fallbackLocale, 'de')).toEqual([
        'de',
        'en',
        'da'
      ])
    })

    test('zh-Hant', () => {
      expect(getLocaleChain(ctx, fallbackLocale, 'zh-Hant')).toEqual([
        'zh-Hant',
        'zh-Hans',
        'zh',
        'en',
        'da'
      ])
    })

    test('es-SP', () => {
      expect(getLocaleChain(ctx, fallbackLocale, 'es-SP')).toEqual([
        'es-SP',
        'es',
        'en-GB',
        'en',
        'da'
      ])
    })

    test('es-SP!', () => {
      expect(getLocaleChain(ctx, fallbackLocale, 'es-SP!')).toEqual([
        'es-SP',
        'en',
        'da'
      ])
    })

    test('fr', () => {
      expect(getLocaleChain(ctx, fallbackLocale, 'fr')).toEqual([
        'fr',
        'en',
        'da'
      ])
    })

    test('pt-BR', () => {
      expect(getLocaleChain(ctx, fallbackLocale, 'pt-BR')).toEqual([
        'pt-BR',
        'pt',
        'es-AR',
        'es',
        'en-GB',
        'en',
        'da'
      ])
    })

    test('es-CL', () => {
      expect(getLocaleChain(ctx, fallbackLocale, 'es-CL')).toEqual([
        'es-CL',
        'es-AR',
        'es',
        'en-GB',
        'en',
        'da'
      ])
    })
  })
})
