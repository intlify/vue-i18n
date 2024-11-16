import * as vueI18n from '../src/i18n'
import { createI18n, useI18n } from '../src/i18n'

import type {
  DateTimeFormat,
  NumberFormat,
  PickupFallbackLocales
} from '@intlify/core-base'
import type { MyDatetimeScehma, MyNumberSchema, ResourceSchema } from './schema'

beforeEach(() => {
  // allow mocking
  vi.spyOn(vueI18n, 'useI18n').mockReturnValue(<ReturnType<typeof useI18n>>{
    t: (key: string) => `{{${key}}}`
  })
})

afterEach(() => {
  vi.resetAllMocks()
})

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
  legacy: false,
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

test('loose composer with useI18n', () => {
  const looseI18n = useI18n(looseOptions)

  expectTypeOf(looseI18n.locale.value).toEqualTypeOf<
    'en' | 'ja' | 'en-US' | 'ja-JP'
  >()
  expectTypeOf(looseI18n.fallbackLocale.value).toEqualTypeOf<
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
  expectTypeOf(looseI18n.messages.value).toEqualTypeOf<{
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

  expectTypeOf(looseI18n.datetimeFormats.value).toEqualTypeOf<{
    'en-US': { short: {} }
  }>()
  expectTypeOf(looseI18n.numberFormats.value).toEqualTypeOf<{
    'ja-JP': { currency: {} }
  }>()
  expectTypeOf(looseI18n.t('nest.bar')).toEqualTypeOf<string>()
  expectTypeOf(looseI18n.t('nest', 1, { locale: 'en' })).toEqualTypeOf<string>()
  expectTypeOf(
    looseI18n.t('foo', 'default msg', { locale: 'en' })
  ).toEqualTypeOf<string>()
  expectTypeOf(
    looseI18n.t('errors', [1], { plural: 1 })
  ).toEqualTypeOf<string>()
  expectTypeOf(looseI18n.t('errors', [1], 1)).toEqualTypeOf<string>()
  expectTypeOf(
    looseI18n.t('errors', [1], 'default msg')
  ).toEqualTypeOf<string>()
  expectTypeOf(
    looseI18n.t(1, { foo: 1 }, { locale: 'en' })
  ).toEqualTypeOf<string>()
  expectTypeOf(looseI18n.t('nest', { foo: 1 }, 'msg')).toEqualTypeOf<string>()
  expectTypeOf(looseI18n.te('errors', 'en')).toEqualTypeOf<boolean>()
  expectTypeOf(looseI18n.tm('nest')).toEqualTypeOf<{ bar: string }>()
  expectTypeOf(looseI18n.tm('errors')).toEqualTypeOf<
    | string
    | {
        bar: string
      }
    | {
        bar: string
      }
    | Record<string, any>
  >()
  expectTypeOf(looseI18n.rt('foo')).toEqualTypeOf<string>()
  expectTypeOf(looseI18n.getLocaleMessage('en')).toEqualTypeOf<
    typeof looseI18n.messages.value.en
  >()
  expectTypeOf(
    looseI18n.getLocaleMessage<{ japan: string }>('japan')
  ).toEqualTypeOf<{ japan: string }>()

  looseI18n.setLocaleMessage('en', {
    foo: 'foo',
    nest: {
      bar: 'bar'
    },
    errors: ['error1']
  })
  looseI18n.setLocaleMessage<{ dio: string }>('jojo', {
    dio: 'The world!'
  })
  looseI18n.mergeLocaleMessage('en', {
    bar: 'foo'
  })
  looseI18n.mergeLocaleMessage<{ dio: string }>('en', {
    dio: 'The world!'
  })

  expectTypeOf(looseI18n.getDateTimeFormat('en-US')).toEqualTypeOf<
    (typeof looseI18n.datetimeFormats.value)['en-US']
  >()
  expectTypeOf(
    looseI18n.getLocaleMessage<{ long: { hour: string } }>('en-US')
  ).toEqualTypeOf<{ long: { hour: string } }>()

  looseI18n.setDateTimeFormat('ja-JP', {
    short: {
      hour: 'numeric'
    }
  })
  looseI18n.setDateTimeFormat<{ stop: { hour: string } }>('world', {
    stop: { hour: 'infinity' }
  })
  looseI18n.mergeDateTimeFormat('en-US', {
    long: { hour: 'numeric' }
  })
  looseI18n.mergeDateTimeFormat<{ stop: { hour: string } }>('en-US', {
    stop: { hour: 'infinity' }
  })

  expectTypeOf(looseI18n.getNumberFormat('ja-JP')).toEqualTypeOf<
    (typeof looseI18n.numberFormats.value)['ja-JP']
  >()
  expectTypeOf(
    looseI18n.getNumberFormat<{ weight: { unit: string } }>('en-US')
  ).toEqualTypeOf<{ weight: { unit: string } }>()

  looseI18n.setNumberFormat('en-US', {
    currency: {
      currecy: 'USD'
    }
  })
  looseI18n.setNumberFormat<{ echoes: { act: string } }>('stand', {
    echoes: { act: '2' }
  })
  looseI18n.mergeNumberFormat('ja-JP', {
    weight: {
      unit: 'kiro'
    }
  })
  looseI18n.mergeNumberFormat<{ echoes: { act: string } }>('ja-JP', {
    echoes: { act: '2' }
  })
})

test('strict composer with useI18n', () => {
  const strictI18n = useI18n<[ResourceSchema], 'en' | 'ja'>(strictOptions)

  expectTypeOf(strictI18n.locale.value).toEqualTypeOf<'en' | 'ja'>()
  expectTypeOf(strictI18n.fallbackLocale.value).toEqualTypeOf<
    | 'en'
    | 'ja'
    | ('en' | 'ja')[]
    | { [x in string]: PickupFallbackLocales<['en' | 'ja']>[] }
    | false
  >()
  expectTypeOf(strictI18n.messages.value).toEqualTypeOf<{
    en: ResourceSchema
    ja: ResourceSchema
  }>()
  expectTypeOf(strictI18n.datetimeFormats.value).toEqualTypeOf<{
    en: DateTimeFormat
    ja: DateTimeFormat
  }>()
  expectTypeOf(strictI18n.numberFormats.value).toEqualTypeOf<{
    en: NumberFormat
    ja: NumberFormat
  }>()

  expectTypeOf(strictI18n.t('nest.bar')).toEqualTypeOf<string>()
  expectTypeOf(
    strictI18n.t('nest', 1, { locale: 'en' })
  ).toEqualTypeOf<string>()
  expectTypeOf(
    strictI18n.t('foo', 'default msg', { locale: 'en' })
  ).toEqualTypeOf<string>()
  expectTypeOf(
    strictI18n.t('errors', [1], { plural: 1 })
  ).toEqualTypeOf<string>()
  expectTypeOf(strictI18n.t('errors', [1], 1)).toEqualTypeOf<string>()
  expectTypeOf(
    strictI18n.t('errors', [1], 'default msg')
  ).toEqualTypeOf<string>()
  expectTypeOf(
    strictI18n.t(1, { foo: 1 }, { locale: 'en' })
  ).toEqualTypeOf<string>()
  expectTypeOf(strictI18n.t('nestt', { foo: 1 }, 'msg')).toEqualTypeOf<string>()
  expectTypeOf(strictI18n.te('errors', 'en')).toEqualTypeOf<boolean>()
  expectTypeOf(strictI18n.tm('nest')).toEqualTypeOf<{ bar: string }>()
  expectTypeOf(strictI18n.tm('errors')).toEqualTypeOf<string[]>()
  expectTypeOf(strictI18n.rt('foo')).toEqualTypeOf<string>()
  expectTypeOf(strictI18n.getLocaleMessage('en')).toEqualTypeOf<
    typeof strictI18n.messages.value.en
  >()
  expectTypeOf(
    strictI18n.getLocaleMessage<{ japan: string }>('japan')
  ).toEqualTypeOf<{ japan: string }>()

  strictI18n.setLocaleMessage('en', {
    foo: 'foo',
    nest: {
      bar: 'bar'
    },
    errors: ['error1']
  })
  strictI18n.setLocaleMessage<{ dio: string }>('jojo', {
    dio: 'The world!'
  })
  strictI18n.mergeLocaleMessage('en', {
    bar: 'foo'
  })
  strictI18n.mergeLocaleMessage<{ dio: string }>('en', {
    dio: 'The world!'
  })
})

test('global scope with type annotation at useI18n', () => {
  const globalComposer = useI18n<[ResourceSchema], 'en' | 'ja'>({
    inheritLocale: true,
    useScope: 'global'
  })

  expectTypeOf(globalComposer.locale.value).toEqualTypeOf<'en' | 'ja'>()
  expectTypeOf(
    globalComposer.t('nest.bar', { foo: 1 }, { locale: 'en' })
  ).toEqualTypeOf<string>()
})

test('local scope without type annotation at useI18n', () => {
  const localComposer = useI18n({
    useScope: 'local'
  })
  expectTypeOf(localComposer.locale.value).toEqualTypeOf<string>()
})

test('loose i18n', () => {
  // with object spread and composer
  const looseI18nComposer = createI18n({
    ...looseOptions,
    legacy: false
  }).global

  expectTypeOf(looseI18nComposer.locale.value).toEqualTypeOf<
    'en' | 'ja' | 'en-US' | 'ja-JP'
  >()
  expectTypeOf(looseI18nComposer.fallbackLocale.value).toEqualTypeOf<
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
  expectTypeOf(looseI18nComposer.messages.value).toEqualTypeOf<{
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

  const looseI18n = createI18n(looseOptions).global
  expectTypeOf(looseI18n.locale).toEqualTypeOf<
    'en' | 'ja' | 'en-US' | 'ja-JP'
  >()
  expectTypeOf(looseI18n.fallbackLocale).toEqualTypeOf<
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
  expectTypeOf(looseI18n.messages).toEqualTypeOf<{
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
  expectTypeOf(looseI18n.datetimeFormats).toEqualTypeOf<{
    'en-US': { short: {} }
  }>()
  expectTypeOf(looseI18n.numberFormats).toEqualTypeOf<{
    'ja-JP': { currency: {} }
  }>()
  expectTypeOf(looseI18n.t('nest.bar')).toEqualTypeOf<string>()
  expectTypeOf(looseI18n.t('nest', 'en')).toEqualTypeOf<string>()
  expectTypeOf(looseI18n.t('foo', [1])).toEqualTypeOf<string>()
  expectTypeOf(looseI18n.t('nest', { foo: 1 })).toEqualTypeOf<string>()
  expectTypeOf(looseI18n.te('errors', 'en')).toEqualTypeOf<boolean>()
  expectTypeOf(looseI18n.tm('nest')).toEqualTypeOf<{ bar: string }>()
  expectTypeOf(looseI18n.tm('errors')).toEqualTypeOf<
    | string
    | {
        bar: string
      }
    | {
        bar: string
      }
    | Record<string, any>
  >()
  expectTypeOf(looseI18n.rt('foo')).toEqualTypeOf<string>()
  expectTypeOf(looseI18n.getLocaleMessage('en')).toEqualTypeOf<
    typeof looseI18n.messages.en
  >()
  expectTypeOf(
    looseI18n.getLocaleMessage<{ japan: string }>('japan')
  ).toEqualTypeOf<{ japan: string }>()

  looseI18n.setLocaleMessage('en', {
    foo: 'foo',
    nest: {
      bar: 'bar'
    },
    errors: ['error1']
  })
  looseI18n.setLocaleMessage<{ dio: string }>('jojo', {
    dio: 'The world!'
  })
  looseI18n.mergeLocaleMessage('en', {
    bar: 'foo'
  })
  looseI18n.mergeLocaleMessage<{ dio: string }>('en', {
    dio: 'The world!'
  })

  expectTypeOf(looseI18n.getDateTimeFormat('en-US')).toEqualTypeOf<
    (typeof looseI18n.datetimeFormats)['en-US']
  >()
  expectTypeOf(
    looseI18n.getLocaleMessage<{ long: { hour: string } }>('en-US')
  ).toEqualTypeOf<{ long: { hour: string } }>()

  looseI18n.setDateTimeFormat('ja-JP', {
    short: {
      hour: 'numeric'
    }
  })
  looseI18n.setDateTimeFormat<{ stop: { hour: string } }>('world', {
    stop: { hour: 'infinity' }
  })
  looseI18n.mergeDateTimeFormat('en-US', {
    long: { hour: 'numeric' }
  })
  looseI18n.mergeDateTimeFormat<{ stop: { hour: string } }>('en-US', {
    stop: { hour: 'infinity' }
  })

  expectTypeOf(looseI18n.getNumberFormat('ja-JP')).toEqualTypeOf<
    (typeof looseI18n.numberFormats)['ja-JP']
  >()
  expectTypeOf(
    looseI18n.getNumberFormat<{ weight: { unit: string } }>('en-US')
  ).toEqualTypeOf<{ weight: { unit: string } }>()

  looseI18n.setNumberFormat('en-US', {
    currency: {
      currecy: 'USD'
    }
  })
  looseI18n.setNumberFormat<{ echoes: { act: string } }>('stand', {
    echoes: { act: '2' }
  })
  looseI18n.mergeNumberFormat('ja-JP', {
    weight: {
      unit: 'kiro'
    }
  })
  looseI18n.mergeNumberFormat<{ echoes: { act: string } }>('ja-JP', {
    echoes: { act: '2' }
  })
})

test('strict i18n', () => {
  const strictI18n = createI18n<[ResourceSchema], 'en' | 'ja', false>(
    strictOptions
  ).global

  expectTypeOf(strictI18n.locale.value).toEqualTypeOf<'en' | 'ja'>()
  expectTypeOf(strictI18n.fallbackLocale.value).toEqualTypeOf<
    | 'en'
    | 'ja'
    | ('en' | 'ja')[]
    | { [x in string]: PickupFallbackLocales<['en' | 'ja']>[] }
    | false
  >()
  expectTypeOf(strictI18n.messages.value).toEqualTypeOf<{
    en: ResourceSchema
    ja: ResourceSchema
  }>()
  expectTypeOf(strictI18n.datetimeFormats.value).toEqualTypeOf<{
    en: DateTimeFormat
    ja: DateTimeFormat
  }>()
  expectTypeOf(strictI18n.numberFormats.value).toEqualTypeOf<{
    en: NumberFormat
    ja: NumberFormat
  }>()
  expectTypeOf(strictI18n.t('nest.bar')).toEqualTypeOf<string>()
  expectTypeOf(
    strictI18n.t('nest', 1, { locale: 'en' })
  ).toEqualTypeOf<string>()
  expectTypeOf(
    strictI18n.t('foo', 'default msg', { locale: 'en' })
  ).toEqualTypeOf<string>()
  expectTypeOf(
    strictI18n.t('errors', [1], { plural: 1 })
  ).toEqualTypeOf<string>()
  expectTypeOf(strictI18n.t('errors', [1], 1)).toEqualTypeOf<string>()
  expectTypeOf(
    strictI18n.t('errors', [1], 'default msg')
  ).toEqualTypeOf<string>()
  expectTypeOf(
    strictI18n.t(1, { foo: 1 }, { locale: 'en' })
  ).toEqualTypeOf<string>()
  expectTypeOf(strictI18n.t('nest', { foo: 1 }, 'msg')).toEqualTypeOf<string>()
  expectTypeOf(strictI18n.te('errors', 'en')).toEqualTypeOf<boolean>()
  expectTypeOf(strictI18n.tm('nest')).toEqualTypeOf<{ bar: string }>()
  expectTypeOf(strictI18n.tm('errors')).toEqualTypeOf<string[]>()
  expectTypeOf(strictI18n.rt('foo')).toEqualTypeOf<string>()
  expectTypeOf(strictI18n.getLocaleMessage('en')).toEqualTypeOf<
    typeof strictI18n.messages.value.en
  >()
  expectTypeOf(
    strictI18n.getLocaleMessage<{ japan: string }>('japan')
  ).toEqualTypeOf<{ japan: string }>()

  strictI18n.setLocaleMessage('en', {
    foo: 'foo',
    nest: {
      bar: 'bar'
    },
    errors: ['error1']
  })
  strictI18n.setLocaleMessage<{ dio: string }>('jojo', {
    dio: 'The world!'
  })
  strictI18n.mergeLocaleMessage('en', {
    bar: 'foo'
  })
  strictI18n.mergeLocaleMessage<{ dio: string }>('en', {
    dio: 'The world!'
  })
})

test('strict i18n with direct i18n options', () => {
  const strictDirectI18n = createI18n<
    {
      message: ResourceSchema
      datetime: MyDatetimeScehma
      number: MyNumberSchema
    },
    { messages: 'en'; datetimeFormats: 'ja-JP' | 'zh'; numberFormats: 'ca' },
    false
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
  }).global

  expectTypeOf(strictDirectI18n.locale.value).toEqualTypeOf<
    'en' | 'zh' | 'ca' | 'ja-JP'
  >()
  expectTypeOf(strictDirectI18n.fallbackLocale.value).toEqualTypeOf<
    | 'en'
    | 'zh'
    | 'ca'
    | 'ja-JP'
    | ('en' | 'zh' | 'ca' | 'ja-JP')[]
    | { [x in string]: PickupFallbackLocales<['en' | 'zh' | 'ca' | 'ja-JP']>[] }
    | false
  >()
  expectTypeOf(strictDirectI18n.messages.value).toEqualTypeOf<{
    en: ResourceSchema
  }>()
  expectTypeOf(strictDirectI18n.datetimeFormats.value).toEqualTypeOf<{
    zh: { short: { hour: 'numeric' } }
    'ja-JP': { short: { hour: 'numeric' } }
  }>()
  expectTypeOf(strictDirectI18n.numberFormats.value).toEqualTypeOf<{
    ca: { currency: { style: 'currency'; currencyDisplay: 'symbol' } }
  }>()
})
