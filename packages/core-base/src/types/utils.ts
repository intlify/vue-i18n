/* eslint-disable @typescript-eslint/no-explicit-any */

import type { LocaleMessage } from '../context';
import type { DateTimeFormat, NumberFormat } from './intl';

export type IsNever<T> = [T] extends [never] ? true : false

export type IsUnion<T, B = T> = T extends B
  ? [B] extends [T]
  ? false
  : true
  : never

export type IsTuple<T> = IsNever<T> extends true
  ? false
  : T extends readonly any[]
  ? number extends T['length']
  ? false
  : true
  : false;

export type IsRecord<T> = IsTuple<T> extends true
  ? false
  : [T] extends [Record<string, any>] ? true : false

export type IsObject<T> = IsTuple<T> extends true
  ? false
  : [T] extends [object] ? true : false

// prettier-ignore
export type UnionToIntersection<U> = (U extends any ? (arg: U) => void : never) extends (arg: infer I) => void
  ? I
  : never

export type LastInUnion<U> = UnionToIntersection<
  U extends unknown ? (x: U) => 0 : never
> extends (x: infer L) => 0
  ? L
  : never

export type UnionToTuple<U, Last = LastInUnion<U>> = [U] extends [never]
  ? []
  : [...UnionToTuple<Exclude<U, Last>>, Last]

export type LocaleRecord<T extends any[], R> = {
  [K in T[number]]: R
}

export type First<T extends readonly any[]> = T[0]

export declare type JsonPaths<T, Key extends keyof T = keyof T> = Key extends string ?
  T[Key] extends Record<string, any> ?
  `${Key}.${JsonPaths<T[Key]>}`
  : `${Key}`
  : never;
export declare type TranslationsPaths<T extends object, K extends keyof T = keyof T> = K extends string
  ? JsonPaths<T[K]> : never;

export type __ResourcePath<T, Key extends keyof T> = Key extends string
  ? T[Key] extends Record<string, any>
  ?
  | `${Key}.${__ResourcePath<T[Key], Exclude<keyof T[Key], keyof any[]>> &
  string}`
  | `${Key}.${Exclude<keyof T[Key], keyof any[]> & string}`
  : never
  : never
export type _ResourcePath<T> = __ResourcePath<T, keyof T> | keyof T
export type ResourcePath<T> = _ResourcePath<T> extends string | keyof T
  ? _ResourcePath<T>
  : keyof T

export type ResourceValue<
  T,
  P extends ResourcePath<T>
> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
  ? Rest extends ResourcePath<T[Key]>
  ? ResourceValue<T[Key], Rest>
  : never
  : never
  : P extends keyof T
  ? T[P]
  : never

export type PickupLocales<
  T extends Record<string, any>,
  K = keyof T
> = K extends string ? K : never

export type PickupKeys<
  T extends Record<string, any>,
  K = keyof T
> = K extends string ? ResourcePath<T[K]> : never

export type PickupPaths<T extends object> = ResourcePath<T>

type __ResourceFormatPath<T, Key extends keyof T> = Key extends string
  ? T[Key] extends Record<string, any>
  ? | `${Key}`
  : never
  : never
type _ResourceFormatPath<T> = __ResourceFormatPath<T, keyof T> | keyof T
export type ResourceFormatPath<T> = _ResourceFormatPath<T> extends string | keyof T
  ? _ResourceFormatPath<T>
  : keyof T

export type PickupFormatKeys<
  T extends Record<string, any>,
  K = keyof T
> = K extends string ? ResourceFormatPath<T[K]> : never

export type PickupFormatPathKeys<T extends object> = ResourceFormatPath<T>

export type PickupFallbackLocales<T extends any[]> = T[number] | `${T[number]}!`

export type FallbackLocales<Locales = 'en-US'> =
  | Locales
  | Array<Locales>
  | {
    [locale in string]: Array<PickupFallbackLocales<UnionToTuple<Locales>>>
  }
  | false

// prettier-ignore
type LocaleParamsType<T, R> = T extends IsUnion<T>
  ? T
  : T extends string
  ? T
  : R

// prettier-ignore
export type SchemaParams<T, Message = string> = T extends readonly any[]
  ? { message: First<T>, datetime: DateTimeFormat, number: NumberFormat }
  : T extends { message?: infer M, datetime?: infer D, number?: infer N }
  ? {
    message: M extends LocaleMessage<Message> ? M : LocaleMessage<Message>,
    datetime: D extends DateTimeFormat ? D : DateTimeFormat,
    number: N extends NumberFormat ? N : NumberFormat
  }
  : {
    message: LocaleMessage<Message>,
    datetime: DateTimeFormat,
    number: NumberFormat
  }

// prettier-ignore
export type LocaleParams<T, Default = 'en-US'> = T extends IsUnion<T>
  ? { messages: T, datetimeFormats: T, numberFormats: T }
  : T extends { messages?: infer M, datetimeFormats?: infer D, numberFormats?: infer N }
  ? {
    messages: LocaleParamsType<M, Default>,
    datetimeFormats: LocaleParamsType<D, Default>,
    numberFormats: LocaleParamsType<N, Default>
  }
  : T extends string
  ? { messages: T, datetimeFormats: T, numberFormats: T }
  : { messages: Default, datetimeFormats: Default, numberFormats: Default }

// prettier-ignore
export type RemoveIndexSignature<T> = {
  [K in keyof T as string extends K
  ? never
  : number extends K
  ? never
  : K
  ]: T[K]
}

declare const emptyObjectSymbol: unique symbol
export type EmptyObject = { [emptyObjectSymbol]?: never };
export type IsEmptyObject<T> = T extends { [emptyObjectSymbol]?: never } ? true : false;

export type RemovedIndexResources<T> = RemoveIndexSignature<{
  [K in keyof T]: T[K]
}>

export type ExtractToStringKey<T> = Extract<keyof T, 'toString'>
// export type ExtractToStringFunction<T> = T[ExtractToStringKey<T>]

/**
 * weather the type `T` is able to convert to string with `toString` method
 */
export type StringConvertable<T, Extracted = ExtractToStringKey<T>> = IsNever<Extracted> extends true
  ? T extends boolean
  ? T
  : T extends Function
  ? T
  : IsObject<T> extends true
  ? T
  : unknown
  : T
// : ExtractToStringFunction<T> extends (...args: any) => string
// ? T
// : unknown
// export type StringConvertable<T> = IsNever<ExtractToStringKey<T>> extends true
//   ? unknown
//   : ExtractToStringFunction<T> extends (...args: any) => string
//   ? T
//   : unknown

/* eslint-enable @typescript-eslint/no-explicit-any */
