import { compile, MessageFunction } from '../message/compiler'
import { createMessageContext, NamedValue, MessageContextOptions } from '../message/context'
import { Path, resolveValue } from '../path'
import { isObject, isString, isNumber, isFunction, warn, isBoolean, isArray } from '../utils'
import { Locale, RuntimeContext, NOT_REOSLVED } from './context'

const NOOP_MESSAGE_FUNCTION = () => ''

function isTranslateMissingWarn (missing: boolean | RegExp, key: Path): boolean {
  return missing instanceof RegExp ? missing.test(key) : missing
}

function isTrarnslateFallbackWarn (fallback: boolean | RegExp, key: Path, stack?: Locale[]): boolean {
  if (stack !== undefined && stack.length === 0) {
    return false
  } else {
    return fallback instanceof RegExp ? fallback.test(key) : fallback
  }
}

/*
 * translate
 *
 * usages:
 *    'foo.bar' path -> 'hi {0} !' or 'hi {name} !'
 *
 *    // no argument, context & path only
 *    translate(context, 'foo.bar')
 *
 *    // list argument
 *    translate(context, 'foo.bar', { list: ['kazupon'] })
 *
 *    // named argument
 *    translate(context, 'foo.bar', { named: { name: 'kazupon' } })
 *
 *    // plural choice number
 *    translate(context, 'foo.bar', { plural: 2 })
 *
 *    // plural choice number with name argument
 *    translate(context, 'foo.bar', { named: { name: 'kazupon' }, plural: 2 })
 *
 *    // default message argument
 *    translate(context, 'foo.bar', { default: 'this is default message' })
 *
 *    // default message with named argument
 *    translate(context, 'foo.bar', { named: { name: 'kazupon' }, default: 'Hello {name} !' })
 *
 *    // use key as default message
 *    translate(context, 'hi {0} !', { list: ['kazupon'], default: true })
 *
 *    // locale option, override context.locale
 *    translate(context, 'foo.bar', { locale: 'ja' })
 *
 *    // suppress localize miss warning option, override context.missingWarn
 *    translate(context, 'foo.bar', { missingWarn: false })
 *
 *    // suppress localize fallback warning option, override context.fallbackWarn
 *    translate(context, 'foo.bar', { fallbackWarn: false })
 */

export type TranslateOptions = {
  list?: unknown[]
  named?: NamedValue
  plural?: number
  default?: string | boolean
  locale?: Locale
  missingWarn?: boolean
  fallbackWarn?: boolean
}

export function translate (context: RuntimeContext, key: Path, ...args: unknown[]): string | number {
  const {
    messages,
    modifiers,
    pluralRules,
    missing,
    fallbackFormat,
    unresolving,
    fallbackLocales,
    postTranslation,
    _compileCache,
    _fallbackLocaleStack
  } = context
  const options: TranslateOptions = isObject(args[0]) ? args[0] : {}

  const missingWarn = isBoolean(options.missingWarn)
    ? options.missingWarn
    : context.missingWarn

  const fallbackWarn = isBoolean(options.fallbackWarn)
    ? options.fallbackWarn
    : context.fallbackWarn

  let locale = isString(options.locale)
    ? options.locale
    : context.locale
  // override with fallback locales
  if (fallbackWarn && isArray(_fallbackLocaleStack) && _fallbackLocaleStack.length > 0) {
    locale = _fallbackLocaleStack.shift() || locale
  }

  const defaultMsgOrKey: string | boolean = (isString(options.default) || isBoolean(options.default))
    ? options.default
    : fallbackFormat
      ? key
      : false
  const enableDefaultMsg = (fallbackFormat || defaultMsgOrKey !== false)

  const message = messages[locale]
  if (!isObject(message)) {
    // TODO: should be more designed default
    return key
  }

  // TODO: need to design resolve message function?
  const resolveMessage = (key: string): MessageFunction => {
    const fn = _compileCache.get(key)
    if (fn) { return fn }
    const val = resolveValue(message, key)
    if (isString(val)) {
      const msg = compile(val)
      _compileCache.set(val, msg)
      return msg
    } else if (isFunction(val)) {
      return val as MessageFunction
    } else {
      // TODO: should be implemented warning message
      return NOOP_MESSAGE_FUNCTION
    }
  }

  const ctxOptions: MessageContextOptions = {
    locale,
    modifiers,
    pluralRules,
    messages: resolveMessage
  }

  if (options.list) {
    ctxOptions.list = options.list
  }
  if (options.named) {
    ctxOptions.named = options.named
  }
  if (isNumber(options.plural)) {
    ctxOptions.pluralIndex = options.plural
  }

  let format = resolveValue(message, key)
  if (!isString(format) && enableDefaultMsg) {
    // set default message
    if (isString(defaultMsgOrKey)) {
      format = defaultMsgOrKey
    } else { // true
      format = key
    }
  }

  if (!isString(format)) {
    // missing ...
    let ret: string | number | null = null
    if (missing !== null) {
      ret = missing(context, locale, key) || key
    } else {
      if (__DEV__ && isTranslateMissingWarn(missingWarn, key)) {
        warn(`Cannot translate the value of '${key}'. Use the value of key as default.`)
      }
      ret = key
    }

    // falbacking ...
    if (__DEV__ && fallbackLocales.length > 0 && isTrarnslateFallbackWarn(fallbackWarn, key, _fallbackLocaleStack)) {
      if (!context._fallbackLocaleStack) {
        context._fallbackLocaleStack = [...context.fallbackLocales]
      }
      warn(`Fall back to translate '${key}' with '${context._fallbackLocaleStack.join(',')}' locale.`)
      ret = translate(context, key, ...args)
      if (context._fallbackLocaleStack && context._fallbackLocaleStack.length === 0) {
        context._fallbackLocaleStack = undefined
        if (unresolving) {
          ret = NOT_REOSLVED
        }
      }
      return ret
    } else {
      return !unresolving ? ret : NOT_REOSLVED
    }
  }

  let msg = _compileCache.get(format)
  if (!msg) {
    msg = compile(format)
    _compileCache.set(format, msg)
  }
  const msgContext = createMessageContext(ctxOptions)
  const ret = msg(msgContext)
  return postTranslation ? postTranslation(ret) : ret
}
