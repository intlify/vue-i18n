import { Path, resolveValue, PathValue } from '../path'
import { compile, MessageFunction } from '../message/compiler'
import {
  createMessageContext,
  NamedValue,
  MessageContextOptions
} from '../message/context'
import {
  Locale,
  RuntimeContext,
  isTrarnslateFallbackWarn,
  handleMissing,
  LocaleMessage,
  getLocaleChain,
  NOT_REOSLVED
} from './context'
import {
  isString,
  isNumber,
  isFunction,
  warn,
  isBoolean,
  isArray,
  isPlainObject,
  isEmptyObject
} from '../utils'

const NOOP_MESSAGE_FUNCTION = () => ''
const isMessageFunction = (val: unknown): val is MessageFunction =>
  isFunction(val)
const generateCacheKey = (locale: Locale, key: string): string =>
  `${locale}__${key}`

/**
 *  # translate
 *
 *  ## usages:
 *    // for example, locale messages key
 *    { 'foo.bar': 'hi {0} !' or 'hi {name} !' }
 *
 *    // no argument, context & path only
 *    translate(context, 'foo.bar')
 *
 *    // list argument
 *    translate(context, 'foo.bar', ['kazupon'])
 *
 *    // named argument
 *    translate(context, 'foo.bar', { name: 'kazupon' })
 *
 *    // plural choice number
 *    translate(context, 'foo.bar', 2)
 *
 *    // plural choice number with name argument
 *    translate(context, 'foo.bar', { name: 'kazupon' }, 2)
 *
 *    // default message argument
 *    translate(context, 'foo.bar', 'this is default message')
 *
 *    // default message with named argument
 *    translate(context, 'foo.bar', { name: 'kazupon' }, 'Hello {name} !')
 *
 *    // use key as default message
 *    translate(context, 'hi {0} !', ['kazupon'], { default: true })
 *
 *    // locale option, override context.locale
 *    translate(context, 'foo.bar', { name: 'kazupon' }, { locale: 'ja' })
 *
 *    // suppress localize miss warning option, override context.missingWarn
 *    translate(context, 'foo.bar', { name: 'kazupon' }, { missingWarn: false })
 *
 *    // suppress localize fallback warning option, override context.fallbackWarn
 *    translate(context, 'foo.bar', { name: 'kazupon' }, { fallbackWarn: false })
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

// `translate` function overloads
export function translate(context: RuntimeContext, key: Path): unknown
export function translate(
  context: RuntimeContext,
  key: Path,
  plural: number
): unknown
export function translate(
  context: RuntimeContext,
  key: Path,
  plural: number,
  options: TranslateOptions
): unknown
export function translate(
  context: RuntimeContext,
  key: Path,
  defaultMsg: string
): unknown
export function translate(
  context: RuntimeContext,
  key: Path,
  defaultMsg: string,
  options: TranslateOptions
): unknown
export function translate(
  context: RuntimeContext,
  key: Path,
  list: unknown[]
): unknown
export function translate(
  context: RuntimeContext,
  key: Path,
  list: unknown[],
  plural: number
): unknown
export function translate(
  context: RuntimeContext,
  key: Path,
  list: unknown[],
  defaultMsg: string
): unknown
export function translate(
  context: RuntimeContext,
  key: Path,
  list: unknown[],
  options: TranslateOptions
): unknown
export function translate(
  context: RuntimeContext,
  key: Path,
  named: NamedValue
): unknown
export function translate(
  context: RuntimeContext,
  key: Path,
  named: NamedValue,
  plural: number
): unknown
export function translate(
  context: RuntimeContext,
  key: Path,
  named: NamedValue,
  defaultMsg: string
): unknown
export function translate(
  context: RuntimeContext,
  key: Path,
  named: NamedValue,
  options: TranslateOptions
): unknown
export function translate(context: RuntimeContext, ...args: unknown[]): unknown // for internal

// implementationo of `translate` function
export function translate(
  context: RuntimeContext,
  ...args: unknown[]
): unknown {
  const {
    messages,
    fallbackFormat,
    postTranslation,
    unresolving,
    fallbackLocale,
    _compileCache
  } = context
  const [key, options] = parseTranslateArgs(...args)

  const missingWarn = isBoolean(options.missingWarn)
    ? options.missingWarn
    : context.missingWarn

  const fallbackWarn = isBoolean(options.fallbackWarn)
    ? options.fallbackWarn
    : context.fallbackWarn

  // prettier-ignore
  const defaultMsgOrKey: string =
    isString(options.default) || isBoolean(options.default) // default by function option
      ? !isBoolean(options.default)
        ? options.default
        : key
      : fallbackFormat // default by `fallbackFormat` option
        ? key
        : ''
  const enableDefaultMsg = fallbackFormat || defaultMsgOrKey !== ''

  const locale = isString(options.locale) ? options.locale : context.locale
  const locales = getLocaleChain(context, fallbackLocale, locale)

  // resolve message format
  let message: LocaleMessage = {}
  let targetLocale: Locale | undefined
  let format: PathValue = null
  for (let i = 0; i < locales.length; i++) {
    targetLocale = locales[i]
    if (
      __DEV__ &&
      locale !== targetLocale &&
      isTrarnslateFallbackWarn(fallbackWarn, key)
    ) {
      warn(`Fall back to translate '${key}' key with '${targetLocale}' locale.`)
    }
    message = messages[targetLocale] || {}
    if ((format = resolveValue(message, key)) === null) {
      // if null, resolve with object key path
      format = (message as any)[key] // eslint-disable-line @typescript-eslint/no-explicit-any
    }
    if (isString(format) || isFunction(format)) break
    handleMissing(context, key, targetLocale, missingWarn, 'translate')
  }

  let cacheBaseKey = key

  // if you use default message, set it as message format!
  if (!(isString(format) || isMessageFunction(format))) {
    if (enableDefaultMsg) {
      format = defaultMsgOrKey
      cacheBaseKey = format
    }
  }

  // checking message format and target locale
  if (
    !(isString(format) || isMessageFunction(format)) ||
    !isString(targetLocale)
  ) {
    return unresolving ? NOT_REOSLVED : key
  }

  // compile message format
  const cacheKey = generateCacheKey(targetLocale, cacheBaseKey)
  let msg = _compileCache.get(cacheKey)
  if (!msg) {
    msg = isString(format) ? compile(format) : format
    _compileCache.set(cacheKey, msg)
  }

  // evaluate message with context
  const ctxOptions = getMessageContextOptions(
    context,
    targetLocale,
    message,
    options
  )
  const msgContext = createMessageContext(ctxOptions)
  const messaged = msg(msgContext)

  // if use post translation option, procee it with handler
  return postTranslation ? postTranslation(messaged) : messaged
}

export function parseTranslateArgs(
  ...args: unknown[]
): [Path, TranslateOptions] {
  const [arg1, arg2, arg3] = args
  const options = {} as TranslateOptions

  if (!isString(arg1)) {
    throw new Error('TODO')
  }
  const key = arg1

  if (isNumber(arg2)) {
    options.plural = arg2
  } else if (isString(arg2)) {
    options.default = arg2
  } else if (isPlainObject(arg2) && !isEmptyObject(arg2)) {
    options.named = arg2 as NamedValue
  } else if (isArray(arg2)) {
    options.list = arg2
  }

  if (isNumber(arg3)) {
    options.plural = arg3
  } else if (isString(arg3)) {
    options.default = arg3
  } else if (isPlainObject(arg3)) {
    Object.assign(options, arg3)
  }

  return [key, options]
}

function getMessageContextOptions(
  context: RuntimeContext,
  locale: Locale,
  message: LocaleMessage,
  options: TranslateOptions
): MessageContextOptions {
  const { modifiers, pluralRules, _compileCache } = context

  const resolveMessage = (key: string): MessageFunction => {
    const cacheKey = generateCacheKey(locale, key)
    const fn = _compileCache.get(cacheKey)
    if (fn) {
      return fn
    }
    const val = resolveValue(message, key)
    if (isString(val)) {
      const msg = compile(val)
      _compileCache.set(cacheKey, msg)
      return msg
    } else if (isMessageFunction(val)) {
      _compileCache.set(cacheKey, val)
      return val
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

  if (context.processor) {
    ctxOptions.processor = context.processor
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

  return ctxOptions
}
