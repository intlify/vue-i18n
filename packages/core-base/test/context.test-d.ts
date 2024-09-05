import {
  createCoreContext,
  DateTimeFormat,
  Locale,
  LocaleDetector,
  NumberFormat,
  PickupFallbackLocales
} from '../src'

import type { MyDatetimeScehma, MyNumberSchema, ResourceSchema } from './schema'

// loose options
const looseOptions = {
  locale: 'en',
  fallbackLocale: {
    ja: ['en']
  },
  messages: {
    en: {
      foo: 'foo',
      nest: {
        bar: 'bar'
      }
    },
    ja: {
      bar: 'foo',
      nest: {
        bar: 'bar'
      }
    }
  },
  datetimeFormats: {
    'en-US': {
      short: {}
    }
  },
  numberFormats: {
    'ja-JP': {
      currency: {}
    }
  }
}

// strict options
const strictOptions = {
  locale: 'en',
  fallbackLocale: {
    ja: ['en']
  },
  messages: {
    en: {
      foo: 'foo',
      nest: {
        bar: 'bar'
      },
      errors: ['error1']
    },
    ja: {
      foo: 'foo',
      nest: {
        bar: 'bar'
      },
      errors: ['error2']
    }
  }
}

test('loose context', () => {
  const looseCtx = createCoreContext(looseOptions)

  expectTypeOf(looseCtx.locale).toEqualTypeOf<'en' | 'ja' | 'en-US' | 'ja-JP'>()
  expectTypeOf(looseCtx.fallbackLocale).toEqualTypeOf<
    | 'en'
    | 'ja'
    | 'en-US'
    | 'ja-JP'
    | ('en' | 'ja' | 'en-US' | 'ja-JP')[]
    | {
        [x in string]: PickupFallbackLocales<
          ['en' | 'ja' | 'en-US' | 'ja-JP']
        >[]
      }
    | false
  >()
  expectTypeOf(looseCtx.messages).toEqualTypeOf<{
    en: {
      foo: string
      nest: {
        bar: string
      }
    }
    ja: {
      bar: string
      nest: {
        bar: string
      }
    }
  }>()
  expectTypeOf(looseCtx.datetimeFormats).toEqualTypeOf<{
    'en-US': { short: {} }
  }>()
  expectTypeOf(looseCtx.numberFormats).toEqualTypeOf<{
    'ja-JP': { currency: {} }
  }>()
})

test('strict context', () => {
  const strictCtx = createCoreContext<[ResourceSchema], 'en' | 'ja'>(
    strictOptions
  )

  expectTypeOf(strictCtx.locale).toEqualTypeOf<'en' | 'ja'>()
  expectTypeOf(strictCtx.fallbackLocale).toEqualTypeOf<
    | 'en'
    | 'ja'
    | ('en' | 'ja')[]
    | { [x in string]: PickupFallbackLocales<['en' | 'ja']>[] }
    | false
  >()
  expectTypeOf(strictCtx.messages).toEqualTypeOf<{
    en: ResourceSchema
    ja: ResourceSchema
  }>()
  expectTypeOf(strictCtx.datetimeFormats).toEqualTypeOf<{
    en: DateTimeFormat
    ja: DateTimeFormat
  }>()
  expectTypeOf(strictCtx.numberFormats).toEqualTypeOf<{
    en: NumberFormat
    ja: NumberFormat
  }>()
})

test('strict context with direct options', () => {
  // check strict context with direct options
  const strictDirectCtx = createCoreContext<
    {
      message: ResourceSchema
      datetime: MyDatetimeScehma
      number: MyNumberSchema
    },
    { messages: 'en'; datetimeFormats: 'ja-JP' | 'zh'; numberFormats: 'ca' }
  >({
    messages: {
      en: {
        foo: '',
        nest: {
          bar: ''
        },
        errors: ['']
      }
    },
    datetimeFormats: {
      zh: {
        short: {
          hour: 'numeric'
        }
      },
      'ja-JP': {
        short: {
          hour: 'numeric'
        }
      }
    },
    numberFormats: {
      ca: {
        currency: {
          style: 'currency',
          currencyDisplay: 'symbol'
        }
      }
    }
  })

  expectTypeOf(strictDirectCtx.locale).toEqualTypeOf<
    'en' | 'zh' | 'ca' | 'ja-JP'
  >()
  expectTypeOf(strictDirectCtx.fallbackLocale).toEqualTypeOf<
    | 'en'
    | 'zh'
    | 'ca'
    | 'ja-JP'
    | ('en' | 'zh' | 'ca' | 'ja-JP')[]
    | { [x in string]: PickupFallbackLocales<['en' | 'zh' | 'ca' | 'ja-JP']>[] }
    | false
  >()
  expectTypeOf(strictDirectCtx.messages).toEqualTypeOf<{ en: ResourceSchema }>()
  expectTypeOf(strictDirectCtx.datetimeFormats).toEqualTypeOf<{
    zh: { short: { hour: 'numeric' } }
    'ja-JP': { short: { hour: 'numeric' } }
  }>()
  expectTypeOf(strictDirectCtx.numberFormats).toEqualTypeOf<{
    ca: {
      currency: {
        style: 'currency'
        currencyDisplay: 'symbol'
      }
    }
  }>()

  const nullCtx1 = createCoreContext({})
  expectTypeOf(nullCtx1.locale).toEqualTypeOf<Locale | LocaleDetector>()
  nullCtx1.locale = 'ja'
  nullCtx1.locale = () => 'ja'
  expectTypeOf(nullCtx1.fallbackLocale).toEqualTypeOf<
    | string
    | string[]
    | { [x in string]: PickupFallbackLocales<[string]>[] }
    | false
  >()
  nullCtx1.fallbackLocale = 'en'

  const nullCtx2 = createCoreContext({})
  const locale = nullCtx2.locale

  function detector1(arg: Locale): Locale {
    return arg
  }
  const detector: LocaleDetector =
    typeof locale === 'function'
      ? detector1.bind(null, 'foo')
      : typeof locale === 'string'
        ? () => locale
        : (arg: Locale) => arg
  expectTypeOf<LocaleDetector>(detector)
})
