import {
  assign,
  isNumber,
  isFunction,
  toDisplayString,
  isObject,
  isString,
  isArray,
  isPlainObject,
  join
} from '@intlify/shared'
import { HelperNameMap } from '@intlify/message-compiler'
import { Path } from './resolver'

type ExtractToStringKey<T> = Extract<keyof T, 'toString'>
type ExtractToStringFunction<T> = T[ExtractToStringKey<T>]
// prettier-ignore
type StringConvertable<T> = ExtractToStringKey<T> extends never
	? unknown
	: ExtractToStringFunction<T> extends (...args: any) => string // eslint-disable-line @typescript-eslint/no-explicit-any
	  ? T
	  : unknown

/** @VueI18nGeneral */
export type Locale = string

/** @VueI18nGeneral */
export type FallbackLocale =
  | Locale
  | Locale[]
  | { [locale in string]: Locale[] }
  | false

export type CoreMissingType = 'translate' | 'datetime format' | 'number format'

export type MessageType<T = string> = T extends string
  ? string
  : StringConvertable<T>

/** @VueI18nGeneral */
export type MessageFunctionReturn<T = string> = T extends string
  ? MessageType<T>
  : MessageType<T>[]

export type MessageFunctionCallable = <T = string>(
  ctx: MessageContext<T>
) => MessageFunctionReturn<T>

/** * @internal */
export type MessageFunctionInternal<T = string> = {
  (ctx: MessageContext<T>): MessageFunctionReturn<T>
  key?: string
  locale?: string
  source?: string
}

/**
 * The Message Function.
 *
 * @param ctx - A {@link MessageContext}
 *
 * @return A resolved format message, that is string type basically.
 *
 * @VueI18nGeneral
 */
export type MessageFunction<T = string> =
  | MessageFunctionCallable
  | MessageFunctionInternal<T>

export type MessageFunctions<T = string> = Record<string, MessageFunction<T>>
export type MessageResolveFunction<T = string> = (
  key: string
) => MessageFunction<T>

export type MessageNormalize<T = string> = (
  values: MessageType<T>[]
) => MessageFunctionReturn<T>
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
/** @VueI18nGeneral */
export type PluralizationRules = { [locale: string]: PluralizationRule }
export type PluralizationProps = {
  n?: number
  count?: number
}

export type LinkedModify<T = string> = (
  value: T,
  type: string
) => MessageType<T>
/** @VueI18nGeneral */
export type LinkedModifiers<T = string> = { [key: string]: LinkedModify<T> }

/** @VueI18nGeneral */
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

export interface LinkedOptions {
  /**
   * The message type of linked message
   */
  type?: string
  /**
   * The modifier of linked message
   */
  modifier?: string
}

// TODO: list and named type definition more improvements

/**
 * The message context.
 *
 * @VueI18nGeneral
 */
export interface MessageContext<T = string> {
  /**
   * Resolve message value from list.
   *
   * @param index - An index of message values.
   *
   * @returns A resolved message value.
   *
   * @example
   * ```js
   * const messages = {
   *   en: {
   *     greeting: ({ list }) => `hello, ${list(0)}!`
   *   }
   * }
   * ```
   */
  list(index: number): unknown
  /**
   * Resolve message value from named.
   *
   * @param key - A key of message value.
   *
   * @returns A resolved message value.
   *
   * @example
   * ```js
   * const messages = {
   *   en: {
   *     greeting: ({ named }) => `hello, ${named('name')}!`
   *   }
   * }
   * ```
   */
  named(key: string): unknown
  /**
   * Resolve message with plural index.
   *
   * @remarks
   * That's resolved with plural index with translation function.
   *
   * @param messages - the messages, that is resolved with plural index with translation function.
   *
   * @returns A resolved message.
   *
   * @example
   * ```js
   * const messages = {
   *   en: {
   *     car: ({ plural }) => plural(['car', 'cars']),
   *     apple: ({ plural, named }) =>
   *       plural([
   *         'no apples',
   *         'one apple',
   *         `${named('count')} apples`
   *       ])
   *   }
   * }
   * ```
   */
  plural(messages: T[]): T
  /**
   * Resolve linked message.
   *
   * @param key - A message key
   * @param modifier - A modifier
   *
   * @returns A resolve message.
   */
  linked(key: Path, modifier?: string): MessageType<T>
  /**
   * Overloaded `linked`
   *
   * @param key - A message key
   * @param modifier - A modifier
   * @param type - A message type
   *
   * @returns A resolve message.
   */
  linked(key: Path, modifier?: string, type?: string): MessageType<T>
  /**
   * Overloaded `linked`
   *
   * @param key - A message key
   * @param optoins - An {@link LinkedOptions | linked options}
   *
   * @returns A resolve message.
   */
  linked(key: Path, optoins?: LinkedOptions): MessageType<T>
  /** @internal */
  message(key: Path): MessageFunction<T>
  /**
   * The message type to be handled by the message function.
   *
   * @remarks
   * Usually `text`, you need to return **string** in message function.
   */
  type: string
  /** @internal */
  interpolate: MessageInterpolate<T>
  /** @internal */
  normalize: MessageNormalize<T>
  /**
   * The message values.
   *
   * @remarks
   * The message values are the argument values passed from translation fucntion, such as `$t`, `t`, or `translate`.
   *
   * @example
   * vue-i18n `$t` (or `t`) case:
   * ```html
   * <p>{{ $t('greeting', { name: 'DIO' }) }}</p> <!-- `{ name: 'DIO' }` is message vlaues -->
   * ```
   *
   * `@intlify/core` (`@intlify/core-base`) `translate` case:
   * ```js
   * translate(context, 'foo.bar', ['dio']) // `['dio']` is message values
   * ```
   */
  values: Record<string, unknown>
}

const DEFAULT_MODIFIER = (str: string): string => str
const DEFAULT_MESSAGE = (ctx: MessageContext<string>): string => '' // eslint-disable-line
export const DEFAULT_MESSAGE_DATA_TYPE = 'text'
const DEFAULT_NORMALIZE = (values: string[]): string =>
  values.length === 0 ? '' : join(values)
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

function getPluralIndex<T, N>(options: MessageContextOptions<T, N>): number {
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
  const plural = (messages: T[]): T => {
    return messages[pluralRule(pluralIndex, messages.length, orgPluralRule)]
  }

  const _list = options.list || []
  const list = (index: number): unknown => _list[index]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _named = options.named || ({} as any)
  isNumber(options.pluralIndex) && normalizeNamed(pluralIndex, _named)
  const named = (key: string): unknown => _named[key]

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
        : (DEFAULT_MESSAGE as unknown as MessageFunction<T>)
      : msg
  }

  const _modifier = (name: string): LinkedModify<T> =>
    options.modifiers
      ? options.modifiers[name]
      : (DEFAULT_MODIFIER as unknown as LinkedModify<T>)

  const normalize =
    isPlainObject(options.processor) && isFunction(options.processor.normalize)
      ? options.processor.normalize
      : (DEFAULT_NORMALIZE as unknown as MessageNormalize<T>)

  const interpolate =
    isPlainObject(options.processor) &&
    isFunction(options.processor.interpolate)
      ? options.processor.interpolate
      : (DEFAULT_INTERPOLATE as unknown as MessageInterpolate<T>)

  const type =
    isPlainObject(options.processor) && isString(options.processor.type)
      ? options.processor.type
      : DEFAULT_MESSAGE_DATA_TYPE

  const linked = (key: Path, ...args: unknown[]): MessageType<T> => {
    const [arg1, arg2] = args
    let type = 'text'
    let modifier = ''
    if (args.length === 1) {
      if (isObject(arg1)) {
        modifier = arg1.modifier || modifier
        type = arg1.type || type
      } else if (isString(arg1)) {
        modifier = arg1 || modifier
      }
    } else if (args.length === 2) {
      if (isString(arg1)) {
        modifier = arg1 || modifier
      }
      if (isString(arg2)) {
        type = arg2 || type
      }
    }
    const ret = message(key)(ctx)
    const msg =
      // The message in vnode resolved with linked are returned as an array by processor.nomalize
      type === 'vnode' && isArray(ret) && modifier
        ? ret[0]
        : (ret as MessageType<T>)
    return modifier ? _modifier(modifier)(msg as T, type) : msg
  }

  const ctx = {
    [HelperNameMap.LIST]: list,
    [HelperNameMap.NAMED]: named,
    [HelperNameMap.PLURAL]: plural,
    [HelperNameMap.LINKED]: linked,
    [HelperNameMap.MESSAGE]: message,
    [HelperNameMap.TYPE]: type,
    [HelperNameMap.INTERPOLATE]: interpolate,
    [HelperNameMap.NORMALIZE]: normalize,
    [HelperNameMap.VALUES]: assign({}, _list, _named)
  }

  return ctx
}
