/* eslint-disable @typescript-eslint/no-explicit-any */

import { createComposer } from '../src/composer'

import type {
  DateTimeFormat,
  FallbackLocales,
  NumberFormat,
  PickupFallbackLocales
} from '@intlify/core-base'
import type { MyDatetimeScehma, MyNumberSchema, ResourceSchema } from './schema'

declare module '../src/composer' {
  interface ComposerCustom {
    localeCode: string[]
  }
}

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

test('loose composer', () => {
  const looseComposer = createComposer(looseOptions)

  expectTypeOf(looseComposer.locale.value).toEqualTypeOf<
    'en' | 'ja' | 'en-US' | 'ja-JP'
  >()
  expectTypeOf(looseComposer.fallbackLocale.value).toEqualTypeOf<
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
  expectTypeOf(looseComposer.messages.value).toEqualTypeOf<{
    en: { foo: string; nest: { bar: string } }
    ja: { bar: string; nest: { bar: string } }
  }>()
  expectTypeOf(looseComposer.datetimeFormats.value).toEqualTypeOf<{
    'en-US': { short: {} }
  }>()
  expectTypeOf(looseComposer.numberFormats.value).toEqualTypeOf<{
    'ja-JP': { currency: {} }
  }>()
  expectTypeOf(looseComposer.t('nest.bar')).toEqualTypeOf<string>()
  expectTypeOf(
    looseComposer.t('nest', 1, { locale: 'en' })
  ).toEqualTypeOf<string>()
  expectTypeOf(
    looseComposer.t('foo', 'default msg', { locale: 'en' })
  ).toEqualTypeOf<string>()
  expectTypeOf(
    looseComposer.t('errors', [1], { plural: 1 })
  ).toEqualTypeOf<string>()
  expectTypeOf(looseComposer.t('errors', [1], 1)).toEqualTypeOf<string>()
  expectTypeOf(
    looseComposer.t('errors', [1], 'default msg')
  ).toEqualTypeOf<string>()
  expectTypeOf(
    looseComposer.t(1, { foo: 1 }, { locale: 'en' })
  ).toEqualTypeOf<string>()
  expectTypeOf(
    looseComposer.t('nest', { foo: 1 }, 'msg')
  ).toEqualTypeOf<string>()
  expectTypeOf(looseComposer.te('errors', 'en')).toEqualTypeOf<boolean>()
  expectTypeOf(looseComposer.tm('nest')).toEqualTypeOf<{ bar: string }>()
  expectTypeOf(looseComposer.tm('errors')).toEqualTypeOf<
    | string
    | {
        bar: string
      }
    | {
        bar: string
      }
    | Record<string, any>
  >()
  expectTypeOf(looseComposer.rt('foo')).toEqualTypeOf<string>()
  expectTypeOf(looseComposer.getLocaleMessage('en')).toEqualTypeOf<
    typeof looseComposer.messages.value.en
  >()
  expectTypeOf(
    looseComposer.getLocaleMessage<{ japan: string }>('japan')
  ).toEqualTypeOf<{ japan: string }>()
  expectTypeOf(looseComposer.localeCode).toEqualTypeOf<string[]>()

  looseComposer.setLocaleMessage('en', {
    foo: 'foo',
    nest: {
      bar: 'bar'
    },
    errors: ['error1']
  })
  looseComposer.setLocaleMessage<{ dio: string }>('jojo', {
    dio: 'The world!'
  })
  looseComposer.mergeLocaleMessage('en', {
    bar: 'foo'
  })
  looseComposer.mergeLocaleMessage<{ dio: string }>('en', {
    dio: 'The world!'
  })

  expectTypeOf(looseComposer.getDateTimeFormat('en-US')).toEqualTypeOf<{
    short: {}
  }>()
  expectTypeOf(
    looseComposer.getLocaleMessage<{ long: { hour: string } }>('en-US')
  ).toEqualTypeOf<{ long: { hour: string } }>()

  looseComposer.setDateTimeFormat('ja-JP', {
    short: {
      hour: 'numeric'
    }
  })
  looseComposer.setDateTimeFormat<{ stop: { hour: string } }>('world', {
    stop: { hour: 'infinity' }
  })
  looseComposer.mergeDateTimeFormat('en-US', {
    long: { hour: 'numeric' }
  })
  looseComposer.mergeDateTimeFormat<{ stop: { hour: string } }>('en-US', {
    stop: { hour: 'infinity' }
  })

  expectTypeOf(looseComposer.getNumberFormat('ja-JP')).toEqualTypeOf<{
    currency: {}
  }>()
  expectTypeOf(
    looseComposer.getNumberFormat<{ weight: { unit: string } }>('en-US')
  ).toEqualTypeOf<{ weight: { unit: string } }>()

  looseComposer.setNumberFormat('en-US', {
    currency: {
      currecy: 'USD'
    }
  })
  looseComposer.setNumberFormat<{ echoes: { act: string } }>('stand', {
    echoes: { act: '2' }
  })
  looseComposer.mergeNumberFormat('ja-JP', {
    weight: {
      unit: 'kiro'
    }
  })
  looseComposer.mergeNumberFormat<{ echoes: { act: string } }>('ja-JP', {
    echoes: { act: '2' }
  })
})

test('strict composer', () => {
  const strictComposer = createComposer<[ResourceSchema], 'en' | 'ja'>(
    strictOptions
  )

  expectTypeOf(strictComposer.locale.value).toEqualTypeOf<'en' | 'ja'>()
  expectTypeOf(strictComposer.fallbackLocale.value).toEqualTypeOf<
    | 'en'
    | 'ja'
    | ('en' | 'ja')[]
    | { [x in string]: PickupFallbackLocales<['en' | 'ja']>[] }
    | false
  >()
  expectTypeOf(strictComposer.messages.value).toEqualTypeOf<{
    en: ResourceSchema
    ja: ResourceSchema
  }>()
  expectTypeOf(strictComposer.datetimeFormats.value).toEqualTypeOf<{
    en: DateTimeFormat
    ja: DateTimeFormat
  }>()
  expectTypeOf(strictComposer.numberFormats.value).toEqualTypeOf<{
    en: NumberFormat
    ja: NumberFormat
  }>()
  expectTypeOf(strictComposer.t('nest.bar')).toEqualTypeOf<string>()
  expectTypeOf(
    strictComposer.t('nest', 1, { locale: 'en' })
  ).toEqualTypeOf<string>()
  expectTypeOf(
    strictComposer.t('foo', 'default msg', { locale: 'en' })
  ).toEqualTypeOf<string>()
  expectTypeOf(
    strictComposer.t('errors', [1], { plural: 1 })
  ).toEqualTypeOf<string>()
  expectTypeOf(strictComposer.t('errors', [1], 1)).toEqualTypeOf<string>()
  expectTypeOf(
    strictComposer.t('errors', [1], 'default msg')
  ).toEqualTypeOf<string>()
  expectTypeOf(
    strictComposer.t(1, { foo: 1 }, { locale: 'en' })
  ).toEqualTypeOf<string>()
  expectTypeOf(
    strictComposer.t('nest', { foo: 1 }, 'msg')
  ).toEqualTypeOf<string>()
  expectTypeOf(strictComposer.te('errors', 'en')).toEqualTypeOf<boolean>()
  expectTypeOf(strictComposer.tm('nest')).toEqualTypeOf<{ bar: string }>()
  expectTypeOf(strictComposer.tm('errors')).toEqualTypeOf<string[]>()
  expectTypeOf(strictComposer.rt('foo')).toEqualTypeOf<string>()
  expectTypeOf(strictComposer.getLocaleMessage('en')).toEqualTypeOf<
    typeof strictComposer.messages.value.en
  >()
  expectTypeOf(
    strictComposer.getLocaleMessage<{ japan: string }>('japan')
  ).toEqualTypeOf<{ japan: string }>()

  strictComposer.setLocaleMessage('en', {
    foo: 'foo',
    nest: {
      bar: 'bar'
    },
    errors: ['error1']
  })
  strictComposer.setLocaleMessage<{ dio: string }>('jojo', {
    dio: 'The world!'
  })
  strictComposer.mergeLocaleMessage('en', {
    bar: 'foo'
  })
  strictComposer.mergeLocaleMessage<{ dio: string }>('en', {
    dio: 'The world!'
  })
})

test('strict composer with direct options', () => {
  const strictDirectComposer = createComposer<
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

  expectTypeOf(strictDirectComposer.locale.value).toEqualTypeOf<
    'en' | 'zh' | 'ca' | 'ja-JP'
  >()
  expectTypeOf(strictDirectComposer.fallbackLocale.value).toEqualTypeOf<
    | 'en'
    | 'zh'
    | 'ca'
    | 'ja-JP'
    | ('en' | 'zh' | 'ca' | 'ja-JP')[]
    | { [x in string]: PickupFallbackLocales<['en' | 'zh' | 'ca' | 'ja-JP']>[] }
    | false
  >()
  expectTypeOf(strictDirectComposer.messages.value).toEqualTypeOf<{
    en: ResourceSchema
  }>()
  expectTypeOf(strictDirectComposer.datetimeFormats.value).toEqualTypeOf<{
    zh: { short: { hour: 'numeric' } }
    'ja-JP': { short: { hour: 'numeric' } }
  }>()
  expectTypeOf(strictDirectComposer.numberFormats.value).toEqualTypeOf<{
    ca: { currency: { style: 'currency'; currencyDisplay: 'symbol' } }
  }>()
  expectTypeOf(strictDirectComposer.d(new Date())).toEqualTypeOf<string>()
  expectTypeOf(
    strictDirectComposer.d(new Date(), 'short', 'ja-JP')
  ).toEqualTypeOf<string>()
  expectTypeOf(
    strictDirectComposer.d(new Date(), { key: 'short', locale: 'zh' })
  ).toEqualTypeOf<string>()
  expectTypeOf(
    strictDirectComposer.d(new Date(), 'custom' as any)
  ).toEqualTypeOf<string>()
  expectTypeOf(strictDirectComposer.n(1)).toEqualTypeOf<string>()
  expectTypeOf(
    strictDirectComposer.n(1, 'currency', 'zh')
  ).toEqualTypeOf<string>()
  expectTypeOf(
    strictDirectComposer.n(1, { key: 'currency', locale: 'en' })
  ).toEqualTypeOf<string>()
  expectTypeOf(
    strictDirectComposer.n(1, 'custom' as any)
  ).toEqualTypeOf<string>()

  // const noOptionsComposer = createComposer({ missingWarn: true })
  const noOptionsComposer = createComposer({ locale: 'en' })
  expectTypeOf(noOptionsComposer.locale.value).toEqualTypeOf<string>()
  expectTypeOf(noOptionsComposer.fallbackLocale.value).toEqualTypeOf<
    FallbackLocales<string>
  >()

  const nullComposer = createComposer({})
  expectTypeOf(nullComposer.locale.value).toEqualTypeOf<string>()
  nullComposer.locale.value = 'en'
  expectTypeOf(nullComposer.fallbackLocale.value).toEqualTypeOf<
    FallbackLocales<string>
  >()
  nullComposer.fallbackLocale.value = 'fr'
})

/* eslint-enable @typescript-eslint/no-explicit-any */
