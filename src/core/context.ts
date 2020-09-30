import { CompileOptions } from '../message/options'
import { compile } from '../message/compiler'
import {
  LinkedModifiers,
  PluralizationRules,
  MessageProcessor,
  MessageFunction,
  MessageType
} from '../message/runtime'
import { CoreWarnCodes, getWarnMessage } from './warnings'
import { Path } from '../path'
import {
  warn,
  isString,
  isArray,
  isBoolean,
  isRegExp,
  isFunction,
  isPlainObject,
  isObject
} from '../utils'
import { DevToolsTimelineEvents, DevToolsEmitter } from '../debugger/constants'
import {
  NumberFormat,
  DateTimeFormat,
  DateTimeFormats as DateTimeFormatsType,
  NumberFormats as NumberFormatsType
} from './types'

export type Locale = string

export type FallbackLocale =
  | Locale
  | Locale[]
  | { [locale in string]: Locale[] }
  | false

export type LocaleMessageValue<Message = string> =
  | string
  | MessageFunction<Message>
  | LocaleMessageDictionary<Message>
  | LocaleMessageArray<Message>
export type LocaleMessageDictionary<Message = string> = {
  [property: string]: LocaleMessageValue<Message>
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LocaleMessageArray<Message = string>
  extends Array<LocaleMessageValue<Message>> {}
export type LocaleMessages<Message = string> = Record<
  Locale,
  LocaleMessageDictionary<Message>
>

/** @internal */
export type RuntimeMissingType =
  | 'translate'
  | 'datetime format'
  | 'number format'

/** @internal */
export type RuntimeMissingHandler<Message = string> = (
  context: RuntimeCommonContext<Message>,
  locale: Locale,
  key: Path,
  type: RuntimeMissingType,
  ...values: unknown[]
) => string | void
export type PostTranslationHandler<Message = string> = (
  translated: MessageType<Message>
) => MessageType<Message>

/** @internal */
export type MessageCompiler<Message = string> = (
  source: string,
  options?: CompileOptions
) => MessageFunction<Message>

/** @internal */
export interface RuntimeOptions<Message = string> {
  locale?: Locale
  fallbackLocale?: FallbackLocale
  messages?: LocaleMessages<Message>
  datetimeFormats?: DateTimeFormatsType
  numberFormats?: NumberFormatsType
  modifiers?: LinkedModifiers<Message>
  pluralRules?: PluralizationRules
  missing?: RuntimeMissingHandler<Message>
  missingWarn?: boolean | RegExp
  fallbackWarn?: boolean | RegExp
  fallbackFormat?: boolean
  unresolving?: boolean
  postTranslation?: PostTranslationHandler<Message>
  processor?: MessageProcessor<Message>
  warnHtmlMessage?: boolean
  messageCompiler?: MessageCompiler<Message>
  onWarn?: (msg: string, err?: Error) => void
}

/** @internal */
export interface RuntimeInternalOptions {
  __datetimeFormatters?: Map<string, Intl.DateTimeFormat>
  __numberFormatters?: Map<string, Intl.NumberFormat>
  __emitter?: DevToolsEmitter // for vue-devtools timeline event
}

/** @internal */
export interface RuntimeCommonContext<Message = string> {
  locale: Locale
  fallbackLocale: FallbackLocale
  missing: RuntimeMissingHandler<Message> | null
  missingWarn: boolean | RegExp
  fallbackWarn: boolean | RegExp
  fallbackFormat: boolean
  unresolving: boolean
  onWarn(msg: string, err?: Error): void
}

/** @internal */
export interface RuntimeTranslationContext<Messages = {}, Message = string>
  extends RuntimeCommonContext<Message> {
  messages: Messages
  modifiers: LinkedModifiers<Message>
  pluralRules?: PluralizationRules
  postTranslation: PostTranslationHandler<Message> | null
  processor: MessageProcessor<Message> | null
  warnHtmlMessage: boolean
  messageCompiler: MessageCompiler<Message>
}

/** @internal */
export interface RuntimeDateTimeContext<DateTimeFormats = {}, Message = string>
  extends RuntimeCommonContext<Message> {
  datetimeFormats: DateTimeFormats
}

/** @internal */
export interface RuntimeNumberContext<NumberFormats = {}, Message = string>
  extends RuntimeCommonContext<Message> {
  numberFormats: NumberFormats
}

/** @internal */
export interface RuntimeContext<
  Messages = {},
  DateTimeFormats = {},
  NumberFormats = {},
  Message = string
> extends RuntimeTranslationContext<Messages, Message>,
    RuntimeDateTimeContext<DateTimeFormats, Message>,
    RuntimeNumberContext<NumberFormats, Message> {}

/** @internal */
export interface RuntimeInternalContext {
  __datetimeFormatters: Map<string, Intl.DateTimeFormat>
  __numberFormatters: Map<string, Intl.NumberFormat>
  __localeChainCache?: Map<Locale, Locale[]>
  __emitter?: DevToolsEmitter // for vue-devtools timeline event
}

/** @internal */
export const NOT_REOSLVED = -1

/** @internal */
export const MISSING_RESOLVE_VALUE = ''

function getDefaultLinkedModifiers<Message = string>(): LinkedModifiers<
  Message
> {
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

/** @internal */
export function createRuntimeContext<
  Message = string,
  Options extends RuntimeOptions<Message> = object,
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
): RuntimeContext<
  Options['messages'],
  Options['datetimeFormats'],
  Options['numberFormats'],
  Message
> {
  // setup options
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
  const messageCompiler = isFunction(options.messageCompiler)
    ? options.messageCompiler
    : compile
  const onWarn = isFunction(options.onWarn) ? options.onWarn : warn

  // setup internal options
  const internalOptions = options as RuntimeInternalOptions
  const __datetimeFormatters = isObject(internalOptions.__datetimeFormatters)
    ? internalOptions.__datetimeFormatters
    : new Map<string, Intl.DateTimeFormat>()
  const __numberFormatters = isObject(internalOptions.__numberFormatters)
    ? internalOptions.__numberFormatters
    : new Map<string, Intl.NumberFormat>()

  const context = {
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
    messageCompiler,
    onWarn,
    __datetimeFormatters,
    __numberFormatters
  } as RuntimeContext<
    Options['messages'],
    Options['datetimeFormats'],
    Options['numberFormats'],
    Message
  >

  // for vue-devtools timeline event
  if (__DEV__) {
    ;((context as unknown) as RuntimeInternalContext).__emitter =
      internalOptions.__emitter != null ? internalOptions.__emitter : undefined
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
  context: RuntimeCommonContext<Message>,
  key: Path,
  locale: Locale,
  missingWarn: boolean | RegExp,
  type: RuntimeMissingType
): unknown {
  const { missing, onWarn } = context

  // for vue-devtools timeline event
  if (__DEV__) {
    const emitter = ((context as unknown) as RuntimeInternalContext).__emitter
    if (emitter) {
      emitter.emit(DevToolsTimelineEvents.MISSING, {
        locale,
        key,
        type
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
  ctx: RuntimeCommonContext<Message>,
  fallback: FallbackLocale,
  start: Locale = ''
): Locale[] {
  const context = (ctx as unknown) as RuntimeInternalContext

  if (start === '') {
    return []
  }

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
    const defaults = isArray(fallback)
      ? fallback
      : isPlainObject(fallback)
        ? fallback['default']
          ? fallback['default']
          : null
        : fallback

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
  ctx: RuntimeCommonContext<Message>,
  locale: Locale,
  fallback: FallbackLocale
): void {
  const context = (ctx as unknown) as RuntimeInternalContext
  context.__localeChainCache = new Map()
  getLocaleChain(ctx, fallback, locale)
}
