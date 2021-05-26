/* eslint-disable @typescript-eslint/no-explicit-any */
import { expectType } from '..'

import {
  Locale,
  FallbackLocale,
  LocaleMessageValue,
  PickupFallbackLocales
} from '../../packages/core-base/src'
import {
  ComposerOptions,
  createComposer
} from '../../packages/vue-i18n/src/composer'
import { SchemaParams, LocaleParams } from '../../packages/core-base/src'
import { ResourceSchema, MyDatetimeScehma, MyNumberSchema } from '../schema'

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

expectType<ComposerOptions>(looseOptions)
expectType<
  ComposerOptions<
    SchemaParams<
      {
        message: ResourceSchema
        datetime: MyDatetimeScehma
        number: MyNumberSchema
      },
      string
    >,
    LocaleParams<'en' | 'ja'>
  >
>(strictOptions)

// check loose composer
const looseComposer = createComposer(looseOptions)
expectType<'en' | 'ja' | 'en-US' | 'ja-JP'>(looseComposer.locale.value)
expectType<
  | 'en'
  | 'ja'
  | 'en-US'
  | 'ja-JP'
  | ('en' | 'ja' | 'en-US' | 'ja-JP')[]
  | {
      [x in string]: PickupFallbackLocales<['en' | 'ja' | 'en-US' | 'ja-JP']>[]
    }
  | false
>(looseComposer.fallbackLocale.value)
expectType<{
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
}>(looseComposer.messages.value)
expectType<{ 'en-US': { short: {} } }>(looseComposer.datetimeFormats.value)
expectType<{ 'ja-JP': { currency: {} } }>(looseComposer.numberFormats.value)
expectType<string>(looseComposer.t('nest.bar'))
expectType<string>(looseComposer.t('nest', 1, { locale: 'en' }))
expectType<string>(looseComposer.t('foo', 'default msg', { locale: 'en' }))
expectType<string>(looseComposer.t('errors', [1], { plural: 1 }))
expectType<string>(looseComposer.t('errors', [1], 1))
expectType<string>(looseComposer.t('errors', [1], 'default msg'))
expectType<string>(looseComposer.t(1, { foo: 1 }, { locale: 'en' }))
expectType<string>(looseComposer.t('nestt', { foo: 1 }, 'msg'))
expectType<boolean>(looseComposer.te('errors', 'en'))
expectType<{ bar: string }>(looseComposer.tm('nest'))
expectType<LocaleMessageValue>(looseComposer.tm('errors'))
expectType<string>(looseComposer.rt('foo'))
expectType<typeof looseComposer.messages.value.en>(
  looseComposer.getLocaleMessage('en')
)
expectType<{ japan: string }>(
  looseComposer.getLocaleMessage<{ japan: string }>('japan')
)
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
expectType<typeof looseComposer.datetimeFormats.value['en-US']>(
  looseComposer.getDateTimeFormat('en-US')
)
expectType<{ long: { hour: string } }>(
  looseComposer.getLocaleMessage<{ long: { hour: string } }>('en-US')
)
looseComposer.setDateTimeFormat('en-US', {
  long: {
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
expectType<typeof looseComposer.numberFormats.value['ja-JP']>(
  looseComposer.getNumberFormat('ja-JP')
)
expectType<{ weight: { unit: string } }>(
  looseComposer.getNumberFormat<{ weight: { unit: string } }>('en-US')
)
looseComposer.setNumberFormat('en-US', {
  weight: {
    unit: 'kiro'
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

// check strict composer
const strictComposer = createComposer<[ResourceSchema], 'en' | 'ja'>(
  strictOptions
)
expectType<'en' | 'ja'>(strictComposer.locale.value)
expectType<
  | 'en'
  | 'ja'
  | ('en' | 'ja')[]
  | { [x in string]: PickupFallbackLocales<['en' | 'ja']>[] }
  | false
>(strictComposer.fallbackLocale.value)
expectType<{ en: ResourceSchema; ja: ResourceSchema }>(
  strictComposer.messages.value
)
expectType<{ en: {}; ja: {} }>(strictComposer.datetimeFormats.value)
expectType<{ en: {}; ja: {} }>(strictComposer.numberFormats.value)
expectType<string>(strictComposer.t('nest.bar'))
expectType<string>(strictComposer.t('nest', 1, { locale: 'en' }))
expectType<string>(strictComposer.t('foo', 'default msg', { locale: 'en' }))
expectType<string>(strictComposer.t('errors', [1], { plural: 1 }))
expectType<string>(strictComposer.t('errors', [1], 1))
expectType<string>(strictComposer.t('errors', [1], 'default msg'))
expectType<string>(strictComposer.t(1, { foo: 1 }, { locale: 'en' }))
expectType<string>(strictComposer.t('nestt', { foo: 1 }, 'msg'))
expectType<boolean>(strictComposer.te('errors', 'en'))
expectType<{ bar: string }>(strictComposer.tm('nest'))
expectType<LocaleMessageValue>(strictComposer.tm('errors'))
expectType<string>(strictComposer.rt('foo'))
expectType<typeof strictComposer.messages.value.en>(
  strictComposer.getLocaleMessage('en')
)
expectType<{ japan: string }>(
  strictComposer.getLocaleMessage<{ japan: string }>('japan')
)
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

// check strict context with direct options
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
      currency: { style: 'symbol' }
    }
  }
})
expectType<'en' | 'zh' | 'ca' | 'ja-JP'>(strictDirectComposer.locale.value)
expectType<
  | 'en'
  | 'zh'
  | 'ca'
  | 'ja-JP'
  | ('en' | 'zh' | 'ca' | 'ja-JP')[]
  | { [x in string]: PickupFallbackLocales<['en' | 'zh' | 'ca' | 'ja-JP']>[] }
  | false
>(strictDirectComposer.fallbackLocale.value)
expectType<{ en: ResourceSchema }>(strictDirectComposer.messages.value)
expectType<{ zh: {}; 'ja-JP': { short: {} } }>(
  strictDirectComposer.datetimeFormats.value
)
expectType<{ ca: { currency: {} } }>(strictDirectComposer.numberFormats.value)
expectType<string>(strictDirectComposer.d(new Date()))
expectType<string>(strictDirectComposer.d(new Date(), 'short', 'ja-JP'))
expectType<string>(
  strictDirectComposer.d(new Date(), { key: 'short', locale: 'zh' })
)
expectType<string>(strictDirectComposer.d(new Date(), 'custom' as any))
expectType<string>(strictDirectComposer.n(1))
expectType<string>(strictDirectComposer.n(1, 'currency', 'zh'))
expectType<string>(strictDirectComposer.n(1, { key: 'currency', locale: 'en' }))
expectType<string>(strictDirectComposer.n(1, 'custom' as any))

// const noOptionsComposer = createComposer({ missingWarn: true })
const noOptionsComposer = createComposer({ locale: 'en' })
expectType<unknown>(noOptionsComposer.locale.value)
expectType<unknown>(noOptionsComposer.fallbackLocale.value)

const nullComposer = createComposer({})
expectType<Locale>(nullComposer.locale.value)
nullComposer.locale.value = 'en'
expectType<FallbackLocale>(nullComposer.fallbackLocale.value)
nullComposer.fallbackLocale.value = 'fr'

/* eslint-enable @typescript-eslint/no-explicit-any */
