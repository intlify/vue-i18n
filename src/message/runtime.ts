import { Path } from '../path'
import {
  isNumber,
  isFunction,
  toDisplayString,
  isObject,
  isString,
  isPlainObject
} from '../utils'

type ExtractToStringKey<T> = Extract<keyof T, 'toString'>
type ExtractToStringFunction<T> = T[ExtractToStringKey<T>]
// prettier-ignore
type StringConvertable<T> = ExtractToStringKey<T> extends never
  ? unknown
  : ExtractToStringFunction<T> extends (...args: any) => string // eslint-disable-line @typescript-eslint/no-explicit-any
    ? T
    : unknown

export type MessageType<T = string> = T extends string
  ? string
  : StringConvertable<T>

export type MessageFunctionCallable = <T = string>(
  ctx: MessageContext<T>
) => MessageType<T>
export type MessageFunctionInternal<T = string> = {
  (ctx: MessageContext<T>): MessageType<T>
  key?: string
  locale?: string
  source?: string
}
export type MessageFunction<T = string> =
  | MessageFunctionCallable
  | MessageFunctionInternal<T>
export type MessageFunctions<T = string> = Record<string, MessageFunction<T>>
export type MessageResolveFunction<T = string> = (
  key: string
) => MessageFunction<T>

export type MessageNormalize<T = string> = (
  values: MessageType<string | T>[]
) => MessageType<T | T[]>
export type MessageInterpolate<T = string> = (val: unknown) => MessageType<T>
export interface MessageProcessor<T = string> {
  type?: string
  interpolate?: MessageInterpolate<T>
  normalize?: MessageNormalize<T>
}

export type PluralizationRule = (
  choice: number,
  choicesLength: number,
  orgRule?: PluralizationRule
) => number
export type PluralizationRules = { [locale: string]: PluralizationRule }
export type PluralizationProps = {
  n?: number
  count?: number
}

export type LinkedModify<T = string> = (value: T) => MessageType<T>
export type LinkedModifiers<T = string> = { [key: string]: LinkedModify<T> }

export type NamedValue<T = {}> = T & Record<string, unknown>

// TODO: list and named type definition more improvements
export interface MessageContextOptions<T = string, N = {}> {
  parent?: MessageContext<T>
  locale?: string
  list?: unknown[]
  named?: NamedValue<N>
  modifiers?: LinkedModifiers<T>
  pluralIndex?: number
  pluralRules?: PluralizationRules
  messages?: MessageFunctions<T> | MessageResolveFunction<T> // TODO: need to design resolve message function?
  processor?: MessageProcessor<T>
}

export const enum HelperNameMap {
  LIST = 'list',
  NAMED = 'named',
  PLURAL = 'plural',
  LINKED = 'linked',
  MESSAGE = 'message',
  TYPE = 'type',
  INTERPOLATE = 'interpolate',
  NORMALIZE = 'normalize'
}

// TODO: list and named type definition more improvements
export interface MessageContext<T = string> {
  list(index: number): unknown
  named(key: string): unknown
  plural(messages: T[]): T
  linked(key: Path, modifier?: string): MessageType<T>
  message(key: Path): MessageFunction<T>
  type: string
  interpolate: MessageInterpolate<T>
  normalize: MessageNormalize<T>
}

const DEFAULT_MODIFIER = (str: string): string => str
const DEFAULT_MESSAGE = (ctx: MessageContext<string>): string => '' // eslint-disable-line
export const DEFAULT_MESSAGE_DATA_TYPE = 'text'
const DEFAULT_NORMALIZE = (values: string[]): string =>
  values.length === 0 ? '' : values.join('')
const DEFAULT_INTERPOLATE = toDisplayString

function pluralDefault(choice: number, choicesLength: number): number {
  choice = Math.abs(choice)
  if (choicesLength === 2) {
    // prettier-ignore
    return choice
      ? choice > 1
        ? 1
        : 0
      : 1
  }
  return choice ? Math.min(choice, 2) : 0
}

function getPluralIndex<T>(options: MessageContextOptions<T>): number {
  // prettier-ignore
  const index = isNumber(options.pluralIndex)
    ? options.pluralIndex
    : -1
  // prettier-ignore
  return options.named && (isNumber(options.named.count) || isNumber(options.named.n))
    ? isNumber(options.named.count)
      ? options.named.count
      : isNumber(options.named.n)
        ? options.named.n
        : index
    : index
}

function normalizeNamed(pluralIndex: number, props: PluralizationProps): void {
  if (!props.count) {
    props.count = pluralIndex
  }
  if (!props.n) {
    props.n = pluralIndex
  }
}

export function createMessageContext<T = string, N = {}>(
  options: MessageContextOptions<T, N> = {}
): MessageContext<T> {
  const locale = options.locale

  const pluralIndex = getPluralIndex(options)
  const pluralRule =
    isObject(options.pluralRules) &&
    isString(locale) &&
    isFunction(options.pluralRules[locale])
      ? options.pluralRules[locale]
      : pluralDefault
  const orgPluralRule =
    isObject(options.pluralRules) &&
    isString(locale) &&
    isFunction(options.pluralRules[locale])
      ? pluralDefault
      : undefined
  const plural = (messages: T[]): T =>
    messages[pluralRule(pluralIndex, messages.length, orgPluralRule)]

  const _list = options.list || []
  const list = (index: number): unknown => _list[index]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _named = options.named || ({} as any)
  isNumber(options.pluralIndex) && normalizeNamed(pluralIndex, _named)
  const named = (key: string): unknown => _named[key]

  // TODO: need to design resolve message function?
  function message(key: Path): MessageFunction<T> {
    // prettier-ignore
    const msg = isFunction(options.messages)
      ? options.messages(key)
      : isObject(options.messages)
        ? options.messages[key]
        : false
    return !msg
      ? options.parent
        ? options.parent.message(key) // resolve from parent messages
        : ((DEFAULT_MESSAGE as unknown) as MessageFunction<T>)
      : msg
  }

  const _modifier = (name: string): LinkedModify<T> =>
    options.modifiers
      ? options.modifiers[name]
      : ((DEFAULT_MODIFIER as unknown) as LinkedModify<T>)

  const normalize =
    isPlainObject(options.processor) && isFunction(options.processor.normalize)
      ? options.processor.normalize
      : ((DEFAULT_NORMALIZE as unknown) as MessageNormalize<T>)

  const interpolate =
    isPlainObject(options.processor) &&
    isFunction(options.processor.interpolate)
      ? options.processor.interpolate
      : ((DEFAULT_INTERPOLATE as unknown) as MessageInterpolate<T>)

  const type =
    isPlainObject(options.processor) && isString(options.processor.type)
      ? options.processor.type
      : DEFAULT_MESSAGE_DATA_TYPE

  const ctx = {
    [HelperNameMap.LIST]: list,
    [HelperNameMap.NAMED]: named,
    [HelperNameMap.PLURAL]: plural,
    [HelperNameMap.LINKED]: (key: Path, modifier?: string): MessageType<T> => {
      // TODO: should check `key`
      const msg = message(key)(ctx)
      return isString(modifier) ? _modifier(modifier)(msg as T) : msg
    },
    [HelperNameMap.MESSAGE]: message,
    [HelperNameMap.TYPE]: type,
    [HelperNameMap.INTERPOLATE]: interpolate,
    [HelperNameMap.NORMALIZE]: normalize
  }

  return ctx
}
