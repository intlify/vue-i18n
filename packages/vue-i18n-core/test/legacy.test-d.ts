import { createVueI18n } from '../src/legacy'

import type {
  DateTimeFormat,
  FallbackLocale,
  Locale,
  NumberFormat,
  PickupFallbackLocales
} from '@intlify/core-base'
import type { ResourceSchema } from './schema'

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
      },
      errors: ['error1']
    },
    ja: {
      bar: 'foo',
      nest: {
        bar: 'bar'
      },
      errors: ['error2']
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

test('loose legacy', () => {
  const looseVueI18n = createVueI18n(looseOptions)

  expectTypeOf(looseVueI18n.locale).toEqualTypeOf<
    'en' | 'ja' | 'en-US' | 'ja-JP'
  >()
  expectTypeOf(looseVueI18n.fallbackLocale).toEqualTypeOf<
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
  expectTypeOf(looseVueI18n.messages).toEqualTypeOf<{
    en: { foo: string; nest: { bar: string }; errors: string[] }
    ja: { bar: string; nest: { bar: string }; errors: string[] }
  }>()
  expectTypeOf(looseVueI18n.datetimeFormats).toEqualTypeOf<{
    'en-US': { short: {} }
  }>()
  expectTypeOf(looseVueI18n.numberFormats).toEqualTypeOf<{
    'ja-JP': { currency: {} }
  }>()
  expectTypeOf(looseVueI18n.t('nest.bar')).toEqualTypeOf<string>()
  expectTypeOf(looseVueI18n.t('nest', 'en')).toEqualTypeOf<string>()
  expectTypeOf(looseVueI18n.t('foo', [1])).toEqualTypeOf<string>()
  expectTypeOf(looseVueI18n.t('nest', { foo: 1 })).toEqualTypeOf<string>()
  expectTypeOf(looseVueI18n.tc('nest')).toEqualTypeOf<string>()
  expectTypeOf(looseVueI18n.tc('bar', 'en')).toEqualTypeOf<string>()
  expectTypeOf(looseVueI18n.tc('bar', ['foo'])).toEqualTypeOf<string>()
  expectTypeOf(looseVueI18n.tc('bar', { foo: 'foo' })).toEqualTypeOf<string>()
  expectTypeOf(looseVueI18n.tc('nest.bar', 1)).toEqualTypeOf<string>()
  expectTypeOf(looseVueI18n.tc('nest.bar', 1, ['bar'])).toEqualTypeOf<string>()
  expectTypeOf(
    looseVueI18n.tc('nest.bar', 1, { foo: 'bar' })
  ).toEqualTypeOf<string>()
  expectTypeOf(looseVueI18n.te('errors', 'en')).toEqualTypeOf<boolean>()
  expectTypeOf(looseVueI18n.tm('nest')).toEqualTypeOf<{ bar: string }>()
  expectTypeOf(looseVueI18n.tm('errors')).toEqualTypeOf<string[]>()
  expectTypeOf(looseVueI18n.rt('foo')).toEqualTypeOf<string>()
  expectTypeOf(looseVueI18n.getLocaleMessage('en')).toEqualTypeOf<{
    foo: string
    nest: { bar: string }
    errors: string[]
  }>()
  expectTypeOf(
    looseVueI18n.getLocaleMessage<{ japan: string }>('japan')
  ).toEqualTypeOf<{ japan: string }>()

  looseVueI18n.setLocaleMessage('en', {
    foo: 'foo',
    nest: {
      bar: 'bar'
    },
    errors: ['error1']
  })
  looseVueI18n.setLocaleMessage<{ dio: string }>('jojo', { dio: 'dio' })
  looseVueI18n.mergeLocaleMessage('en', {
    bar: 'foo'
  })
  looseVueI18n.setDateTimeFormat('ja-JP', {
    short: {
      hour: 'numeric'
    }
  })
  looseVueI18n.setDateTimeFormat<{ stop: { hour: string } }>('world', {
    stop: { hour: 'infinity' }
  })
  looseVueI18n.mergeDateTimeFormat('en-US', {
    long: { hour: 'numeric' }
  })
  looseVueI18n.mergeDateTimeFormat<{ stop: { hour: string } }>('en-US', {
    stop: { hour: 'infinity' }
  })

  expectTypeOf(looseVueI18n.getDateTimeFormat('en-US')).toEqualTypeOf<{
    short: {}
  }>()
  expectTypeOf(
    looseVueI18n.getDateTimeFormat<{ long: { hour: string } }>('en-US')
  ).toEqualTypeOf<{ long: { hour: string } }>()

  looseVueI18n.setNumberFormat('en-US', {
    currency: {
      currecy: 'USD'
    }
  })
  looseVueI18n.setNumberFormat<{ echoes: { act: string } }>('stand', {
    echoes: { act: '2' }
  })
  looseVueI18n.mergeNumberFormat('ja-JP', {
    weight: {
      unit: 'kiro'
    }
  })
  looseVueI18n.mergeNumberFormat<{ echoes: { act: string } }>('ja-JP', {
    echoes: { act: '2' }
  })
})

test('strict legacy', () => {
  const strictVueI18n = createVueI18n<[ResourceSchema], 'en' | 'ja'>(
    strictOptions
  )

  expectTypeOf(strictVueI18n.locale).toEqualTypeOf<'en' | 'ja'>()
  expectTypeOf(strictVueI18n.fallbackLocale).toEqualTypeOf<
    | 'en'
    | 'ja'
    | ('en' | 'ja')[]
    | { [x in string]: PickupFallbackLocales<['en' | 'ja']>[] }
    | false
  >()
  expectTypeOf(strictVueI18n.messages).toEqualTypeOf<{
    en: { foo: string; nest: { bar: string }; errors: string[] }
    ja: { foo: string; nest: { bar: string }; errors: string[] }
  }>()
  expectTypeOf(strictVueI18n.datetimeFormats).toEqualTypeOf<{
    en: DateTimeFormat
    ja: DateTimeFormat
  }>()
  expectTypeOf(strictVueI18n.numberFormats).toEqualTypeOf<{
    en: NumberFormat
    ja: NumberFormat
  }>()
  expectTypeOf(strictVueI18n.t('nest.bar')).toEqualTypeOf<string>()
  expectTypeOf(strictVueI18n.t('nest', 'en')).toEqualTypeOf<string>()
  expectTypeOf(strictVueI18n.t('foo', [1])).toEqualTypeOf<string>()
  expectTypeOf(strictVueI18n.t('nest', { foo: 1 })).toEqualTypeOf<string>()
  expectTypeOf(strictVueI18n.tc('nest')).toEqualTypeOf<string>()
  expectTypeOf(strictVueI18n.tc('bar', 'en')).toEqualTypeOf<string>()
  expectTypeOf(strictVueI18n.tc('bar', ['foo'])).toEqualTypeOf<string>()
  expectTypeOf(strictVueI18n.tc('bar', { foo: 'foo' })).toEqualTypeOf<string>()
  expectTypeOf(strictVueI18n.tc('nest.bar', 1)).toEqualTypeOf<string>()
  expectTypeOf(strictVueI18n.tc('nest.bar', 1, ['bar'])).toEqualTypeOf<string>()
  expectTypeOf(
    strictVueI18n.tc('nest.bar', 1, { foo: 'bar' })
  ).toEqualTypeOf<string>()
  expectTypeOf(strictVueI18n.te('errors', 'en')).toEqualTypeOf<boolean>()
  expectTypeOf(strictVueI18n.tm('nest')).toEqualTypeOf<{ bar: string }>()
  expectTypeOf(strictVueI18n.tm('errors')).toEqualTypeOf<string[]>()
  expectTypeOf(strictVueI18n.rt('foo')).toEqualTypeOf<string>()
  expectTypeOf(strictVueI18n.getLocaleMessage('en')).toEqualTypeOf<{
    foo: string
    nest: { bar: string }
    errors: string[]
  }>()
  expectTypeOf(
    strictVueI18n.getLocaleMessage<{ japan: string }>('japan')
  ).toEqualTypeOf<{ japan: string }>()

  strictVueI18n.setLocaleMessage('en', {
    foo: 'foo',
    nest: {
      bar: 'bar'
    },
    errors: ['error1']
  })
  strictVueI18n.setLocaleMessage<{ dio: string }>('jojo', {
    dio: 'The world!'
  })
  strictVueI18n.mergeLocaleMessage('en', {
    bar: 'foo'
  })
  strictVueI18n.mergeLocaleMessage<{ dio: string }>('en', {
    dio: 'The world!'
  })

  const nullVueI18n = createVueI18n({})
  expectTypeOf(nullVueI18n.locale).toEqualTypeOf<Locale>()
  nullVueI18n.locale = 'en'
  expectTypeOf(nullVueI18n.fallbackLocale).toEqualTypeOf<FallbackLocale>()
  nullVueI18n.fallbackLocale = 'fr'
})
