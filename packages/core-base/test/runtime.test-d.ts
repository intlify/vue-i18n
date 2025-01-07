import type { MessageType } from '../src/runtime'

/**
 * Message Type
 */

type HaveToStringTypeAlias = {
  toString: (arg1: string, arg2: boolean) => string
}
class HaveToStringClass {
  toString(arg1: number, arg2: Date): string {
    return arg1.toString() + arg2.toString()
  }
}
class NotHaveToStringClass {}
enum NumberEnum {
  One,
  Two
}

test('string', () => {
  expectTypeOf<MessageType<string>>().toEqualTypeOf<string>()
})

test('number', () => {
  expectTypeOf<MessageType<number>>().toEqualTypeOf<number>()
})

test('boolean', () => {
  expectTypeOf<MessageType<boolean>>().toEqualTypeOf<boolean>()
})

test('Date', () => {
  expectTypeOf<MessageType<Date>>().toEqualTypeOf<Date>()
})

test('array', () => {
  expectTypeOf<MessageType<number[]>>().toEqualTypeOf<number[]>()
})

test('function', () => {
  expectTypeOf<MessageType<Function>>().toEqualTypeOf<Function>()
})

test('symbol', () => {
  expectTypeOf<MessageType<symbol>>().toEqualTypeOf<symbol>()
})

test('object', () => {
  expectTypeOf<MessageType<object>>().toEqualTypeOf<object>()
})

test('record', () => {
  expectTypeOf<MessageType<Record<string, number>>>().toEqualTypeOf<
    Record<string, number>
  >()
})

test('tuple', () => {
  expectTypeOf<MessageType<[number, string]>>().toEqualTypeOf<
    [number, string]
  >()
})

test('undefined', () => {
  expectTypeOf<MessageType<undefined>>().toEqualTypeOf<unknown>()
})

test('null', () => {
  expectTypeOf<MessageType<null>>().toEqualTypeOf<unknown>()
})

test('string literal', () => {
  // NOTE: ?
  expectTypeOf<MessageType<'hello'>>().toEqualTypeOf<string>()
})

test('number literal', () => {
  expectTypeOf<MessageType<1>>().toEqualTypeOf<1>()
})

test('boolean literal', () => {
  expectTypeOf<MessageType<true>>().toEqualTypeOf<true>()
})

test('bingint literal', () => {
  expectTypeOf<
    MessageType<9007199254740992n>
  >().toEqualTypeOf<9007199254740992n>()
})

test('object literal', () => {
  expectTypeOf<MessageType<{ text: string }>>().toEqualTypeOf<{
    text: string
  }>()
})

test('array (tuple) literal', () => {
  expectTypeOf<MessageType<[1, 2]>>().toEqualTypeOf<[1, 2]>()
})

test('function literal', () => {
  expectTypeOf<MessageType<() => ''>>().toEqualTypeOf<() => ''>()
})

test('empty object', () => {
  expectTypeOf<MessageType<{}>>().toEqualTypeOf<{}>()
})

test('class', () => {
  expectTypeOf<
    MessageType<HaveToStringClass>
  >().toEqualTypeOf<HaveToStringClass>()
  expectTypeOf<
    MessageType<NotHaveToStringClass>
  >().toEqualTypeOf<NotHaveToStringClass>()
  expectTypeOf<
    MessageType<HaveToStringTypeAlias>
  >().toEqualTypeOf<HaveToStringTypeAlias>()
})

test('enum', () => {
  expectTypeOf<MessageType<NumberEnum>>().toEqualTypeOf<NumberEnum>()
})

test('enum value', () => {
  expectTypeOf<MessageType<NumberEnum.One>>().toEqualTypeOf<NumberEnum.One>()
})

/* eslint-enable @typescript-eslint/no-explicit-any */
