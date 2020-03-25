import { MessageFunction } from '../message/compiler'
import { LinkedModifiers, PluralizationRule } from '../context'
import { Path } from '../path'

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
  pluralRule?: PluralizationRule
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
  pluralRule?: PluralizationRule
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
  const pluralRule = options.pluralRule
  const missing = options.missing || null
  const missingWarn = options.missingWarn === undefined
    ? true
    : options.missingWarn
  const fallbackWarn = options.fallbackWarn === undefined
    ? fallbackLocales.length > 0
    : options.fallbackWarn
  const fallbackFormat = options.fallbackFormat === undefined
    ? false
    : !!options.fallbackFormat
  const unresolving = options.unresolving === undefined
    ? false
    : options.unresolving

  return {
    locale,
    fallbackLocales,
    messages,
    modifiers,
    pluralRule,
    missing,
    compileCache,
    missingWarn,
    fallbackWarn,
    fallbackFormat,
    unresolving
  }
}
