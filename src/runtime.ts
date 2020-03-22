/**
 * Runtime
 *
 * Runtime is low-level API for i18n
 * This module is offered core i18n feature of Intlify project
 */

import { compile, MessageFunction } from './message/compiler'
import { createMessageContext, LinkedModifiers, MessageContextOptions } from './context'
import { Path, resolveValue } from './path'
import { isObject, isString, isNumber, isFunction, warn, isBoolean, isArray } from './utils'

export type Locale = string
export type LocaleMessageDictionary = {
  [property: string]: LocaleMessage
}
export type LocaleMessage =
  | string
  | MessageFunction
  | LocaleMessageDictionary
  | LocaleMessage[]

export type LocaleMessages = Record<Locale, LocaleMessage>
export type TranslateResult = string
export type RuntimeMissingHandler = (
  context: RuntimeContext, locale: Locale, key: Path, ...values: unknown[]
) => string | void

// TODO: should implement more runtime !!
export type RuntimeOptions = {
  locale?: Locale
  fallbackLocales?: Locale[]
  messages?: LocaleMessages
  modifiers?: LinkedModifiers
  missing?: RuntimeMissingHandler
  preCompile?: false // TODO: we need this option?
  missingWarn?: boolean | RegExp
  fallbackWarn?: boolean | RegExp
  // ...
}

export type RuntimeContext = {
  locale: Locale
  fallbackLocales: Locale[]
  messages: LocaleMessages
  modifiers: LinkedModifiers
  missing: RuntimeMissingHandler | null
  compileCache: Record<string, MessageFunction>
  missingWarn: boolean | RegExp
  fallbackWarn: boolean | RegExp
  _fallbackLocaleStack?: Locale[]
}

const DEFAULT_LINKDED_MODIFIERS: LinkedModifiers = {
  upper: (str: string): string => str.toUpperCase(),
  lower: (str: string): string => str.toLowerCase(),
  capitalize: (str: string): string => `${str.charAt(0).toLocaleUpperCase()}${str.substr(1)}`
}

const NOOP_MESSAGE_FUNCTION = () => ''

export function createRuntimeContext (options: RuntimeOptions = {}): RuntimeContext {
  const locale = options.locale || 'en-US'
  const fallbackLocales = options.fallbackLocales || []
  const messages = options.messages || { [locale]: {} }
  const compileCache: Record<string, MessageFunction> = Object.create(null)
  const modifiers = Object.assign({} as LinkedModifiers, options.modifiers || {}, DEFAULT_LINKDED_MODIFIERS)
  const missing = options.missing || null
  const missingWarn = options.missingWarn === undefined
    ? true
    : options.missingWarn
  const fallbackWarn = options.fallbackWarn === undefined
    ? fallbackLocales.length > 0
    : options.fallbackWarn

  return {
    locale,
    fallbackLocales,
    messages,
    modifiers,
    missing,
    compileCache,
    missingWarn,
    fallbackWarn
  }
}

function isLocalizeMissingWarn (missing: boolean | RegExp, key: Path): boolean {
  return missing instanceof RegExp ? missing.test(key) : missing
}

function isLocalizeFallbackWarn (fallback: boolean | RegExp, key: Path, stack?: Locale[]): boolean {
  if (stack !== undefined && stack.length === 0) {
    return false
  } else {
    return fallback instanceof RegExp ? fallback.test(key) : fallback
  }
}

/*
 * localize
 *
 * use cases
 *    'foo.bar' path -> 'hi {0} !' or 'hi {name} !'
 *
 *    // no argument, context & path only
 *    localize(context, 'foo.bar')
 *
 *    // list argument
 *    localize(context, 'foo.bar', { list: ['kazupon'] })
 *
 *    // named argument
 *    localize(context, 'foo.bar', { named: { name: 'kazupon' } })
 *
 *    // plural choice number
 *    localize(context, 'foo.bar', { plural: 2 })
 *
 *    // plural choice number with name argument
 *    localize(context, 'foo.bar', { named: { name: 'kazupon' }, plural: 2 })
 *
 *    // default message argument
 *    localize(context, 'foo.bar', { default: 'this is default message' })
 *
 *    // default message with named argument
 *    localize(context, 'foo.bar', { named: { name: 'kazupon' }, default: 'Hello {name} !' })
 *
 *    // use key as default message
 *    localize(context, 'hi {0} !', { list: ['kazupon'], default: true })
 *
 *    // locale option, override context.locale
 *    localize(context, 'foo.bar', { locale: 'ja' })
 *
 *    // suppress localize miss warning option, override context.missingWarn
 *    localize(context, 'foo.bar', { missingWarn: false })
 *
 *    // suppress localize fallback warning option, override context.fallbackWarn
 *    localize(context, 'foo.bar', { fallbackWarn: false })
 */

export function localize (context: RuntimeContext, key: Path, ...args: unknown[]): string {
  const { messages, compileCache, modifiers, missing, _fallbackLocaleStack } = context

  let missingWarn = context.missingWarn
  if (isObject(args[0]) && isBoolean(args[0].missingWarn)) {
    missingWarn = args[0].missingWarn
  }

  let fallbackWarn = context.fallbackWarn
  if (isObject(args[0]) && isBoolean(args[0].fallbackWarn)) {
    fallbackWarn = args[0].fallbackWarn
  }

  let locale = context.locale
  if (isObject(args[0]) && isString(args[0].locale)) {
    locale = args[0].locale
  }

  // override with fallback locales
  if (fallbackWarn && isArray(_fallbackLocaleStack) && _fallbackLocaleStack.length > 0) {
    locale = _fallbackLocaleStack.shift() || locale
  }

  let defaultMsgOrKey: string | boolean = false
  if (isObject(args[0]) && (isString(args[0].default) || isBoolean(args[0].default))) {
    defaultMsgOrKey = args[0].default
  }

  const message = messages[locale]
  if (!isObject(message)) {
    // TODO: should be more designed default
    return key
  }

  // TODO: need to design resolve message function?
  const resolveMessage = (key: string): MessageFunction => {
    const fn = compileCache[key]
    if (fn) { return fn }
    const val = resolveValue(message, key)
    if (isString(val)) {
      return (compileCache[val] = compile(val))
    } else if (isFunction(val)) {
      return val as MessageFunction
    } else {
      // TODO: should be implemented warning message
      return NOOP_MESSAGE_FUNCTION
    }
  }

  const options: MessageContextOptions = {
    modifiers,
    messages: resolveMessage
  }

  if (isObject(args[0])) {
    const obj = args[0] as Record<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
    if (obj.list) {
      options.list = obj.list
    }
    if (obj.named) {
      options.named = obj.named
    }
    if (isNumber(obj.plural)) {
      options.pluralIndex = obj.plural
    }
  }

  let format = resolveValue(message, key)

  // set default message
  if (defaultMsgOrKey !== false) {
    if (isString(defaultMsgOrKey)) {
      format = defaultMsgOrKey
    } else { // true
      format = key
    }
  }

  if (!isString(format)) {
    // missing ...
    let ret: string | null = null
    if (missing !== null) {
      ret = missing(context, locale, key) || key
    } else {
      if (__DEV__ && isLocalizeMissingWarn(missingWarn, key)) {
        warn(`Cannot localize the value of '${key}'. Use the value of key as default.`)
      }
      ret = key
    }

    // falbacking ...
    if (__DEV__ && isLocalizeFallbackWarn(fallbackWarn, key, _fallbackLocaleStack)) {
      if (!context._fallbackLocaleStack) {
        context._fallbackLocaleStack = [...context.fallbackLocales]
      }
      warn(`Fall back to localize '${key}' with '${context._fallbackLocaleStack.join(',')}' locale.`)
      ret = localize(context, key, ...args)
      if (context._fallbackLocaleStack && context._fallbackLocaleStack.length === 0) {
        context._fallbackLocaleStack = undefined
      }
      return ret
    } else {
      return ret
    }
  }

  const msg = compileCache[format] || (compileCache[format] = compile(format))
  const msgContext = createMessageContext(options)
  return msg(msgContext)
}
