import { MessageFunction } from '../message/compiler'
import { LinkedModifiers, PluralizationRules } from '../message/context'
import { Path } from '../path'
import { isBoolean, isRegExp } from '../utils'

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

export type RuntimeOptions = {
  locale?: Locale
  fallbackLocales?: Locale[]
  messages?: LocaleMessages
  modifiers?: LinkedModifiers
  pluralRules?: PluralizationRules
  missing?: RuntimeMissingHandler
  preCompile?: false // TODO: we need this option?
  missingWarn?: boolean | RegExp
  fallbackWarn?: boolean | RegExp
  fallbackFormat?: boolean
  unresolving?: boolean
}

export type RuntimeContext = {
  locale: Locale
  fallbackLocales: Locale[]
  messages: LocaleMessages
  modifiers: LinkedModifiers
  pluralRules?: PluralizationRules
  missing: RuntimeMissingHandler | null
  compileCache: Record<string, MessageFunction>
  missingWarn: boolean | RegExp
  fallbackWarn: boolean | RegExp
  fallbackFormat: boolean
  unresolving: boolean
  _fallbackLocaleStack?: Locale[]
}

const DEFAULT_LINKDED_MODIFIERS: LinkedModifiers = {
  upper: (str: string): string => str.toUpperCase(),
  lower: (str: string): string => str.toLowerCase(),
  capitalize: (str: string): string => `${str.charAt(0).toLocaleUpperCase()}${str.substr(1)}`
}

export function createRuntimeContext (options: RuntimeOptions = {}): RuntimeContext {
  const locale = options.locale || 'en-US'
  const fallbackLocales = options.fallbackLocales || []
  const messages = options.messages || { [locale]: {} }
  const compileCache: Record<string, MessageFunction> = Object.create(null)
  const modifiers = Object.assign({} as LinkedModifiers, options.modifiers || {}, DEFAULT_LINKDED_MODIFIERS)
  const pluralRules = options.pluralRules || {}
  const missing = options.missing || null
  const missingWarn = isBoolean(options.missingWarn) || isRegExp(options.missingWarn)
    ? options.missingWarn
    : true
  const fallbackWarn = isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn)
    ? options.fallbackWarn
    : true
  const fallbackFormat = isBoolean(options.fallbackFormat) ? options.fallbackFormat : false
  const unresolving = isBoolean(options.unresolving) ? options.unresolving : false

  return {
    locale,
    fallbackLocales,
    messages,
    modifiers,
    pluralRules,
    missing,
    compileCache,
    missingWarn,
    fallbackWarn,
    fallbackFormat,
    unresolving
  }
}
