/* eslint-disable @typescript-eslint/no-explicit-any */
import { expectType } from '../index'

import {
  CoreOptions,
  SchemaParams,
  LocaleParams,
  PickupFallbackLocales,
  createCoreContext
} from '../../packages/core-base/src/context'
import type {
  ResourceSchema,
  MyDatetimeScehma,
  MyNumberSchema
} from '../schema'

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
      // bar: 'foo', // TODO:
      foo: 'foo',
      nest: {
        bar: 'bar'
      },
      errors: ['error2']
    }
  }
}

expectType<CoreOptions>(looseOptions)
expectType<
  CoreOptions<
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

// check loose context
const looseCtx = createCoreContext(looseOptions)
expectType<'en' | 'ja' | 'en-US' | 'ja-JP'>(looseCtx.locale)
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
>(looseCtx.fallbackLocale)
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
}>(looseCtx.messages)
expectType<{ 'en-US': { short: {} } }>(looseCtx.datetimeFormats)
expectType<{ 'ja-JP': { currency: {} } }>(looseCtx.numberFormats)

// check strict context
const strictCtx = createCoreContext<[ResourceSchema], 'en' | 'ja'>(
  strictOptions
)
expectType<'en' | 'ja'>(strictCtx.locale)
expectType<
  | 'en'
  | 'ja'
  | ('en' | 'ja')[]
  | { [x in string]: PickupFallbackLocales<['en' | 'ja']>[] }
  | false
>(strictCtx.fallbackLocale)
expectType<{ en: ResourceSchema; ja: ResourceSchema }>(strictCtx.messages)
expectType<{ en: {}; ja: {} }>(strictCtx.datetimeFormats)
expectType<{ en: {}; ja: {} }>(strictCtx.numberFormats)

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
      currency: { style: 'symbol' }
    }
  }
})
expectType<'en' | 'zh' | 'ca' | 'ja-JP'>(strictDirectCtx.locale)
expectType<
  | 'en'
  | 'zh'
  | 'ca'
  | 'ja-JP'
  | ('en' | 'zh' | 'ca' | 'ja-JP')[]
  | { [x in string]: PickupFallbackLocales<['en' | 'zh' | 'ca' | 'ja-JP']>[] }
  | false
>(strictDirectCtx.fallbackLocale)
expectType<{ en: ResourceSchema }>(strictDirectCtx.messages)
expectType<{ zh: {}; 'ja-JP': { short: {} } }>(strictDirectCtx.datetimeFormats)
expectType<{ ca: { currency: {} } }>(strictDirectCtx.numberFormats)

/* eslint-enable @typescript-eslint/no-explicit-any */
