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
import { DateTimeFormats, NumberFormats } from './types'

export type Locale = string

export type FallbackLocale =
  | Locale
  | Locale[]
  | { [locale in string]: Locale[] }
  | false

// TODO: should more design it's useful typing ...
export type LocaleMessageDictionary = {
  [property: string]: LocaleMessage
}
export type LocaleMessage =
  | string
  | MessageFunction
  | LocaleMessageDictionary
  | LocaleMessage[]
export type LocaleMessages = Record<Locale, LocaleMessage>

export type RuntimeMissingType = 'translate' | 'datetime' | 'number'
export type RuntimeMissingHandler<T = string> = (
  context: RuntimeContext<T>,
  locale: Locale,
  key: Path,
  type: RuntimeMissingType,
  ...values: unknown[]
) => string | void
export type PostTranslationHandler<T = string> = (
  translated: MessageType<T>
) => MessageType<T>

export type MessageCompiler<T = string> = (
  source: string,
  options?: CompileOptions
) => MessageFunction<T>

export interface RuntimeOptions<T = string> {
  locale?: Locale
  fallbackLocale?: FallbackLocale
  messages?: LocaleMessages
  datetimeFormats?: DateTimeFormats
  numberFormats?: NumberFormats
  modifiers?: LinkedModifiers<T>
  pluralRules?: PluralizationRules
  missing?: RuntimeMissingHandler<T>
  missingWarn?: boolean | RegExp
  fallbackWarn?: boolean | RegExp
  fallbackFormat?: boolean
  unresolving?: boolean
  postTranslation?: PostTranslationHandler<T>
  processor?: MessageProcessor<T>
  warnHtmlMessage?: boolean
  messageCompiler?: MessageCompiler<T>
  onWarn?: (msg: string, err?: Error) => void
  _datetimeFormatters?: Map<string, Intl.DateTimeFormat>
  _numberFormatters?: Map<string, Intl.NumberFormat>
}

export interface RuntimeContext<T = string> {
  locale: Locale
  fallbackLocale: FallbackLocale
  messages: LocaleMessages
  datetimeFormats: DateTimeFormats
  numberFormats: NumberFormats
  modifiers: LinkedModifiers<T>
  pluralRules?: PluralizationRules
  missing: RuntimeMissingHandler<T> | null
  missingWarn: boolean | RegExp
  fallbackWarn: boolean | RegExp
  fallbackFormat: boolean
  unresolving: boolean
  postTranslation: PostTranslationHandler<T> | null
  processor: MessageProcessor<T> | null
  warnHtmlMessage: boolean
  messageCompiler: MessageCompiler<T>
  onWarn(msg: string, err?: Error): void
  _datetimeFormatters: Map<string, Intl.DateTimeFormat>
  _numberFormatters: Map<string, Intl.NumberFormat>
  _fallbackLocaleStack?: Locale[]
  _localeChainCache?: Map<Locale, Locale[]>
}

export const NOT_REOSLVED = -1
export const MISSING_RESOLVE_VALUE = ''

function getDefaultLinkedModifiers<T = string>(): LinkedModifiers<T> {
  return {
    upper: (val: T): MessageType<T> =>
      (isString(val) ? val.toUpperCase() : val) as MessageType<T>,
    lower: (val: T): MessageType<T> =>
      (isString(val) ? val.toLowerCase() : val) as MessageType<T>,
    // prettier-ignore
    capitalize: (val: T): MessageType<T> =>
      (isString(val)
        ? `${val.charAt(0).toLocaleUpperCase()}${val.substr(1)}`
        : val) as MessageType<T>
  }
}

export function createRuntimeContext<T = string>(
  options: RuntimeOptions<T> = {}
): RuntimeContext<T> {
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
  const modifiers = Object.assign(
    {} as LinkedModifiers,
    options.modifiers || {},
    getDefaultLinkedModifiers<T>()
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
  const _datetimeFormatters = isObject(options._datetimeFormatters)
    ? options._datetimeFormatters
    : new Map<string, Intl.DateTimeFormat>()
  const _numberFormatters = isObject(options._numberFormatters)
    ? options._numberFormatters
    : new Map<string, Intl.NumberFormat>()

  return {
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
    _datetimeFormatters,
    _numberFormatters
  }
}

export function isTrarnslateFallbackWarn(
  fallback: boolean | RegExp,
  key: Path
): boolean {
  return fallback instanceof RegExp ? fallback.test(key) : fallback
}

export function isTranslateMissingWarn(
  missing: boolean | RegExp,
  key: Path
): boolean {
  return missing instanceof RegExp ? missing.test(key) : missing
}

export function handleMissing<T = string>(
  context: RuntimeContext<T>,
  key: Path,
  locale: Locale,
  missingWarn: boolean | RegExp,
  type: RuntimeMissingType
): unknown {
  const { missing, onWarn } = context
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

export function getLocaleChain<T = string>(
  context: RuntimeContext<T>,
  fallback: FallbackLocale,
  start: Locale = ''
): Locale[] {
  if (start === '') {
    return []
  }

  if (!context._localeChainCache) {
    context._localeChainCache = new Map()
  }

  let chain = context._localeChainCache.get(start)
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
    context._localeChainCache.set(start, chain)
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

export function updateFallbackLocale(
  context: RuntimeContext,
  locale: Locale,
  fallback: FallbackLocale
): void {
  context._localeChainCache = new Map()
  getLocaleChain(context, fallback, locale)
}
