import { createCoreContext as context, CoreContext } from '../src/context'
import { fallbackWithLocaleChain } from '../src/fallbacker'

describe('getLocaleChain', () => {
  let ctx: CoreContext<string>
  beforeEach(() => {
    ctx = context({})
  })

  describe('none', () => {
    test('en', () => {
      expect(fallbackWithLocaleChain(ctx, false, 'en')).toEqual(['en'])
    })

    test('en-GB', () => {
      expect(fallbackWithLocaleChain(ctx, false, 'en-GB')).toEqual([
        'en-GB',
        'en'
      ])
    })

    test('en-GB!', () => {
      expect(fallbackWithLocaleChain(ctx, false, 'en-GB!')).toEqual(['en-GB'])
    })

    test('de-DE-bavarian', () => {
      expect(fallbackWithLocaleChain(ctx, false, 'de-DE-bavarian')).toEqual([
        'de-DE-bavarian',
        'de-DE',
        'de'
      ])
    })
  })

  describe(`simple: 'en'`, () => {
    test('empty string', () => {
      expect(fallbackWithLocaleChain(ctx, 'en', '')).toEqual(['en'])
    })

    test('en', () => {
      expect(fallbackWithLocaleChain(ctx, 'en', 'en')).toEqual(['en'])
    })

    test('ja', () => {
      expect(fallbackWithLocaleChain(ctx, 'en', 'ja')).toEqual(['ja', 'en'])
    })

    test('en-GB', () => {
      expect(fallbackWithLocaleChain(ctx, 'en', 'en-GB')).toEqual([
        'en-GB',
        'en'
      ])
    })

    test('en-GB!', () => {
      expect(fallbackWithLocaleChain(ctx, 'en', 'en-GB!')).toEqual([
        'en-GB',
        'en'
      ])
    })

    test('de-DE-bavarian', () => {
      expect(fallbackWithLocaleChain(ctx, 'en', 'de-DE-bavarian')).toEqual([
        'de-DE-bavarian',
        'de-DE',
        'de',
        'en'
      ])
    })

    test('de', () => {
      expect(fallbackWithLocaleChain(ctx, 'en', 'de')).toEqual(['de', 'en'])
    })

    test('de-CH', () => {
      expect(fallbackWithLocaleChain(ctx, 'en', 'de-CH')).toEqual([
        'de-CH',
        'de',
        'en'
      ])
    })
  })

  describe(`array: ['en', 'ja']`, () => {
    test('en', () => {
      expect(fallbackWithLocaleChain(ctx, ['en', 'ja'], 'en')).toEqual([
        'en',
        'ja'
      ])
    })

    test('en-GB', () => {
      expect(fallbackWithLocaleChain(ctx, ['en', 'ja'], 'en-GB')).toEqual([
        'en-GB',
        'en',
        'ja'
      ])
    })

    test('en-GB!', () => {
      expect(fallbackWithLocaleChain(ctx, ['en', 'ja'], 'en-GB!')).toEqual([
        'en-GB',
        'en',
        'ja'
      ])
    })

    test('de-DE-bavarian', () => {
      expect(
        fallbackWithLocaleChain(ctx, ['en', 'ja'], 'de-DE-bavarian')
      ).toEqual(['de-DE-bavarian', 'de-DE', 'de', 'en', 'ja'])
    })

    test('de', () => {
      expect(fallbackWithLocaleChain(ctx, ['en', 'ja'], 'de')).toEqual([
        'de',
        'en',
        'ja'
      ])
    })

    test('de-CH', () => {
      expect(fallbackWithLocaleChain(ctx, ['en', 'ja'], 'de-CH')).toEqual([
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
      expect(fallbackWithLocaleChain(ctx, fallbackLocale, 'de-CH')).toEqual([
        'de-CH',
        'fr',
        'it',
        'en',
        'da'
      ])
    })

    test('de-CH!', () => {
      expect(fallbackWithLocaleChain(ctx, fallbackLocale, 'de-CH!')).toEqual([
        'de-CH',
        'fr',
        'it',
        'en',
        'da'
      ])
    })

    test('de-DE-bavarian', () => {
      expect(
        fallbackWithLocaleChain(ctx, fallbackLocale, 'de-DE-bavarian')
      ).toEqual(['de-DE-bavarian', 'de-DE', 'de', 'en', 'da'])
    })

    test('de', () => {
      expect(fallbackWithLocaleChain(ctx, fallbackLocale, 'de')).toEqual([
        'de',
        'en',
        'da'
      ])
    })

    test('zh-Hant', () => {
      expect(fallbackWithLocaleChain(ctx, fallbackLocale, 'zh-Hant')).toEqual([
        'zh-Hant',
        'zh-Hans',
        'zh',
        'en',
        'da'
      ])
    })

    test('es-SP', () => {
      expect(fallbackWithLocaleChain(ctx, fallbackLocale, 'es-SP')).toEqual([
        'es-SP',
        'es',
        'en-GB',
        'en',
        'da'
      ])
    })

    test('es-SP!', () => {
      expect(fallbackWithLocaleChain(ctx, fallbackLocale, 'es-SP!')).toEqual([
        'es-SP',
        'en',
        'da'
      ])
    })

    test('fr', () => {
      expect(fallbackWithLocaleChain(ctx, fallbackLocale, 'fr')).toEqual([
        'fr',
        'en',
        'da'
      ])
    })

    test('pt-BR', () => {
      expect(fallbackWithLocaleChain(ctx, fallbackLocale, 'pt-BR')).toEqual([
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
      expect(fallbackWithLocaleChain(ctx, fallbackLocale, 'es-CL')).toEqual([
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
