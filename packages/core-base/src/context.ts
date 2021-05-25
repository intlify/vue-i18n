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
  isObject
} from '@intlify/shared'
import { resolveValue } from '@intlify/message-resolver'
import { VueDevToolsTimelineEvents } from '@intlify/vue-devtools'
import { initI18nDevTools } from './devtools'
import { CoreWarnCodes, getWarnMessage } from './warnings'

import type { Path, MessageResolver } from '@intlify/message-resolver'
import type { CompileOptions } from '@intlify/message-compiler'
import type {
  Locale,
  FallbackLocale,
  CoreMissingType,
  LinkedModifiers,
  PluralizationRules,
  MessageProcessor,
  MessageFunction,
  MessageType
} from '@intlify/runtime'
import type { VueDevToolsEmitter } from '@intlify/vue-devtools'
import type {
  UnionToTuple,
  LocaleRecord,
  NumberFormat,
  DateTimeFormat,
  DateTimeFormats as DateTimeFormatsType,
  NumberFormats as NumberFormatsType,
  SchemaParams,
  LocaleParams,
  PickupLocales,
  FallbackLocales
} from './types'

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
      : T extends Record<string, any>
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

export type CoreMissingHandler<Message = string> = (
  context: CoreContext<Message>,
  locale: Locale,
  key: Path,
  type: CoreMissingType,
  ...values: unknown[]
) => string | void

/** @VueI18nGeneral */
export type PostTranslationHandler<Message = string> = (
  translated: MessageType<Message>
) => MessageType<Message>

export type MessageCompiler<Message = string> = (
  source: string,
  options?: CompileOptions
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
      message: LocaleMessage<Message>,
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
  MessageSchema = Schema extends { message: infer M } ? M : LocaleMessage<Message>,
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
  locale?: Locale
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
  messageCompiler?: MessageCompiler<Message>
  messageResolver?: MessageResolver
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
  fallbackLocale: FallbackLocales<Locales>
  missing: CoreMissingHandler<Message> | null
  missingWarn: boolean | RegExp
  fallbackWarn: boolean | RegExp
  fallbackFormat: boolean
  unresolving: boolean
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
  messageCompiler: MessageCompiler<Message> | null
  messageResolver: MessageResolver
}

export interface CoreDateTimeContext<DateTimeFormats = {}> {
  datetimeFormats: { [K in keyof DateTimeFormats]: DateTimeFormats[K] }
}

export interface CoreNumberContext<NumberFormats = {}> {
  numberFormats: { [K in keyof NumberFormats]: NumberFormats[K] }
}

export type CoreContext<
  Message = string,
  Messages = {},
  DateTimeFormats = {},
  NumberFormats = {},
  ResourceLocales =
    | PickupLocales<NonNullable<Messages>>
    | PickupLocales<NonNullable<DateTimeFormats>>
    | PickupLocales<NonNullable<NumberFormats>>,
  Locales = [ResourceLocales] extends [never] ? Locale : ResourceLocales
> = CoreCommonContext<Message, Locales> &
  CoreTranslationContext<NonNullable<Messages>, Message> &
  CoreDateTimeContext<NonNullable<DateTimeFormats>> &
  CoreNumberContext<NonNullable<NumberFormats>>

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

export const MISSING_RESOLVE_VALUE = ''

function getDefaultLinkedModifiers<
  Message = string
>(): LinkedModifiers<Message> {
  return {
    upper: (val: Message): MessageType<Message> =>
      (isString(val) ? val.toUpperCase() : val) as MessageType<Message>,
    lower: (val: Message): MessageType<Message> =>
      (isString(val) ? val.toLowerCase() : val) as MessageType<Message>,
    // prettier-ignore
    capitalize: (val: Message): MessageType<Message> =>
      (isString(val)
        ? `${val.charAt(0).toLocaleUpperCase()}${val.substr(1)}`
        : val) as MessageType<Message>
  }
}

let _compiler: unknown | null

export function registerMessageCompiler<Message>(
  compiler: MessageCompiler<Message>
): void {
  _compiler = compiler
}

// Additional Meta for Intlify DevTools
let _additionalMeta: MetaInfo | null = /* #__PURE__*/ null

export const setAdditionalMeta = /* #__PURE__*/ (
  meta: MetaInfo | null
): void => {
  _additionalMeta = meta
}

export const getAdditionalMeta = /* #__PURE__*/ (): MetaInfo | null =>
  _additionalMeta

// ID for CoreContext
let _cid = 0

export function createCoreContext<
  Message = string,
  Options extends CoreOptions<Message> = CoreOptions<Message>,
  Messages = Options['messages'] extends object ? Options['messages'] : {},
  DateTimeFormats = Options['datetimeFormats'] extends object
    ? Options['datetimeFormats']
    : {},
  NumberFormats = Options['numberFormats'] extends object
    ? Options['numberFormats']
    : {}
>(
  options: Options
): CoreContext<Message, Messages, DateTimeFormats, NumberFormats>

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
  Messages = Options['messages'] extends object ? Options['messages'] : {},
  DateTimeFormats = Options['datetimeFormats'] extends object
    ? Options['datetimeFormats']
    : {},
  NumberFormats = Options['numberFormats'] extends object
    ? Options['numberFormats']
    : {}
>(
  options: Options
): CoreContext<Message, Messages, DateTimeFormats, NumberFormats>

export function createCoreContext<Message = string>(options: any = {}): any {
  // setup options
  const version = isString(options.version) ? options.version : VERSION
  const locale = isString(options.locale) ? options.locale : 'en-US'
  const fallbackLocale =
    isArray(options.fallbackLocale) ||
    isPlainObject(options.fallbackLocale) ||
    isString(options.fallbackLocale) ||
    options.fallbackLocale === false
      ? options.fallbackLocale
      : locale
  const messages = isPlainObject(options.messages)
    ? options.messages
    : { [locale]: {} }
  const datetimeFormats = isPlainObject(options.datetimeFormats)
    ? options.datetimeFormats
    : { [locale]: {} }
  const numberFormats = isPlainObject(options.numberFormats)
    ? options.numberFormats
    : { [locale]: {} }
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
  const messageResolver = isFunction(options.messageResolver)
    ? options.messageResolver
    : resolveValue
  const onWarn = isFunction(options.onWarn) ? options.onWarn : warn

  // setup internal options
  const internalOptions = options as CoreInternalOptions
  const __datetimeFormatters = isObject(internalOptions.__datetimeFormatters)
    ? internalOptions.__datetimeFormatters
    : new Map<string, Intl.DateTimeFormat>()
  const __numberFormatters = isObject(internalOptions.__numberFormatters)
    ? internalOptions.__numberFormatters
    : new Map<string, Intl.NumberFormat>()
  const __meta = isObject(internalOptions.__meta) ? internalOptions.__meta : {}

  _cid++

  const context = {
    version,
    cid: _cid,
    locale,
    fallbackLocale,
    messages,
    datetimeFormats,
    numberFormats,
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
    onWarn,
    __datetimeFormatters,
    __numberFormatters,
    __meta
  }

  // for vue-devtools timeline event
  if (__DEV__) {
    ;((context as unknown) as CoreInternalContext).__v_emitter =
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
  if (__DEV__) {
    const emitter = ((context as unknown) as CoreInternalContext).__v_emitter
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
export function getLocaleChain<Message = string>(
  ctx: CoreContext<Message>,
  fallback: FallbackLocale,
  start: Locale
): Locale[] {
  const context = (ctx as unknown) as CoreInternalContext

  if (!context.__localeChainCache) {
    context.__localeChainCache = new Map()
  }

  let chain = context.__localeChainCache.get(start)
  if (!chain) {
    chain = []

    // first block defined by start
    let block: unknown = [start]

    // while any intervening block found
    while (isArray(block)) {
      block = appendBlockToChain(chain, block, fallback)
    }

    // prettier-ignore
    // last block defined by default
    const defaults = isArray(fallback) || !isPlainObject(fallback)
      ? fallback
      : fallback['default']
        ? fallback['default']
        : null

    // convert defaults to array
    block = isString(defaults) ? [defaults] : defaults
    if (isArray(block)) {
      appendBlockToChain(chain, block, false)
    }
    context.__localeChainCache.set(start, chain)
  }

  return chain
}

function appendBlockToChain(
  chain: Locale[],
  block: Locale[],
  blocks: FallbackLocale
): unknown {
  let follow: unknown = true
  for (let i = 0; i < block.length && isBoolean(follow); i++) {
    const locale = block[i]
    if (isString(locale)) {
      follow = appendLocaleToChain(chain, block[i], blocks)
    }
  }
  return follow
}

function appendLocaleToChain(
  chain: Locale[],
  locale: Locale,
  blocks: FallbackLocale
): unknown {
  let follow: unknown
  const tokens = locale.split('-')
  do {
    const target = tokens.join('-')
    follow = appendItemToChain(chain, target, blocks)
    tokens.splice(-1, 1)
  } while (tokens.length && follow === true)
  return follow
}

function appendItemToChain(
  chain: Locale[],
  target: Locale,
  blocks: FallbackLocale
): unknown {
  let follow: unknown = false
  if (!chain.includes(target)) {
    follow = true
    if (target) {
      follow = target[target.length - 1] !== '!'
      const locale = target.replace(/!/g, '')
      chain.push(locale)
      if (
        (isArray(blocks) || isPlainObject(blocks)) &&
        (blocks as any)[locale] // eslint-disable-line @typescript-eslint/no-explicit-any
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        follow = (blocks as any)[locale]
      }
    }
  }
  return follow
}

/** @internal */
export function updateFallbackLocale<Message = string>(
  ctx: CoreContext<Message>,
  locale: Locale,
  fallback: FallbackLocale
): void {
  const context = (ctx as unknown) as CoreInternalContext
  context.__localeChainCache = new Map()
  getLocaleChain<Message>(ctx, fallback, locale)
}

/* eslint-enable @typescript-eslint/no-explicit-any */
