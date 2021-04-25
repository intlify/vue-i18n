import {
  warn,
  isString,
  isArray,
  isBoolean,
  isRegExp,
  isFunction,
  isPlainObject,
  isObject
} from '@intlify/shared'
import { VueDevToolsTimelineEvents } from '@intlify/vue-devtools'
import { initI18nDevTools } from './devtools'
import { CoreWarnCodes, getWarnMessage } from './warnings'

import type { Path } from '@intlify/message-resolver'
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
  MetaInfo,
  NumberFormat,
  DateTimeFormat,
  DateTimeFormats as DateTimeFormatsType,
  NumberFormats as NumberFormatsType
} from './types'

/** @VueI18nGeneral */
export type LocaleMessageValue<Message = string> =
  | string
  | MessageFunction<Message>
  | LocaleMessageDictionary<Message>
  | LocaleMessageArray<Message>

/** @VueI18nGeneral */
export type LocaleMessageDictionary<Message = string> = {
  [property: string]: LocaleMessageValue<Message>
}
/** @VueI18nGeneral */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LocaleMessageArray<Message = string>
  extends Array<LocaleMessageValue<Message>> {}
/** @VueI18nGeneral */
export type LocaleMessages<Message = string> = Record<
  Locale,
  LocaleMessageDictionary<Message>
>

export type CoreMissingHandler<Message = string> = (
  context: CoreCommonContext<Message>,
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

export interface CoreOptions<Message = string> {
  version?: string
  locale?: Locale
  fallbackLocale?: FallbackLocale
  messages?: LocaleMessages<Message>
  datetimeFormats?: DateTimeFormatsType
  numberFormats?: NumberFormatsType
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
  onWarn?: (msg: string, err?: Error) => void
}

export interface CoreInternalOptions {
  __datetimeFormatters?: Map<string, Intl.DateTimeFormat>
  __numberFormatters?: Map<string, Intl.NumberFormat>
  __v_emitter?: VueDevToolsEmitter // eslint-disable-line camelcase
  __meta?: MetaInfo
}

export interface CoreCommonContext<Message = string> {
  cid: number
  version: string
  locale: Locale
  fallbackLocale: FallbackLocale
  missing: CoreMissingHandler<Message> | null
  missingWarn: boolean | RegExp
  fallbackWarn: boolean | RegExp
  fallbackFormat: boolean
  unresolving: boolean
  onWarn(msg: string, err?: Error): void
}

export interface CoreTranslationContext<Messages = {}, Message = string>
  extends CoreCommonContext<Message> {
  messages: Messages
  modifiers: LinkedModifiers<Message>
  pluralRules?: PluralizationRules
  postTranslation: PostTranslationHandler<Message> | null
  processor: MessageProcessor<Message> | null
  warnHtmlMessage: boolean
  escapeParameter: boolean
  messageCompiler: MessageCompiler<Message> | null
}

export interface CoreDateTimeContext<DateTimeFormats = {}, Message = string>
  extends CoreCommonContext<Message> {
  datetimeFormats: DateTimeFormats
}

export interface CoreNumberContext<NumberFormats = {}, Message = string>
  extends CoreCommonContext<Message> {
  numberFormats: NumberFormats
}

export interface CoreContext<
  Messages = {},
  DateTimeFormats = {},
  NumberFormats = {},
  Message = string
> extends CoreTranslationContext<Messages, Message>,
    CoreDateTimeContext<DateTimeFormats, Message>,
    CoreNumberContext<NumberFormats, Message> {}

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
  Options extends CoreOptions<Message> = object,
  Messages extends Record<
    keyof Options['messages'],
    LocaleMessageDictionary<Message>
  > = Record<keyof Options['messages'], LocaleMessageDictionary<Message>>,
  DateTimeFormats extends Record<
    keyof Options['datetimeFormats'],
    DateTimeFormat
  > = Record<keyof Options['datetimeFormats'], DateTimeFormat>,
  NumberFormats extends Record<
    keyof Options['numberFormats'],
    NumberFormat
  > = Record<keyof Options['numberFormats'], NumberFormat>
>(
  options: Options = {} as Options
): CoreContext<
  Options['messages'],
  Options['datetimeFormats'],
  Options['numberFormats'],
  Message
> {
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
    : ({ [locale]: {} } as Messages)
  const datetimeFormats = isPlainObject(options.datetimeFormats)
    ? options.datetimeFormats
    : ({ [locale]: {} } as DateTimeFormats)
  const numberFormats = isPlainObject(options.numberFormats)
    ? options.numberFormats
    : ({ [locale]: {} } as NumberFormats)
  const modifiers = Object.assign(
    {} as LinkedModifiers<Message>,
    options.modifiers || ({} as LinkedModifiers<Message>),
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
    onWarn,
    __datetimeFormatters,
    __numberFormatters,
    __meta
  } as CoreContext<
    Options['messages'],
    Options['datetimeFormats'],
    Options['numberFormats'],
    Message
  >

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
  context: CoreCommonContext<Message>,
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
    const ret = missing(context, locale, key, type)
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
  ctx: CoreCommonContext<Message>,
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
  ctx: CoreCommonContext<Message>,
  locale: Locale,
  fallback: FallbackLocale
): void {
  const context = (ctx as unknown) as CoreInternalContext
  context.__localeChainCache = new Map()
  getLocaleChain(ctx, fallback, locale)
}
