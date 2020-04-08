import { MessageFunction } from '../message/compiler'
import { LinkedModifiers, PluralizationRules } from '../message/context'
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

export type RuntimeMissingHandler = (
  context: RuntimeContext,
  locale: Locale,
  key: Path,
  ...values: unknown[]
) => string | void
export type PostTranslationHandler = (translated: string) => string

export type RuntimeOptions = {
  locale?: Locale
  fallbackLocales?: Locale[]
  messages?: LocaleMessages
  datetimeFormats?: DateTimeFormats
  numberFormats?: NumberFormats
  modifiers?: LinkedModifiers
  pluralRules?: PluralizationRules
  missing?: RuntimeMissingHandler
  missingWarn?: boolean | RegExp
  fallbackWarn?: boolean | RegExp
  fallbackFormat?: boolean
  unresolving?: boolean
  postTranslation?: PostTranslationHandler
  _compileCache?: Map<string, MessageFunction>
  _datetimeFormatters?: Map<string, Intl.DateTimeFormat>
  _numberFormatters?: Map<string, Intl.NumberFormat>
}

export type RuntimeContext = {
  locale: Locale
  fallbackLocales: Locale[]
  messages: LocaleMessages
  datetimeFormats: DateTimeFormats
  numberFormats: NumberFormats
  modifiers: LinkedModifiers
  pluralRules?: PluralizationRules
  missing: RuntimeMissingHandler | null
  missingWarn: boolean | RegExp
  fallbackWarn: boolean | RegExp
  fallbackFormat: boolean
  unresolving: boolean
  postTranslation: PostTranslationHandler | null
  _compileCache: Map<string, MessageFunction>
  _datetimeFormatters: Map<string, Intl.DateTimeFormat>
  _numberFormatters: Map<string, Intl.NumberFormat>
  _fallbackLocaleStack?: Locale[]
}

const DEFAULT_LINKDED_MODIFIERS: LinkedModifiers = {
  upper: (val: unknown, type: string): unknown =>
    type === 'text' ? (val as string).toUpperCase() : val,
  lower: (val: unknown, type: string): unknown =>
    type === 'text' ? (val as string).toLowerCase() : val,
  // prettier-ignore
  capitalize: (val: unknown, type: string): unknown =>
    type === 'text'
      ? `${(val as string).charAt(0).toLocaleUpperCase()}${(val as string).substr(1)}`
      : val
}

export const NOT_REOSLVED = -1
export const MISSING_RESOLVE_VALUE = ''

export function createRuntimeContext(
  options: RuntimeOptions = {}
): RuntimeContext {
  const locale = isString(options.locale) ? options.locale : 'en-US'
  const fallbackLocales = isArray(options.fallbackLocales)
    ? options.fallbackLocales
    : []
  const messages = isPlainObject(options.messages)
    ? options.messages
    : { [locale]: {} }
  const datetimeFormats = isPlainObject(options.datetimeFormats)
    ? options.datetimeFormats
    : { [locale]: {} }
  const numberFormats = isPlainObject(options.numberFormats)
    ? options.numberFormats
    : { [locale]: {} }
  const _compileCache = isObject(options._compileCache)
    ? options._compileCache
    : new Map<string, MessageFunction>()
  const modifiers = Object.assign(
    {} as LinkedModifiers,
    options.modifiers || {},
    DEFAULT_LINKDED_MODIFIERS
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
  const fallbackFormat = isBoolean(options.fallbackFormat)
    ? options.fallbackFormat
    : false
  const unresolving = isBoolean(options.unresolving)
    ? options.unresolving
    : false
  const postTranslation = isFunction(options.postTranslation)
    ? options.postTranslation
    : null
  const _datetimeFormatters = isObject(options._datetimeFormatters)
    ? options._datetimeFormatters
    : new Map<string, Intl.DateTimeFormat>()
  const _numberFormatters = isObject(options._numberFormatters)
    ? options._numberFormatters
    : new Map<string, Intl.NumberFormat>()

  return {
    locale,
    fallbackLocales,
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
    _compileCache,
    _datetimeFormatters,
    _numberFormatters
  }
}

export function isTrarnslateFallbackWarn(
  fallback: boolean | RegExp,
  key: string
): boolean {
  return fallback instanceof RegExp ? fallback.test(key) : fallback
}

export function fallback(
  context: RuntimeContext,
  key: string,
  fallbackWarn: boolean | RegExp,
  type: string,
  fn: Function,
  fallbackFormat?: boolean,
  defaultReturn?: string
): string | number {
  // prettier-ignore
  let ret: string | number = context.unresolving
    ? isBoolean(fallbackFormat) && fallbackFormat && isString(defaultReturn)
      ? defaultReturn
      : NOT_REOSLVED
    : isString(defaultReturn)
      ? defaultReturn
      : MISSING_RESOLVE_VALUE
  if (context.fallbackLocales.length === 0) {
    return ret
  }
  if (
    context._fallbackLocaleStack &&
    context._fallbackLocaleStack.length === 0
  ) {
    return ret
  }
  if (!context._fallbackLocaleStack) {
    context._fallbackLocaleStack = [...context.fallbackLocales]
  }
  if (__DEV__ && isTrarnslateFallbackWarn(fallbackWarn, key)) {
    warn(
      `Fall back to ${type} '${key}' key with '${context._fallbackLocaleStack.join(
        ','
      )}' locale.`
    )
  }
  ret = fn(context)
  if (
    context._fallbackLocaleStack &&
    context._fallbackLocaleStack.length === 0
  ) {
    context._fallbackLocaleStack = undefined
    if ((ret === MISSING_RESOLVE_VALUE || ret === key) && context.unresolving) {
      ret = NOT_REOSLVED
    }
  }
  return ret
}
