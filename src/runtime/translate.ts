import { Path, resolveValue } from '../path'
import { compile, MessageFunction } from '../message/compiler'
import {
  createMessageContext,
  NamedValue,
  MessageContextOptions
} from '../message/context'
import { Locale, RuntimeContext, fallback } from './context'
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
export function translate(context: RuntimeContext, key: Path): string | number
export function translate(
  context: RuntimeContext,
  key: Path,
  plural: number
): string | number
export function translate(
  context: RuntimeContext,
  key: Path,
  plural: number,
  options: TranslateOptions
): string | number
export function translate(
  context: RuntimeContext,
  key: Path,
  defaultMsg: string
): string | number
export function translate(
  context: RuntimeContext,
  key: Path,
  defaultMsg: string,
  options: TranslateOptions
): string | number
export function translate(
  context: RuntimeContext,
  key: Path,
  list: unknown[]
): string | number
export function translate(
  context: RuntimeContext,
  key: Path,
  list: unknown[],
  plural: number
): string | number
export function translate(
  context: RuntimeContext,
  key: Path,
  list: unknown[],
  defaultMsg: string
): string | number
export function translate(
  context: RuntimeContext,
  key: Path,
  list: unknown[],
  options: TranslateOptions
): string | number
export function translate(
  context: RuntimeContext,
  key: Path,
  named: NamedValue
): string | number
export function translate(
  context: RuntimeContext,
  key: Path,
  named: NamedValue,
  plural: number
): string | number
export function translate(
  context: RuntimeContext,
  key: Path,
  named: NamedValue,
  defaultMsg: string
): string | number
export function translate(
  context: RuntimeContext,
  key: Path,
  named: NamedValue,
  options: TranslateOptions
): string | number
export function translate(
  context: RuntimeContext,
  ...args: unknown[]
): string | number // for internal

// implementationo of `translate` function
export function translate(
  context: RuntimeContext,
  ...args: unknown[]
): string | number {
  const {
    messages,
    modifiers,
    pluralRules,
    fallbackFormat,
    postTranslation,
    _compileCache,
    _fallbackLocaleStack
  } = context
  const [key, options] = parseTranslateArgs(...args)

  const missingWarn = isBoolean(options.missingWarn)
    ? options.missingWarn
    : context.missingWarn

  const fallbackWarn = isBoolean(options.fallbackWarn)
    ? options.fallbackWarn
    : context.fallbackWarn

  let locale = isString(options.locale) ? options.locale : context.locale
  // override with fallback locales
  if (isArray(_fallbackLocaleStack) && _fallbackLocaleStack.length > 0) {
    locale = _fallbackLocaleStack.shift() || locale
  }

  // prettier-ignore
  const defaultMsgOrKey: string =
    isString(options.default) || isBoolean(options.default)
      ? !isBoolean(options.default)
        ? options.default
        : key
      : fallbackFormat
        ? key
        : ''
  const enableDefaultMsg = fallbackFormat || defaultMsgOrKey !== ''
  // console.log('defaultMsgOrKey', defaultMsgOrKey, enableDefaultMsg)

  const message = messages[locale] || {}

  // TODO: need to design resolve message function?
  const resolveMessage = (key: string): MessageFunction => {
    const fn = _compileCache.get(key)
    if (fn) {
      return fn
    }
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
  if (!isString(format)) {
    // missing ...
    let ret: string | number = handleMissing(context, key, locale, missingWarn)
    // falbacking ...
    ret = fallback(
      context,
      key,
      fallbackWarn,
      'translate',
      (context: RuntimeContext): string | number => translate(context, ...args),
      enableDefaultMsg,
      ret
    )
    // check enable default message
    if (enableDefaultMsg) {
      format = defaultMsgOrKey
    } else {
      return ret
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

function isTranslateMissingWarn(missing: boolean | RegExp, key: Path): boolean {
  return missing instanceof RegExp ? missing.test(key) : missing
}

function handleMissing(
  context: RuntimeContext,
  key: Path,
  locale: Locale,
  missingWarn: boolean | RegExp
): string {
  const { missing } = context
  if (missing !== null) {
    const ret = missing(context, locale, key)
    return isString(ret) ? ret : key
  } else {
    if (__DEV__ && isTranslateMissingWarn(missingWarn, key)) {
      warn(`Not found '${key}' key in '${locale}' locale messages.`)
    }
    return key
  }
}
