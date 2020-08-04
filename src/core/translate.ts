import { Path, resolveValue, PathValue } from '../path'
import { CompileOptions } from '../message/options'
import { CompileError } from '../message/errors'
import {
  createMessageContext,
  NamedValue,
  MessageFunction,
  MessageFunctionInternal,
  MessageContextOptions,
  MessageType
} from '../message/runtime'
import {
  Locale,
  RuntimeTranslationContext,
  isTrarnslateFallbackWarn,
  handleMissing,
  LocaleMessageValue,
  getLocaleChain,
  NOT_REOSLVED,
  LocaleMessages
} from './context'
import { CoreWarnCodes, getWarnMessage } from './warnings'
import { CoreErrorCodes, createCoreError } from './errors'
import {
  isString,
  isNumber,
  isFunction,
  isBoolean,
  isArray,
  isPlainObject,
  isEmptyObject,
  generateFormatCacheKey,
  generateCodeFrame
} from '../utils'

const NOOP_MESSAGE_FUNCTION = () => ''
const isMessageFunction = <T>(val: unknown): val is MessageFunction<T> =>
  isFunction(val)

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
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: Path
): MessageType<Message> | number
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: Path,
  plural: number
): MessageType<Message> | number
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: Path,
  plural: number,
  options: TranslateOptions
): MessageType<Message> | number
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: Path,
  defaultMsg: string
): MessageType<Message> | number
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: Path,
  defaultMsg: string,
  options: TranslateOptions
): MessageType<Message> | number
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: Path,
  list: unknown[]
): MessageType<Message> | number
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: Path,
  list: unknown[],
  plural: number
): MessageType<Message> | number
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: Path,
  list: unknown[],
  defaultMsg: string
): MessageType<Message> | number
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: Path,
  list: unknown[],
  options: TranslateOptions
): MessageType<Message> | number
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: Path,
  named: NamedValue
): MessageType<Message> | number
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: Path,
  named: NamedValue,
  plural: number
): MessageType<Message> | number
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: Path,
  named: NamedValue,
  defaultMsg: string
): MessageType<Message> | number
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: Path,
  named: NamedValue,
  options: TranslateOptions
): MessageType<Message> | number
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  ...args: unknown[]
): MessageType<Message> | number // for internal

// implementationo of `translate` function
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  ...args: unknown[]
): MessageType<Message> | number {
  const {
    messages,
    fallbackFormat,
    postTranslation,
    unresolving,
    fallbackLocale,
    warnHtmlMessage,
    messageCompiler,
    onWarn
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
  const locales = getLocaleChain<Message>(context, fallbackLocale, locale)

  // resolve message format
  let message: LocaleMessageValue<Message> = {}
  let targetLocale: Locale | undefined
  let format: PathValue = null
  for (let i = 0; i < locales.length; i++) {
    targetLocale = locales[i]
    if (
      __DEV__ &&
      locale !== targetLocale &&
      isTrarnslateFallbackWarn(fallbackWarn, key)
    ) {
      onWarn(
        getWarnMessage(CoreWarnCodes.FALLBACK_TO_TRANSLATE, {
          key,
          target: targetLocale
        })
      )
    }
    message =
      ((messages as unknown) as LocaleMessages<Message>)[targetLocale] || {}
    if ((format = resolveValue(message, key)) === null) {
      // if null, resolve with object key path
      format = (message as any)[key] // eslint-disable-line @typescript-eslint/no-explicit-any
    }
    if (isString(format) || isFunction(format)) break
    handleMissing<Message>(context, key, targetLocale, missingWarn, 'translate')
  }

  let cacheBaseKey = key

  // if you use default message, set it as message format!
  if (!(isString(format) || isMessageFunction<Message>(format))) {
    if (enableDefaultMsg) {
      format = defaultMsgOrKey
      cacheBaseKey = format
    }
  }

  // checking message format and target locale
  if (
    !(isString(format) || isMessageFunction<Message>(format)) ||
    !isString(targetLocale)
  ) {
    return unresolving ? NOT_REOSLVED : (key as MessageType<Message>)
  }

  // setup compile error detecting
  let occured = false
  const errorDetector = () => {
    occured = true
  }

  // compile message format
  let msg
  if (!isMessageFunction<Message>(format)) {
    msg = messageCompiler(
      format,
      getCompileOptions(
        targetLocale,
        cacheBaseKey,
        format,
        warnHtmlMessage,
        errorDetector
      )
    ) as MessageFunctionInternal
    msg.locale = targetLocale
    msg.key = key
    msg.source = format
  } else {
    msg = format as MessageFunctionInternal
    msg.locale = msg.locale || targetLocale
    msg.key = msg.key || key
  }

  // if occured compile error, return the message format
  if (occured) {
    return format as MessageType<Message>
  }

  // evaluate message with context
  const ctxOptions = getMessageContextOptions<Messages, Message>(
    context,
    targetLocale,
    message,
    options
  )
  const msgContext = createMessageContext<Message>(ctxOptions)
  const messaged = (msg as MessageFunction<Message>)(msgContext)

  // if use post translation option, procee it with handler
  return postTranslation ? postTranslation(messaged) : messaged
}

export function parseTranslateArgs(
  ...args: unknown[]
): [Path, TranslateOptions] {
  const [arg1, arg2, arg3] = args
  const options = {} as TranslateOptions

  if (!isString(arg1)) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT)
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

function getCompileOptions(
  locale: Locale,
  key: string,
  source: string,
  warnHtmlMessage: boolean,
  errorDetector?: (err: CompileError) => void
): CompileOptions {
  return {
    warnHtmlMessage,
    onError: (err: CompileError): void => {
      errorDetector && errorDetector(err)
      if (__DEV__) {
        const message = `Message compilation error: ${err.message}`
        const codeFrame =
          err.location &&
          generateCodeFrame(
            source,
            err.location.start.offset,
            err.location.end.offset
          )
        console.error(codeFrame ? `${message}\n${codeFrame}` : message)
      } else {
        throw err
      }
    },
    onCacheKey: (source: string): string =>
      generateFormatCacheKey(locale, key, source)
  } as CompileOptions
}

function getMessageContextOptions<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  locale: Locale,
  message: LocaleMessageValue<Message>,
  options: TranslateOptions
): MessageContextOptions<Message> {
  const { modifiers, pluralRules, messageCompiler } = context

  const resolveMessage = (key: string): MessageFunction<Message> => {
    const val = resolveValue(message, key)
    if (isString(val)) {
      let occured = false
      const errorDetector = () => {
        occured = true
      }
      const msg = messageCompiler(
        val,
        getCompileOptions(
          locale,
          key,
          val,
          context.warnHtmlMessage,
          errorDetector
        )
      )
      return !occured
        ? msg
        : (NOOP_MESSAGE_FUNCTION as MessageFunction<Message>)
    } else if (isMessageFunction<Message>(val)) {
      return val
    } else {
      // TODO: should be implemented warning message
      return NOOP_MESSAGE_FUNCTION as MessageFunction<Message>
    }
  }

  const ctxOptions: MessageContextOptions<Message> = {
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
