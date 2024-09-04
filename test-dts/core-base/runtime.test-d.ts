/* eslint-disable @typescript-eslint/no-explicit-any */
import { expectType } from '../index'

import { MessageType } from '../../packages/core-base/src'

/**
 * Message Type
 */

interface HaveToString {
  toString: () => string
}
interface NotHaveToString {
  foo: 1
}
type HaveToStringTypeAlias = {
  toString: (arg1: string, arg2: boolean) => string
}
type NotHaveToStringTypeAlias = { foo: 1 }
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
enum StringEnum {
  One = 'one',
  Two = 'two'
}

// OK
expectType<string>('' as MessageType) // default
expectType<string>('' as MessageType<string>) // string type
expectType<string>('' as MessageType<''>) // string literal
expectType<number>(1 as MessageType<number>) // number type
expectType<1>(1 as MessageType<1>) // number literal
expectType<Date>(new Date() as MessageType<Date>) // Date
// TODO:
// expectType<object>(Object.create(null) as MessageType<object>) // Object type
expectType<{ toString: () => '' }>(
  Object.create({ toString: () => '' }) as MessageType<{ toString: () => '' }>
) // object literal
expectType<Array<number>>([0] as MessageType<Array<number>>) // Array type
expectType<[1, 2]>([1, 2] as MessageType<[1, 2]>) // Array literal
expectType<[number, string]>([1, ''] as MessageType<[number, string]>) // Tuple

expectType<Function>((() => '') as MessageType<Function>) // Function
expectType<symbol>(Symbol('foo') as MessageType<symbol>) // Symbol
expectType<HaveToString>({} as MessageType<HaveToString>) // interface have toString
expectType<HaveToStringTypeAlias>({} as MessageType<HaveToStringTypeAlias>) // type alias have toString
expectType<HaveToStringClass>(
  new HaveToStringClass() as MessageType<HaveToStringClass>
) // class have toString
expectType<NumberEnum>(NumberEnum.One as MessageType<NumberEnum>) // number enum
expectType<NumberEnum.Two>(NumberEnum.Two as MessageType<NumberEnum.Two>) // number enum field
expectType<string>(StringEnum.One as MessageType<StringEnum>) // string enum
expectType<string>(StringEnum.Two as MessageType<StringEnum.Two>) // string enum field
expectType<string | { text: string; toString: () => '' }>(
  {} as MessageType<string | { text: string; toString: () => '' }>
)

// NG
expectType<unknown>(Boolean(1) as MessageType<boolean>) // boolean
expectType<unknown>(true as MessageType<true>) // true
expectType<unknown>(false as MessageType<false>) // false
expectType<unknown>(null as MessageType<null>) // null
expectType<unknown>(undefined as MessageType<undefined>) // undefined
expectType<unknown>(0 as MessageType<void>) // void
expectType<unknown>('' as MessageType<any>) // any
expectType<never>('' as MessageType<never>) // never
expectType<unknown>('' as MessageType<unknown>) // unknown
expectType<unknown>({} as MessageType<object>) // ts object
expectType<unknown>({} as MessageType<{}>) // object empty
expectType<unknown>(/foo/ as MessageType<RegExp>) // RegExp
expectType<unknown>({ foo: 1 } as MessageType<{ foo: 1 }>) // object that cannot covert
expectType<unknown>({} as MessageType<NotHaveToString>) // interface does not have toString
expectType<unknown>({} as MessageType<NotHaveToStringTypeAlias>) // type alias does not have toString
expectType<unknown>(
  new NotHaveToStringClass() as MessageType<NotHaveToStringClass>
) // class does not have toString

/* eslint-enable @typescript-eslint/no-explicit-any */
