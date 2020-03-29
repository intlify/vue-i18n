import { MessageFunction } from '../message/compiler'
import { LinkedModifiers, PluralizationRules } from '../message/context'
import { Path } from '../path'
import { isString, isArray, isBoolean, isRegExp, isFunction, isPlainObject } from '../utils'
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
  context: RuntimeContext, locale: Locale, key: Path, ...values: unknown[]
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
  compileCache?: Record<string, MessageFunction>
  missingWarn?: boolean | RegExp
  fallbackWarn?: boolean | RegExp
  fallbackFormat?: boolean
  unresolving?: boolean
  postTranslation?: PostTranslationHandler
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
  compileCache: Record<string, MessageFunction>
  missingWarn: boolean | RegExp
  fallbackWarn: boolean | RegExp
  fallbackFormat: boolean
  unresolving: boolean
  postTranslation: PostTranslationHandler | null
  _fallbackLocaleStack?: Locale[]
}

const DEFAULT_LINKDED_MODIFIERS: LinkedModifiers = {
  upper: (str: string): string => str.toUpperCase(),
  lower: (str: string): string => str.toLowerCase(),
  capitalize: (str: string): string => `${str.charAt(0).toLocaleUpperCase()}${str.substr(1)}`
}

export function createRuntimeContext (options: RuntimeOptions = {}): RuntimeContext {
  const locale = isString(options.locale) ? options.locale : 'en-US'
  const fallbackLocales = isArray(options.fallbackLocales) ? options.fallbackLocales : []
  const messages = isPlainObject(options.messages) ? options.messages : { [locale]: {} }
  const datetimeFormats = isPlainObject(options.datetimeFormats) ? options.datetimeFormats : { [locale]: {} }
  const numberFormats = isPlainObject(options.numberFormats) ? options.numberFormats : { [locale]: {} }
  const compileCache = isPlainObject(options.compileCache) ? options.compileCache : Object.create(null)
  const modifiers = Object.assign({} as LinkedModifiers, options.modifiers || {}, DEFAULT_LINKDED_MODIFIERS)
  const pluralRules = options.pluralRules || {}
  const missing = isFunction(options.missing) ? options.missing : null
  const missingWarn = isBoolean(options.missingWarn) || isRegExp(options.missingWarn)
    ? options.missingWarn
    : true
  const fallbackWarn = isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn)
    ? options.fallbackWarn
    : true
  const fallbackFormat = isBoolean(options.fallbackFormat) ? options.fallbackFormat : false
  const unresolving = isBoolean(options.unresolving) ? options.unresolving : false
  const postTranslation = isFunction(options.postTranslation) ? options.postTranslation : null

  return {
    locale,
    fallbackLocales,
    messages,
    datetimeFormats,
    numberFormats,
    modifiers,
    pluralRules,
    missing,
    compileCache,
    missingWarn,
    fallbackWarn,
    fallbackFormat,
    unresolving,
    postTranslation
  }
}
