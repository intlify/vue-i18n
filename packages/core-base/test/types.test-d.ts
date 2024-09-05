import type { LocaleMessage } from '../src/context'
import type { DateTimeFormat, NumberFormat } from '../src/types/intl'
import type {
  ExtractToStringKey,
  IsEmptyObject,
  LocaleParams,
  RemovedIndexResources,
  RemoveIndexSignature,
  SchemaParams,
  StringConvertable
} from '../src/types/utils'

describe('IsEmptyObject', () => {
  test('empty object', () => {
    expectTypeOf<IsEmptyObject<{}>>().toEqualTypeOf<true>()
  })

  test('object', () => {
    expectTypeOf<IsEmptyObject<{ foo: string }>>().toEqualTypeOf<false>()
  })

  test('object type', () => {
    expectTypeOf<IsEmptyObject<object>>().toEqualTypeOf<true>()
  })

  test('record type', () => {
    expectTypeOf<IsEmptyObject<Record<string, string>>>().toEqualTypeOf<true>()
  })
})

describe('RemoveIndexSignature', () => {
  test('interface', () => {
    interface Foo {
      foo: string
      [index: number]: string
    }
    expectTypeOf<RemoveIndexSignature<Foo>>().toEqualTypeOf<{ foo: string }>()
  })

  test('object', () => {
    expectTypeOf<RemoveIndexSignature<{ foo: string }>>().toEqualTypeOf<{
      foo: string
    }>()
  })
})

describe('RemovedIndexResources', () => {
  test('resource', () => {
    interface Foo {
      foo: string
      bar: {
        buz: string
      }
    }
    expectTypeOf<RemovedIndexResources<Foo>>().toEqualTypeOf<{
      foo: string
      bar: { buz: string }
    }>()
  })
})

describe('SchemaParams', () => {
  test('tuple', () => {
    expectTypeOf<
      SchemaParams<
        [
          {
            foo: string
          }
        ]
      >
    >().toEqualTypeOf<{
      message: { foo: string }
      datetime: DateTimeFormat
      number: NumberFormat
    }>()
  })

  test('object', () => {
    expectTypeOf<
      SchemaParams<{
        message: {
          foo: string
        }
        datetime: DateTimeFormat
        number: NumberFormat
      }>
    >().toEqualTypeOf<{
      message: { foo: string }
      datetime: DateTimeFormat
      number: NumberFormat
    }>()
  })

  test('wrong case', () => {
    expectTypeOf<SchemaParams<{}, string>>().toEqualTypeOf<{
      message: LocaleMessage<string>
      datetime: DateTimeFormat
      number: NumberFormat
    }>()
  })
})

describe('LocaleParams', () => {
  test('union', () => {
    type Local1 = 'en' | 'ja'
    expectTypeOf<LocaleParams<Local1>>().toEqualTypeOf<
      | { messages: 'en'; datetimeFormats: 'en'; numberFormats: 'en' }
      | { messages: 'ja'; datetimeFormats: 'ja'; numberFormats: 'ja' }
    >()
  })

  test('object', () => {
    expectTypeOf<
      LocaleParams<{
        messages: 'ja'
        datetimeFormats: 'en'
        numberFormats: 'en-US'
      }>
    >().toEqualTypeOf<{
      messages: 'ja'
      datetimeFormats: 'en'
      numberFormats: 'en-US'
    }>()
  })

  test('string', () => {
    expectTypeOf<LocaleParams<'ja'>>().toEqualTypeOf<{
      messages: 'ja'
      datetimeFormats: 'ja'
      numberFormats: 'ja'
    }>()
  })

  test('default', () => {
    expectTypeOf<LocaleParams<undefined>>().toEqualTypeOf<{
      messages: 'en-US'
      datetimeFormats: 'en-US'
      numberFormats: 'en-US'
    }>()
  })
})

describe('ExtractToStringKey', () => {
  test('number', () => {
    expectTypeOf<ExtractToStringKey<number>>().toEqualTypeOf<'toString'>()
  })

  test('string', () => {
    expectTypeOf<ExtractToStringKey<string>>().toEqualTypeOf<'toString'>()
  })

  test('symbol', () => {
    expectTypeOf<ExtractToStringKey<symbol>>().toEqualTypeOf<'toString'>()
  })

  test('bigint', () => {
    expectTypeOf<ExtractToStringKey<bigint>>().toEqualTypeOf<'toString'>()
  })

  test('array', () => {
    expectTypeOf<ExtractToStringKey<string[]>>().toEqualTypeOf<'toString'>()
  })

  test('boolean', () => {
    expectTypeOf<ExtractToStringKey<boolean>>().toEqualTypeOf<never>()
  })

  test('undefined', () => {
    expectTypeOf<ExtractToStringKey<undefined>>().toEqualTypeOf<never>()
  })

  test('null', () => {
    expectTypeOf<ExtractToStringKey<null>>().toEqualTypeOf<never>()
  })

  test('object', () => {
    expectTypeOf<ExtractToStringKey<object>>().toEqualTypeOf<never>()
  })

  test('record', () => {
    expectTypeOf<
      ExtractToStringKey<Record<string, string>>
    >().toEqualTypeOf<never>()
  })

  test('tuple', () => {
    expectTypeOf<ExtractToStringKey<[1, 2]>>().toEqualTypeOf<'toString'>()
  })

  test('function', () => {
    expectTypeOf<ExtractToStringKey<Function>>().toEqualTypeOf<'toString'>()
  })

  test('literal number', () => {
    expectTypeOf<ExtractToStringKey<1>>().toEqualTypeOf<'toString'>()
  })

  test('literal bigint', () => {
    expectTypeOf<
      ExtractToStringKey<9007199254740992n>
    >().toEqualTypeOf<'toString'>()
  })

  test('literal string', () => {
    expectTypeOf<ExtractToStringKey<'hello'>>().toEqualTypeOf<'toString'>()
  })

  test('literal boolean', () => {
    expectTypeOf<ExtractToStringKey<true>>().toEqualTypeOf<never>()
  })

  test('literal function', () => {
    expectTypeOf<ExtractToStringKey<() => {}>>().toEqualTypeOf<never>()
  })

  test('literal object, which does not have toString', () => {
    expectTypeOf<ExtractToStringKey<{ foo: 1 }>>().toEqualTypeOf<never>()
  })

  test('literal object, which has toString', () => {
    expectTypeOf<
      ExtractToStringKey<{ toString: () => string }>
    >().toEqualTypeOf<'toString'>()
  })

  describe('union', () => {
    test('all union has toString', () => {
      expectTypeOf<ExtractToStringKey<'1' | '2'>>().toEqualTypeOf<'toString'>()
    })
    test('some union has toString', () => {
      expectTypeOf<ExtractToStringKey<'1' | true>>().toEqualTypeOf<never>()
    })
  })
})

describe('StringConvertable', () => {
  test('object has toString', () => {
    expectTypeOf<
      StringConvertable<{ toString: () => string }>
    >().toEqualTypeOf<{ toString: () => string }>()
  })

  test('object does not have toString', () => {
    expectTypeOf<StringConvertable<{ foo: string }>>().toEqualTypeOf<{
      foo: string
    }>()
  })

  test('empty object', () => {
    expectTypeOf<StringConvertable<{}>>().toEqualTypeOf<{}>()
  })

  test('object type', () => {
    expectTypeOf<StringConvertable<object>>().toEqualTypeOf<object>()
  })

  test('nubmer', () => {
    expectTypeOf<StringConvertable<number>>().toEqualTypeOf<number>()
  })

  test('string', () => {
    expectTypeOf<StringConvertable<string>>().toEqualTypeOf<string>()
  })

  test('symbol', () => {
    expectTypeOf<StringConvertable<symbol>>().toEqualTypeOf<symbol>()
  })

  test('bigint', () => {
    expectTypeOf<StringConvertable<bigint>>().toEqualTypeOf<bigint>()
  })

  test('array', () => {
    expectTypeOf<StringConvertable<string[]>>().toEqualTypeOf<string[]>()
  })

  test('boolean', () => {
    expectTypeOf<StringConvertable<boolean>>().toEqualTypeOf<boolean>()
  })

  test('undefined', () => {
    expectTypeOf<StringConvertable<undefined>>().toEqualTypeOf<unknown>()
  })

  test('null', () => {
    expectTypeOf<StringConvertable<null>>().toEqualTypeOf<unknown>()
  })

  test('record', () => {
    expectTypeOf<StringConvertable<Record<string, string>>>().toEqualTypeOf<
      Record<string, string>
    >()
  })

  test('tuple', () => {
    expectTypeOf<StringConvertable<[1, 2]>>().toEqualTypeOf<[1, 2]>()
  })

  test('function', () => {
    expectTypeOf<StringConvertable<Function>>().toEqualTypeOf<Function>()
  })

  test('literal number', () => {
    expectTypeOf<StringConvertable<1>>().toEqualTypeOf<1>()
  })

  test('literal bigint', () => {
    expectTypeOf<
      StringConvertable<9007199254740992n>
    >().toEqualTypeOf<9007199254740992n>()
  })

  test('literal string', () => {
    expectTypeOf<StringConvertable<'hello'>>().toEqualTypeOf<'hello'>()
  })

  test('literal boolean', () => {
    expectTypeOf<StringConvertable<true>>().toEqualTypeOf<true>()
  })

  test('literal function', () => {
    expectTypeOf<StringConvertable<() => {}>>().toEqualTypeOf<() => {}>()
  })
})
