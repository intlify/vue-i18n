/* eslint-disable @typescript-eslint/no-explicit-any */
import { expectType } from '..'

import {
  LocaleMessageValue,
  PickupFallbackLocales
} from '../../packages/core-base/src'
import {
  UseI18nOptions,
  I18nOptions,
  useI18n,
  createI18n
} from '../../packages/vue-i18n/src/i18n'
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

expectType<UseI18nOptions>(looseOptions)
expectType<
  UseI18nOptions<
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
const looseComposer = useI18n(looseOptions)
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
const strictComposer = useI18n<[ResourceSchema], 'en' | 'ja'>(strictOptions)
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

// not local scope
const globalComposer = useI18n<[ResourceSchema], 'en' | 'ja'>({
  inheritLocale: true,
  useScope: 'global'
})
expect<string>(globalComposer.t('nest.bar', { foo: 1 }, { locale: 'ja' }))

expectType<I18nOptions>(looseOptions)
expectType<
  I18nOptions<
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

// check loose i18n
const looseI18n = createI18n(looseOptions).global
expectType<'en' | 'ja' | 'en-US' | 'ja-JP'>(looseI18n.locale)
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
>(looseI18n.fallbackLocale)
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
}>(looseI18n.messages)
expectType<{ 'en-US': { short: {} } }>(looseI18n.datetimeFormats)
expectType<{ 'ja-JP': { currency: {} } }>(looseI18n.numberFormats)
expectType<string>(looseI18n.t('nest.bar'))
expectType<string>(looseI18n.t('nest', 'en'))
expectType<string>(looseI18n.t('nest', 'en', [1]))
expectType<string>(looseI18n.t('nest', 'en', { foo: 'test' }))
expectType<string>(looseI18n.t('foo', [1]))
expectType<string>(looseI18n.t('nest', { foo: 1 }))
expectType<string>(looseI18n.tc('nest'))
expectType<string>(looseI18n.tc('bar', 'en'))
expectType<string>(looseI18n.tc('bar', ['foo']))
expectType<string>(looseI18n.tc('bar', { foo: 'foo' }))
expectType<string>(looseI18n.tc('nest.bar', 1))
expectType<string>(looseI18n.tc('nest.bar', 1, ['bar']))
expectType<string>(looseI18n.tc('nest.bar', 1, { foo: 'bar' }))
expectType<boolean>(looseI18n.te('errors', 'en'))
expectType<{ bar: string }>(looseI18n.tm('nest'))
expectType<LocaleMessageValue>(looseI18n.tm('errors'))
expectType<string>(looseI18n.rt('foo'))
expectType<typeof looseI18n.messages.en>(looseI18n.getLocaleMessage('en'))
expectType<{ japan: string }>(
  looseI18n.getLocaleMessage<{ japan: string }>('japan')
)
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
expectType<typeof looseI18n.datetimeFormats['en-US']>(
  looseI18n.getDateTimeFormat('en-US')
)
expectType<{ long: { hour: string } }>(
  looseI18n.getLocaleMessage<{ long: { hour: string } }>('en-US')
)
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
expectType<typeof looseI18n.numberFormats['ja-JP']>(
  looseI18n.getNumberFormat('ja-JP')
)
expectType<{ weight: { unit: string } }>(
  looseI18n.getNumberFormat<{ weight: { unit: string } }>('en-US')
)
looseI18n.setNumberFormat('en-US', {
  weight: {
    unit: 'kiro'
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

// check strict i18n
const strictI18n = createI18n<[ResourceSchema], 'en' | 'ja', false>(
  strictOptions
).global
expectType<'en' | 'ja'>(strictI18n.locale.value)
expectType<
  | 'en'
  | 'ja'
  | ('en' | 'ja')[]
  | { [x in string]: PickupFallbackLocales<['en' | 'ja']>[] }
  | false
>(strictI18n.fallbackLocale.value)
expectType<{ en: ResourceSchema; ja: ResourceSchema }>(
  strictI18n.messages.value
)
expectType<{ en: {}; ja: {} }>(strictI18n.datetimeFormats.value)
expectType<{ en: {}; ja: {} }>(strictI18n.numberFormats.value)
expectType<string>(strictI18n.t('nest.bar'))
expectType<string>(strictI18n.t('nest', 1, { locale: 'en' }))
expectType<string>(strictI18n.t('foo', 'default msg', { locale: 'en' }))
expectType<string>(strictI18n.t('errors', [1], { plural: 1 }))
expectType<string>(strictI18n.t('errors', [1], 1))
expectType<string>(strictI18n.t('errors', [1], 'default msg'))
expectType<string>(strictI18n.t(1, { foo: 1 }, { locale: 'en' }))
expectType<string>(strictI18n.t('nestt', { foo: 1 }, 'msg'))
expectType<boolean>(strictI18n.te('errors', 'en'))
expectType<{ bar: string }>(strictI18n.tm('nest'))
expectType<LocaleMessageValue>(strictI18n.tm('errors'))
expectType<string>(strictI18n.rt('foo'))
expectType<typeof strictI18n.messages.value.en>(
  strictI18n.getLocaleMessage('en')
)
expectType<{ japan: string }>(
  strictI18n.getLocaleMessage<{ japan: string }>('japan')
)
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

// check strict with direct i18n options
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
      currency: { style: 'symbol' }
    }
  }
}).global
expectType<'en' | 'zh' | 'ca' | 'ja-JP'>(strictDirectI18n.locale.value)
expectType<
  | 'en'
  | 'zh'
  | 'ca'
  | 'ja-JP'
  | ('en' | 'zh' | 'ca' | 'ja-JP')[]
  | { [x in string]: PickupFallbackLocales<['en' | 'zh' | 'ca' | 'ja-JP']>[] }
  | false
>(strictDirectI18n.fallbackLocale.value)
expectType<{ en: ResourceSchema }>(strictDirectI18n.messages.value)
expectType<{ zh: {}; 'ja-JP': { short: {} } }>(
  strictDirectI18n.datetimeFormats.value
)
expectType<{ ca: { currency: {} } }>(strictDirectI18n.numberFormats.value)
