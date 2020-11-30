import { Path, resolveValue, PathValue } from '../path'
import { CompileOptions } from '../message/options'
import { CompileError } from '../message/errors'
import {
  createMessageContext,
  NamedValue,
  MessageFunction,
  MessageFunctionInternal,
  MessageContextOptions,
  MessageType,
  MessageContext
} from '../message/runtime'
import {
  Locale,
  RuntimeTranslationContext,
  RuntimeInternalContext,
  isTranslateFallbackWarn,
  handleMissing,
  LocaleMessageValue,
  getLocaleChain,
  NOT_REOSLVED,
  LocaleMessages,
  FallbackLocale
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
  generateCodeFrame,
  escapeHtml,
  inBrowser,
  mark,
  measure,
  isObject
} from '../utils'
import { DevToolsTimelineEvents } from '../debugger/constants'

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
 *
 *    // escape parameter option, override context.escapeParameter
 *    translate(context, 'foo.bar', { name: 'kazupon' }, { escapeParameter: true })
 */

/**
 * Translate Options
 *
 * @remarks
 * Options for Translation API
 *
 * @VueI18nGeneral
 */
export interface TranslateOptions {
  /**
   * @remarks
   * List interpolation
   */
  list?: unknown[]
  /**
   * @remarks
   * Named interpolation
   */
  named?: NamedValue
  /**
   * @remarks
   * Plulralzation choice number
   */
  plural?: number
  /**
   * @remarks
   * Default message when is occured translation missing
   */
  default?: string | boolean
  /**
   * @remarks
   * The locale of localization
   */
  locale?: Locale
  /**
   * @remarks
   * Whether suppress warnings outputted when localization fails
   */
  missingWarn?: boolean
  /**
   * @remarks
   * Whether do template interpolation on translation keys when your language lacks a translation for a key
   */
  fallbackWarn?: boolean
  /**
   * @remarks
   * Whether do escape parameter for list or named interpolation values
   */
  escapeParameter?: boolean
}

// `translate` function overloads
/** @internal */
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: Path
): MessageType<Message> | number
/** @internal */
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: Path,
  plural: number
): MessageType<Message> | number
/** @internal */
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: Path,
  plural: number,
  options: TranslateOptions
): MessageType<Message> | number
/** @internal */
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: Path,
  defaultMsg: string
): MessageType<Message> | number
/** @internal */
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: Path,
  defaultMsg: string,
  options: TranslateOptions
): MessageType<Message> | number
/** @internal */
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: Path,
  list: unknown[]
): MessageType<Message> | number
/** @internal */
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: Path,
  list: unknown[],
  plural: number
): MessageType<Message> | number
/** @internal */
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: Path,
  list: unknown[],
  defaultMsg: string
): MessageType<Message> | number
/** @internal */
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: Path,
  list: unknown[],
  options: TranslateOptions
): MessageType<Message> | number
/** @internal */
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: Path,
  named: NamedValue
): MessageType<Message> | number
/** @internal */
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: Path,
  named: NamedValue,
  plural: number
): MessageType<Message> | number
/** @internal */
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: Path,
  named: NamedValue,
  defaultMsg: string
): MessageType<Message> | number
/** @internal */
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: Path,
  named: NamedValue,
  options: TranslateOptions
): MessageType<Message> | number
/** @internal */
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  ...args: unknown[]
): MessageType<Message> | number // for internal

// implementationo of `translate` function
/** @internal */
export function translate<Messages, Message = string>(
  context: RuntimeTranslationContext<Messages, Message>,
  ...args: unknown[]
): MessageType<Message> | number {
  const {
    fallbackFormat,
    postTranslation,
    unresolving,
    fallbackLocale
  } = context
  const [key, options] = parseTranslateArgs(...args)

  const missingWarn = isBoolean(options.missingWarn)
    ? options.missingWarn
    : context.missingWarn

  const fallbackWarn = isBoolean(options.fallbackWarn)
    ? options.fallbackWarn
    : context.fallbackWarn

  const escapeParameter = isBoolean(options.escapeParameter)
    ? options.escapeParameter
    : context.escapeParameter

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

  // escape params
  escapeParameter && escapeParams(options)

  // resolve message format
  // eslint-disable-next-line prefer-const
  let [format, targetLocale, message] = resolveMessageFormat(
    context,
    key,
    locale,
    fallbackLocale,
    fallbackWarn,
    missingWarn
  )

  // if you use default message, set it as message format!
  let cacheBaseKey = key
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
  const msg = compileMessasgeFormat(
    context,
    key,
    targetLocale,
    format,
    cacheBaseKey,
    errorDetector
  )

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
  const messaged = evaluateMessage<Messages, Message>(
    context,
    msg as MessageFunction<Message>,
    msgContext
  )

  // if use post translation option, procee it with handler
  return postTranslation ? postTranslation(messaged) : messaged
}

function escapeParams(options: TranslateOptions) {
  if (isArray(options.list)) {
    options.list = options.list.map(item =>
      isString(item) ? escapeHtml(item) : item
    )
  } else if (isObject(options.named)) {
    Object.keys(options.named).forEach(key => {
      if (isString(options.named![key])) {
        options.named![key] = escapeHtml(options.named![key] as string)
      }
    })
  }
}

function resolveMessageFormat<Messages, Message>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: string,
  locale: Locale,
  fallbackLocale: FallbackLocale,
  fallbackWarn: boolean | RegExp,
  missingWarn: boolean | RegExp
): [PathValue, Locale | undefined, LocaleMessageValue<Message>] {
  const { messages, onWarn } = context
  const locales = getLocaleChain<Message>(context, fallbackLocale, locale)

  let message: LocaleMessageValue<Message> = {}
  let targetLocale: Locale | undefined
  let format: PathValue = null
  let from: Locale = locale
  let to: Locale | null = null
  const type = 'translate'

  for (let i = 0; i < locales.length; i++) {
    targetLocale = to = locales[i]

    if (
      __DEV__ &&
      locale !== targetLocale &&
      isTranslateFallbackWarn(fallbackWarn, key)
    ) {
      onWarn(
        getWarnMessage(CoreWarnCodes.FALLBACK_TO_TRANSLATE, {
          key,
          target: targetLocale
        })
      )
    }

    // for vue-devtools timeline event
    if (__DEV__ && locale !== targetLocale) {
      const emitter = ((context as unknown) as RuntimeInternalContext).__emitter
      if (emitter) {
        emitter.emit(DevToolsTimelineEvents.FALBACK, {
          type,
          key,
          from,
          to
        })
      }
    }

    message =
      ((messages as unknown) as LocaleMessages<Message>)[targetLocale] || {}

    // for vue-devtools timeline event
    let start: number | null = null
    let startTag: string | undefined
    let endTag: string | undefined
    if (__DEV__ && inBrowser) {
      start = window.performance.now()
      startTag = 'intlify-message-resolve-start'
      endTag = 'intlify-message-resolve-end'
      mark && mark(startTag)
    }

    if ((format = resolveValue(message, key)) === null) {
      // if null, resolve with object key path
      format = (message as any)[key] // eslint-disable-line @typescript-eslint/no-explicit-any
    }

    // for vue-devtools timeline event
    if (__DEV__ && inBrowser) {
      const end = window.performance.now()
      const emitter = ((context as unknown) as RuntimeInternalContext).__emitter
      if (emitter && start && format) {
        emitter.emit(DevToolsTimelineEvents.MESSAGE_RESOLVE, {
          type: DevToolsTimelineEvents.MESSAGE_RESOLVE,
          key,
          message: format,
          time: end - start
        })
      }
      if (startTag && endTag && mark && measure) {
        mark(endTag)
        measure('intlify message resolve', startTag, endTag)
      }
    }

    if (isString(format) || isFunction(format)) break
    const missingRet = handleMissing<Message>(
      context,
      key,
      targetLocale,
      missingWarn,
      type
    )
    if (missingRet !== key) {
      format = missingRet as PathValue
    }
    from = to
  }

  return [format, targetLocale, message]
}

function compileMessasgeFormat<Messages, Message>(
  context: RuntimeTranslationContext<Messages, Message>,
  key: string,
  targetLocale: string,
  format: PathValue,
  cacheBaseKey: string,
  errorDetector: () => void
): MessageFunctionInternal {
  const { messageCompiler, warnHtmlMessage } = context

  if (isMessageFunction<Message>(format)) {
    const msg = format as MessageFunctionInternal
    msg.locale = msg.locale || targetLocale
    msg.key = msg.key || key
    return msg
  }

  // for vue-devtools timeline event
  let start: number | null = null
  let startTag: string | undefined
  let endTag: string | undefined
  if (__DEV__ && inBrowser) {
    start = window.performance.now()
    startTag = 'intlify-message-compilation-start'
    endTag = 'intlify-message-compilation-end'
    mark && mark(startTag)
  }

  const msg = messageCompiler(
    format as string,
    getCompileOptions(
      context,
      targetLocale,
      cacheBaseKey,
      format as string,
      warnHtmlMessage,
      errorDetector
    )
  ) as MessageFunctionInternal

  // for vue-devtools timeline event
  if (__DEV__ && inBrowser) {
    const end = window.performance.now()
    const emitter = ((context as unknown) as RuntimeInternalContext).__emitter
    if (emitter && start) {
      emitter.emit(DevToolsTimelineEvents.MESSAGE_COMPILATION, {
        type: DevToolsTimelineEvents.MESSAGE_COMPILATION,
        message: format,
        time: end - start
      })
    }
    if (startTag && endTag && mark && measure) {
      mark(endTag)
      measure('intlify message compilation', startTag, endTag)
    }
  }

  msg.locale = targetLocale
  msg.key = key
  msg.source = format as string

  return msg
}

function evaluateMessage<Messages, Message>(
  context: RuntimeTranslationContext<Messages, Message>,
  msg: MessageFunction<Message>,
  msgCtx: MessageContext<Message>
): MessageType<Message> {
  // for vue-devtools timeline event
  let start: number | null = null
  let startTag: string | undefined
  let endTag: string | undefined
  if (__DEV__ && inBrowser) {
    start = window.performance.now()
    startTag = 'intlify-message-evaluation-start'
    endTag = 'intlify-message-evaluation-end'
    mark && mark(startTag)
  }

  const messaged = msg(msgCtx)

  // for vue-devtools timeline event
  if (__DEV__ && inBrowser) {
    const end = window.performance.now()
    const emitter = ((context as unknown) as RuntimeInternalContext).__emitter
    if (emitter && start) {
      emitter.emit(DevToolsTimelineEvents.MESSAGE_EVALUATION, {
        type: DevToolsTimelineEvents.MESSAGE_EVALUATION,
        value: messaged,
        time: end - start
      })
    }
    if (startTag && endTag && mark && measure) {
      mark(endTag)
      measure('intlify message evaluation', startTag, endTag)
    }
  }

  return messaged
}

/** @internal */
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

function getCompileOptions<Messages, Message>(
  context: RuntimeTranslationContext<Messages, Message>,
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
        const emitter = ((context as unknown) as RuntimeInternalContext)
          .__emitter
        if (emitter) {
          emitter.emit(DevToolsTimelineEvents.COMPILE_ERROR, {
            message: source,
            error: err.message,
            start: err.location && err.location.start.offset,
            end: err.location && err.location.end.offset
          })
        }
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
  const { modifiers, pluralRules } = context

  const resolveMessage = (key: string): MessageFunction<Message> => {
    const val = resolveValue(message, key)
    if (isString(val)) {
      let occured = false
      const errorDetector = () => {
        occured = true
      }
      const msg = (compileMessasgeFormat<Messages, Message>(
        context,
        key,
        locale,
        val,
        key,
        errorDetector
      ) as unknown) as MessageFunction<Message>
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
