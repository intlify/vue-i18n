/* eslint-disable @typescript-eslint/no-explicit-any */
import { expectType } from '..'

import {
  LocaleMessageValue,
  PickupFallbackLocales
} from '../../packages/core-base/src'
import {
  VueI18nOptions,
  createVueI18n
} from '../../packages/vue-i18n/src/legacy'
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

expectType<VueI18nOptions>(looseOptions)
expectType<
  VueI18nOptions<
    string,
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

// check loose VueI18n
const looseVueI18n = createVueI18n(looseOptions)
expectType<'en' | 'ja' | 'en-US' | 'ja-JP'>(looseVueI18n.locale)
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
>(looseVueI18n.fallbackLocale)
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
}>(looseVueI18n.messages)
expectType<{ 'en-US': { short: {} } }>(looseVueI18n.datetimeFormats)
expectType<{ 'ja-JP': { currency: {} } }>(looseVueI18n.numberFormats)
expectType<string>(looseVueI18n.t('nest.bar'))
expectType<string>(looseVueI18n.t('nest', 'en'))
expectType<string>(looseVueI18n.t('nest', 'en', [1]))
expectType<string>(looseVueI18n.t('nest', 'en', { foo: 'test' }))
expectType<string>(looseVueI18n.t('foo', [1]))
expectType<string>(looseVueI18n.t('nest', { foo: 1 }))
expectType<string>(looseVueI18n.tc('nest'))
expectType<string>(looseVueI18n.tc('bar', 'en'))
expectType<string>(looseVueI18n.tc('bar', ['foo']))
expectType<string>(looseVueI18n.tc('bar', { foo: 'foo' }))
expectType<string>(looseVueI18n.tc('nest.bar', 1))
expectType<string>(looseVueI18n.tc('nest.bar', 1, ['bar']))
expectType<string>(looseVueI18n.tc('nest.bar', 1, { foo: 'bar' }))
expectType<boolean>(looseVueI18n.te('errors', 'en'))
expectType<{ bar: string }>(looseVueI18n.tm('nest'))
expectType<LocaleMessageValue<string>>(looseVueI18n.tm('errors'))
expectType<string>(looseVueI18n.rt('foo'))
expectType<typeof looseVueI18n.messages.en>(looseVueI18n.getLocaleMessage('en'))
expectType<{ japan: string }>(
  looseVueI18n.getLocaleMessage<{ japan: string }>('japan')
)
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
looseVueI18n.setDateTimeFormat('en-US', {
  long: {
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
expectType<typeof looseVueI18n.numberFormats['ja-JP']>(
  looseVueI18n.getNumberFormat('ja-JP')
)
expectType<{ weight: { unit: string } }>(
  looseVueI18n.getNumberFormat<{ weight: { unit: string } }>('en-US')
)
looseVueI18n.setNumberFormat('en-US', {
  weight: {
    unit: 'kiro'
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

// check strict VueI18n
const strictVueI18n = createVueI18n<[ResourceSchema], 'en' | 'ja'>(
  strictOptions
)
expectType<'en' | 'ja'>(strictVueI18n.locale)
expectType<
  | 'en'
  | 'ja'
  | ('en' | 'ja')[]
  | { [x in string]: PickupFallbackLocales<['en' | 'ja']>[] }
  | false
>(strictVueI18n.fallbackLocale)
expectType<{ en: ResourceSchema; ja: ResourceSchema }>(strictVueI18n.messages)
expectType<{ en: {}; ja: {} }>(strictVueI18n.datetimeFormats)
expectType<{ en: {}; ja: {} }>(strictVueI18n.numberFormats)
expectType<string>(strictVueI18n.t('nest.bar'))
expectType<string>(strictVueI18n.t('nest', 'en'))
expectType<string>(strictVueI18n.t('nest', 'en', [1]))
expectType<string>(strictVueI18n.t('nest', 'en', { foo: 'test' }))
expectType<string>(strictVueI18n.t('foo', [1]))
expectType<string>(strictVueI18n.t('nest', { foo: 1 }))
expectType<string>(strictVueI18n.tc('nest'))
expectType<string>(strictVueI18n.tc('bar', 'en'))
expectType<string>(strictVueI18n.tc('bar', ['foo']))
expectType<string>(strictVueI18n.tc('bar', { foo: 'foo' }))
expectType<string>(strictVueI18n.tc('nest.bar', 1))
expectType<string>(strictVueI18n.tc('nest.bar', 1, ['bar']))
expectType<string>(strictVueI18n.tc('nest.bar', 1, { foo: 'bar' }))
expectType<boolean>(strictVueI18n.te('errors', 'en'))
expectType<{ bar: string }>(strictVueI18n.tm('nest'))
expectType<LocaleMessageValue<string>>(strictVueI18n.tm('errors'))
expectType<string>(strictVueI18n.rt('foo'))
expectType<typeof strictVueI18n.messages.en>(
  strictVueI18n.getLocaleMessage('en')
)
expectType<{ japan: string }>(
  strictVueI18n.getLocaleMessage<{ japan: string }>('japan')
)
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

/* eslint-enable @typescript-eslint/no-explicit-any */
