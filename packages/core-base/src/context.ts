/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  warn,
  isString,
  isArray,
  isBoolean,
  isRegExp,
  isFunction,
  isPlainObject,
  assign,
  isObject,
  warnOnce
} from '@intlify/shared'
import { VueDevToolsTimelineEvents } from '@intlify/vue-devtools'
import { initI18nDevTools } from './devtools'
import { CoreWarnCodes, getWarnMessage } from './warnings'
import { resolveWithKeyValue } from './resolver'
import { fallbackWithSimple } from './fallbacker'

import type { CompileOptions, ResourceNode } from '@intlify/message-compiler'
// HACK: embbed `@intlify/vue-devtools` types to `.d.ts`, because `@intlify/dev-tools` is devDependencies
// TODO: Consider this type dependency when separating into intlify/core
import type { VueDevToolsEmitter } from '../../vue-devtools/src/index'
import type { Path, MessageResolver } from './resolver'
import type {
  Locale,
  LocaleDetector,
  FallbackLocale,
  CoreMissingType,
  LinkedModifiers,
  PluralizationRules,
  MessageProcessor,
  MessageFunction,
  MessageFunctionReturn,
  MessageType
} from './runtime'
import type {
  UnionToTuple,
  IsNever,
  LocaleRecord,
  NumberFormat,
  DateTimeFormat,
  DateTimeFormats as DateTimeFormatsType,
  NumberFormats as NumberFormatsType,
  SchemaParams,
  LocaleParams,
  PickupLocales,
  FallbackLocales,
  IsEmptyObject,
  RemoveIndexSignature
} from './types'
import type { LocaleFallbacker } from './fallbacker'

export interface MetaInfo {
  [field: string]: unknown
}

/** @VueI18nGeneral */
export type LocaleMessageValue<Message = string> =
  | LocaleMessageDictionary<any, Message>
  | string

// prettier-ignore
/** @VueI18nGeneral */
export type LocaleMessageType<T, Message = string> = T extends string
  ? string
  : T extends () => Promise<infer P>
  ? LocaleMessageDictionary<P, Message>
  : T extends (...args: infer Arguments) => any
  ? (...args: Arguments) => ReturnType<T>
  : T extends Record<string, unknown>
  ? LocaleMessageDictionary<T, Message>
  : T extends Array<T>
  ? { [K in keyof T]: T[K] }
  : T

/** @VueI18nGeneral */
export type LocaleMessageDictionary<T, Message = string> = {
  [K in keyof T]: LocaleMessageType<T[K], Message>
}

/** @VueI18nGeneral */
export type LocaleMessage<Message = string> = Record<
  string,
  LocaleMessageValue<Message>
>

/** @VueI18nGeneral */
export type LocaleMessages<
  Schema,
  Locales = Locale,
  Message = string // eslint-disable-line @typescript-eslint/no-unused-vars
> = LocaleRecord<UnionToTuple<Locales>, Schema>

/**
 * The type definition of Locale Message for `@intlify/core-base` package
 *
 * @remarks
 * The typealias is used to strictly define the type of the Locale message.
 *
 * @example
 * ```ts
 * // type.d.ts (`.d.ts` file at your app)
 * import { DefineCoreLocaleMessage } from '@intlify/core-base'
 *
 * declare module '@intlify/core-base' {
 *   export interface DefineCoreLocaleMessage {
 *     title: string
 *     menu: {
 *       login: string
 *     }
 *   }
 * }
 * ```
 *
 * @VueI18nGeneral
 */
export interface DefineCoreLocaleMessage extends LocaleMessage<string> {} // eslint-disable-line @typescript-eslint/no-empty-interface

export type DefaultCoreLocaleMessageSchema<
  Schema = RemoveIndexSignature<{
    [K in keyof DefineCoreLocaleMessage]: DefineCoreLocaleMessage[K]
  }>
> = IsEmptyObject<Schema> extends true ? LocaleMessage<string> : Schema

export type CoreMissingHandler<Message = string> = (
  context: CoreContext<Message>,
  locale: Locale,
  key: Path,
  type: CoreMissingType,
  ...values: unknown[]
) => string | void

/** @VueI18nGeneral */
export type PostTranslationHandler<Message = string> = (
  translated: MessageFunctionReturn<Message>,
  key: string
) => MessageFunctionReturn<Message>

/**
 * The context that will pass the message compiler.
 *
 * @VueI18nGeneral
 */
export type MessageCompilerContext = Pick<
  CompileOptions,
  'onError' | 'onCacheKey' | 'onWarn'
> & {
  /**
   * Whether to allow the use locale messages of HTML formatting.
   */
  warnHtmlMessage?: boolean
  /**
   * The resolved locale message key
   */
  key: string
  /**
   * The locale
   */
  locale: Locale
}

/**
 * The message compiler
 *
 * @param message - A resolved message that ususally will be passed the string. if you can transform to it with bundler, will be passed the AST.
 * @param context - A message context {@link MessageCompilerContext}
 *
 * @returns A {@link MessageFunction}
 *
 * @VueI18nGeneral
 */
export type MessageCompiler<
  Message = string,
  MessageSource = string | ResourceNode
> = (
  message: MessageSource,
  context: MessageCompilerContext
) => MessageFunction<Message>

// prettier-ignore
export interface CoreOptions<
  Message = string,
  Schema extends
  {
    message?: unknown
    datetime?: unknown
    number?: unknown
  } = {
    message: DefaultCoreLocaleMessageSchema,
    datetime: DateTimeFormat,
    number: NumberFormat
  },
  Locales extends
  | {
    messages: unknown
    datetimeFormats: unknown
    numberFormats: unknown
  }
  | string = Locale,
  MessagesLocales = Locales extends { messages: infer M }
  ? M
  : Locales extends string
  ? Locales
  : Locale,
  DateTimeFormatsLocales = Locales extends { datetimeFormats: infer D }
  ? D
  : Locales extends string
  ? Locales
  : Locale,
  NumberFormatsLocales = Locales extends { numberFormats: infer N }
  ? N
  : Locales extends string
  ? Locales
  : Locale,
  MessageSchema = Schema extends { message: infer M } ? M : DefaultCoreLocaleMessageSchema,
  DateTimeSchema = Schema extends { datetime: infer D } ? D : DateTimeFormat,
  NumberSchema = Schema extends { number: infer N } ? N : NumberFormat,
  _Messages extends LocaleMessages<
    MessageSchema,
    MessagesLocales,
    Message
  > = LocaleMessages<MessageSchema, MessagesLocales, Message>,
  _DateTimeFormats extends DateTimeFormatsType<DateTimeSchema, DateTimeFormatsLocales> = DateTimeFormatsType<DateTimeSchema, DateTimeFormatsLocales>,
  _NumberFormats extends NumberFormatsType<NumberSchema, NumberFormatsLocales> = NumberFormatsType<NumberSchema, NumberFormatsLocales>,
> {
  version?: string
  locale?: Locale | LocaleDetector
  fallbackLocale?: FallbackLocale
  messages?: { [K in keyof _Messages]: MessageSchema }
  datetimeFormats?: { [K in keyof _DateTimeFormats]: DateTimeSchema }
  numberFormats?: { [K in keyof _NumberFormats]: NumberSchema }
  modifiers?: LinkedModifiers<Message>
  pluralRules?: PluralizationRules
  missing?: CoreMissingHandler<Message>
  missingWarn?: boolean | RegExp
  fallbackWarn?: boolean | RegExp
  fallbackFormat?: boolean
  unresolving?: boolean
  postTranslation?: PostTranslationHandler<Message>
  processor?: MessageProcessor<Message>
  warnHtmlMessage?: boolean
  escapeParameter?: boolean
  messageCompiler?: MessageCompiler<Message, string | ResourceNode>
  messageResolver?: MessageResolver
  localeFallbacker?: LocaleFallbacker
  fallbackContext?: CoreContext<Message, MessagesLocales, DateTimeFormatsLocales, NumberFormatsLocales>
  onWarn?: (msg: string, err?: Error) => void
}

export interface CoreInternalOptions {
  __datetimeFormatters?: Map<string, Intl.DateTimeFormat>
  __numberFormatters?: Map<string, Intl.NumberFormat>
  __v_emitter?: VueDevToolsEmitter // eslint-disable-line camelcase
  __meta?: MetaInfo
}

export interface CoreCommonContext<Message = string, Locales = 'en-US'> {
  cid: number
  version: string
  locale: Locales
  fallbackLocale: FallbackLocales<Exclude<Locales, LocaleDetector>>
  missing: CoreMissingHandler<Message> | null
  missingWarn: boolean | RegExp
  fallbackWarn: boolean | RegExp
  fallbackFormat: boolean
  unresolving: boolean
  localeFallbacker: LocaleFallbacker
  onWarn(msg: string, err?: Error): void
}

export interface CoreTranslationContext<Messages = {}, Message = string> {
  messages: {
    [K in keyof Messages]: Messages[K]
  }
  modifiers: LinkedModifiers<Message>
  pluralRules?: PluralizationRules
  postTranslation: PostTranslationHandler<Message> | null
  processor: MessageProcessor<Message> | null
  warnHtmlMessage: boolean
  escapeParameter: boolean
  messageCompiler: MessageCompiler<Message, string | ResourceNode> | null
  messageResolver: MessageResolver
}

export interface CoreDateTimeContext<DateTimeFormats = {}> {
  datetimeFormats: { [K in keyof DateTimeFormats]: DateTimeFormats[K] }
}

export interface CoreNumberContext<NumberFormats = {}> {
  numberFormats: { [K in keyof NumberFormats]: NumberFormats[K] }
}

// prettier-ignore
export type CoreContext<
  Message = string,
  Messages = {},
  DateTimeFormats = {},
  NumberFormats = {},
  LocaleType = Locale,
  ResourceLocales =
  | PickupLocales<NonNullable<Messages>>
  | PickupLocales<NonNullable<DateTimeFormats>>
  | PickupLocales<NonNullable<NumberFormats>>,
  Locales = IsNever<ResourceLocales> extends true
  ? LocaleType extends LocaleDetector | Locale
  ? LocaleType
  : Locale
  : ResourceLocales
> = CoreCommonContext<Message, Locales> &
  CoreTranslationContext<NonNullable<Messages>, Message> &
  CoreDateTimeContext<NonNullable<DateTimeFormats>> &
  CoreNumberContext<NonNullable<NumberFormats>> & {
    fallbackContext?: CoreContext<
      Message,
      Messages,
      DateTimeFormats,
      NumberFormats,
      LocaleType,
      ResourceLocales,
      Locales
    >
  }

export interface CoreInternalContext {
  __datetimeFormatters: Map<string, Intl.DateTimeFormat>
  __numberFormatters: Map<string, Intl.NumberFormat>
  __localeChainCache?: Map<Locale, Locale[]>
  __v_emitter?: VueDevToolsEmitter // eslint-disable-line camelcase
  __meta: MetaInfo // for Intlify DevTools
}

/**
 * Intlify core-base version
 * @internal
 */
export const VERSION = __VERSION__

export const NOT_REOSLVED = -1

export const DEFAULT_LOCALE = 'en-US'

export const MISSING_RESOLVE_VALUE = ''

const capitalize = (str: string) =>
  `${str.charAt(0).toLocaleUpperCase()}${str.substr(1)}`

function getDefaultLinkedModifiers<
  Message = string
>(): LinkedModifiers<Message> {
  return {
    upper: (val: Message, type: string): MessageType<Message> => {
      // prettier-ignore
      return type === 'text' && isString(val)
        ? val.toUpperCase()
        : type === 'vnode' && isObject(val) && '__v_isVNode' in val
          ? (val as any).children.toUpperCase()
          : val
    },
    lower: (val: Message, type: string): MessageType<Message> => {
      // prettier-ignore
      return type === 'text' && isString(val)
        ? val.toLowerCase()
        : type === 'vnode' && isObject(val) && '__v_isVNode' in val
          ? (val as any).children.toLowerCase()
          : val
    },
    capitalize: (val: Message, type: string): MessageType<Message> => {
      // prettier-ignore
      return (type === 'text' && isString(val)
        ? capitalize(val)
        : type === 'vnode' && isObject(val) && '__v_isVNode' in val
          ? capitalize((val as any).children)
          : val) as MessageType<Message>
    }
  }
}

let _compiler: unknown | null

export function registerMessageCompiler<Message>(
  compiler: MessageCompiler<Message, string | ResourceNode>
): void {
  _compiler = compiler
}

let _resolver: unknown | null

/**
 * Register the message resolver
 *
 * @param resolver - A {@link MessageResolver} function
 *
 * @VueI18nGeneral
 */
export function registerMessageResolver(resolver: MessageResolver): void {
  _resolver = resolver
}

let _fallbacker: unknown | null

/**
 * Register the locale fallbacker
 *
 * @param fallbacker - A {@link LocaleFallbacker} function
 *
 * @VueI18nGeneral
 */
export function registerLocaleFallbacker(fallbacker: LocaleFallbacker): void {
  _fallbacker = fallbacker
}

// Additional Meta for Intlify DevTools
let _additionalMeta: MetaInfo | null = /* #__PURE__*/ null

/* #__NO_SIDE_EFFECTS__ */
export const setAdditionalMeta = (meta: MetaInfo | null): void => {
  _additionalMeta = meta
}

/* #__NO_SIDE_EFFECTS__ */
export const getAdditionalMeta = (): MetaInfo | null => _additionalMeta

let _fallbackContext: CoreContext | null = null

export const setFallbackContext = (context: CoreContext | null): void => {
  _fallbackContext = context
}

export const getFallbackContext = (): CoreContext | null => _fallbackContext

// ID for CoreContext
let _cid = 0

export function createCoreContext<
  Message = string,
  Options extends CoreOptions<Message> = CoreOptions<Message>,
  Messages extends Record<string, any> = Options['messages'] extends Record<
    string,
    any
  >
    ? Options['messages']
    : {},
  DateTimeFormats extends Record<
    string,
    any
  > = Options['datetimeFormats'] extends Record<string, any>
    ? Options['datetimeFormats']
    : {},
  NumberFormats extends Record<
    string,
    any
  > = Options['numberFormats'] extends Record<string, any>
    ? Options['numberFormats']
    : {},
  LocaleType = Locale | LocaleDetector
>(
  options: Options
): CoreContext<Message, Messages, DateTimeFormats, NumberFormats, LocaleType>

export function createCoreContext<
  Schema = LocaleMessage,
  Locales = 'en-US',
  Message = string,
  Options extends CoreOptions<
    Message,
    SchemaParams<Schema, Message>,
    LocaleParams<Locales>
  > = CoreOptions<
    Message,
    SchemaParams<Schema, Message>,
    LocaleParams<Locales>
  >,
  Messages extends Record<string, any> = NonNullable<
    Options['messages']
  > extends Record<string, any>
    ? NonNullable<Options['messages']>
    : {},
  DateTimeFormats extends Record<string, any> = NonNullable<
    Options['datetimeFormats']
  > extends Record<string, any>
    ? NonNullable<Options['datetimeFormats']>
    : {},
  NumberFormats extends Record<string, any> = NonNullable<
    Options['numberFormats']
  > extends Record<string, any>
    ? NonNullable<Options['numberFormats']>
    : {},
  LocaleType = Locale | LocaleDetector
>(
  options: Options
): CoreContext<Message, Messages, DateTimeFormats, NumberFormats, LocaleType>

export function createCoreContext<Message = string>(options: any = {}): any {
  // setup options
  const onWarn = isFunction(options.onWarn) ? options.onWarn : warn
  const version = isString(options.version) ? options.version : VERSION
  const locale =
    isString(options.locale) || isFunction(options.locale)
      ? options.locale
      : DEFAULT_LOCALE
  const _locale = isFunction(locale) ? DEFAULT_LOCALE : locale
  const fallbackLocale =
    isArray(options.fallbackLocale) ||
    isPlainObject(options.fallbackLocale) ||
    isString(options.fallbackLocale) ||
    options.fallbackLocale === false
      ? options.fallbackLocale
      : _locale
  const messages = isPlainObject(options.messages)
    ? options.messages
    : { [_locale]: {} }
  const datetimeFormats = !__LITE__
    ? isPlainObject(options.datetimeFormats)
      ? options.datetimeFormats
      : { [_locale]: {} }
    : /* #__PURE__*/ { [_locale]: {} }
  const numberFormats = !__LITE__
    ? isPlainObject(options.numberFormats)
      ? options.numberFormats
      : { [_locale]: {} }
    : /* #__PURE__*/ { [_locale]: {} }
  const modifiers = assign(
    {},
    options.modifiers || {},
    getDefaultLinkedModifiers<Message>()
  )
  const pluralRules = options.pluralRules || {}
  const missing = isFunction(options.missing) ? options.missing : null
  const missingWarn =
    isBoolean(options.missingWarn) || isRegExp(options.missingWarn)
      ? options.missingWarn
      : true
  const fallbackWarn =
    isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn)
      ? options.fallbackWarn
      : true
  const fallbackFormat = !!options.fallbackFormat
  const unresolving = !!options.unresolving
  const postTranslation = isFunction(options.postTranslation)
    ? options.postTranslation
    : null
  const processor = isPlainObject(options.processor) ? options.processor : null
  const warnHtmlMessage = isBoolean(options.warnHtmlMessage)
    ? options.warnHtmlMessage
    : true
  const escapeParameter = !!options.escapeParameter
  const messageCompiler = isFunction(options.messageCompiler)
    ? options.messageCompiler
    : _compiler
  if (
    __DEV__ &&
    !__GLOBAL__ &&
    !__TEST__ &&
    isFunction(options.messageCompiler)
  ) {
    warnOnce(getWarnMessage(CoreWarnCodes.EXPERIMENTAL_CUSTOM_MESSAGE_COMPILER))
  }
  const messageResolver = isFunction(options.messageResolver)
    ? options.messageResolver
    : _resolver || resolveWithKeyValue
  const localeFallbacker = isFunction(options.localeFallbacker)
    ? options.localeFallbacker
    : _fallbacker || fallbackWithSimple
  const fallbackContext = isObject(options.fallbackContext)
    ? options.fallbackContext
    : undefined

  // setup internal options
  const internalOptions = options as CoreInternalOptions
  const __datetimeFormatters = !__LITE__
    ? isObject(internalOptions.__datetimeFormatters)
      ? internalOptions.__datetimeFormatters
      : new Map<string, Intl.DateTimeFormat>()
    : /* #__PURE__*/ new Map<string, Intl.DateTimeFormat>()
  const __numberFormatters = !__LITE__
    ? isObject(internalOptions.__numberFormatters)
      ? internalOptions.__numberFormatters
      : new Map<string, Intl.NumberFormat>()
    : /* #__PURE__*/ new Map<string, Intl.NumberFormat>()
  const __meta = isObject(internalOptions.__meta) ? internalOptions.__meta : {}

  _cid++

  const context = {
    version,
    cid: _cid,
    locale,
    fallbackLocale,
    messages,
    modifiers,
    pluralRules,
    missing,
    missingWarn,
    fallbackWarn,
    fallbackFormat,
    unresolving,
    postTranslation,
    processor,
    warnHtmlMessage,
    escapeParameter,
    messageCompiler,
    messageResolver,
    localeFallbacker,
    fallbackContext,
    onWarn,
    __meta
  }

  if (!__LITE__) {
    ;(context as any).datetimeFormats = datetimeFormats
    ;(context as any).numberFormats = numberFormats
    ;(context as any).__datetimeFormatters = __datetimeFormatters
    ;(context as any).__numberFormatters = __numberFormatters
  }

  // for vue-devtools timeline event
  if (!__BRIDGE__ && __DEV__) {
    ;(context as unknown as CoreInternalContext).__v_emitter =
      internalOptions.__v_emitter != null
        ? internalOptions.__v_emitter
        : undefined
  }

  // NOTE: experimental !!
  if (__DEV__ || __FEATURE_PROD_INTLIFY_DEVTOOLS__) {
    initI18nDevTools(context, version, __meta)
  }

  return context
}

/** @internal */
export function isTranslateFallbackWarn(
  fallback: boolean | RegExp,
  key: Path
): boolean {
  return fallback instanceof RegExp ? fallback.test(key) : fallback
}

/** @internal */
export function isTranslateMissingWarn(
  missing: boolean | RegExp,
  key: Path
): boolean {
  return missing instanceof RegExp ? missing.test(key) : missing
}

/** @internal */
export function handleMissing<Message = string>(
  context: CoreContext<Message>,
  key: Path,
  locale: Locale,
  missingWarn: boolean | RegExp,
  type: CoreMissingType
): unknown {
  const { missing, onWarn } = context

  // for vue-devtools timeline event
  if (!__BRIDGE__ && __DEV__) {
    const emitter = (context as unknown as CoreInternalContext).__v_emitter
    if (emitter) {
      emitter.emit(VueDevToolsTimelineEvents.MISSING, {
        locale,
        key,
        type,
        groupId: `${type}:${key}`
      })
    }
  }

  if (missing !== null) {
    const ret = missing(context as any, locale, key, type)
    return isString(ret) ? ret : key
  } else {
    if (__DEV__ && isTranslateMissingWarn(missingWarn, key)) {
      onWarn(getWarnMessage(CoreWarnCodes.NOT_FOUND_KEY, { key, locale }))
    }
    return key
  }
}

/** @internal */
export function updateFallbackLocale<Message = string>(
  ctx: CoreContext<Message>,
  locale: Locale,
  fallback: FallbackLocale
): void {
  const context = ctx as unknown as CoreInternalContext
  context.__localeChainCache = new Map()
  ctx.localeFallbacker<Message>(ctx, fallback, locale)
}

/** @internal */
export function isAlmostSameLocale(
  locale: Locale,
  compareLocale: Locale
): boolean {
  if (locale === compareLocale) return false
  return locale.split('-')[0] === compareLocale.split('-')[0]
}

/** @internal */
export function isImplicitFallback(
  locale: Locale,
  fallbackLocale: FallbackLocale
): boolean {
  if (isString(fallbackLocale)) {
    return isAlmostSameLocale(locale, fallbackLocale)
  }

  if (isArray(fallbackLocale)) {
    return fallbackLocale.some(fbLocale => isAlmostSameLocale(locale, fbLocale))
  }

  if (isObject(fallbackLocale)) {
    return Object.values(fallbackLocale).some(fbLocales => {
      return fbLocales.some(fbLocale => isAlmostSameLocale(locale, fbLocale))
    })
  }

  return false
}

/* eslint-enable @typescript-eslint/no-explicit-any */
