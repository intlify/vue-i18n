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
  warn,
  mark,
  measure,
  assign,
  isObject
} from '@intlify/shared'
import { createMessageContext } from './runtime'
import {
  isTranslateFallbackWarn,
  handleMissing,
  NOT_REOSLVED,
  getAdditionalMeta,
  CoreContext
} from './context'
import { CoreWarnCodes, getWarnMessage } from './warnings'
import { CoreErrorCodes, createCoreError } from './errors'
import { translateDevTools } from './devtools'
import { VueDevToolsTimelineEvents } from '@intlify/vue-devtools'

import type { CompileOptions, CompileError } from '@intlify/message-compiler'
import type { AdditionalPayloads } from '@intlify/devtools-if'
import type { Path, PathValue } from './resolver'
import type {
  Locale,
  FallbackLocale,
  NamedValue,
  MessageFunction,
  MessageFunctionInternal,
  MessageContextOptions,
  MessageType,
  MessageContext
} from './runtime'
import type {
  LocaleMessages,
  LocaleMessageValue,
  CoreInternalContext
} from './context'
import type { PickupKeys } from './types'

const NOOP_MESSAGE_FUNCTION = () => ''
export const isMessageFunction = <T>(val: unknown): val is MessageFunction<T> =>
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
export interface TranslateOptions<Locales = Locale> {
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
   * Default message when is occurred translation missing
   */
  default?: string | boolean
  /**
   * @remarks
   * The locale of localization
   */
  locale?: Locales
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
  /**
   * @remarks
   * Whether the message has been resolved
   */
  resolvedMessage?: boolean
}

/**
 * `translate` function overloads
 */

export function translate<
  Context extends CoreContext<Message, Context['messages'], {}, {}>,
  Key extends string = string,
  ResourceKeys extends PickupKeys<Context['messages']> = PickupKeys<
    Context['messages']
  >,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>
): MessageType<Message> | number

export function translate<
  Context extends CoreContext<Message, Context['messages'], {}, {}>,
  Key extends string = string,
  ResourceKeys extends PickupKeys<Context['messages']> = PickupKeys<
    Context['messages']
  >,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  plural: number
): MessageType<Message> | number

export function translate<
  Context extends CoreContext<Message, Context['messages'], {}, {}>,
  Key extends string = string,
  ResourceKeys extends PickupKeys<Context['messages']> = PickupKeys<
    Context['messages']
  >,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  plural: number,
  options: TranslateOptions<Context['locale']>
): MessageType<Message> | number

export function translate<
  Context extends CoreContext<Message, Context['messages'], {}, {}>,
  Key extends string = string,
  ResourceKeys extends PickupKeys<Context['messages']> = PickupKeys<
    Context['messages']
  >,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  defaultMsg: string
): MessageType<Message> | number

export function translate<
  Context extends CoreContext<Message, Context['messages'], {}, {}>,
  Key extends string = string,
  ResourceKeys extends PickupKeys<Context['messages']> = PickupKeys<
    Context['messages']
  >,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  defaultMsg: string,
  options: TranslateOptions<Context['locale']>
): MessageType<Message> | number

export function translate<
  Context extends CoreContext<Message, Context['messages'], {}, {}>,
  Key extends string = string,
  ResourceKeys extends PickupKeys<Context['messages']> = PickupKeys<
    Context['messages']
  >,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  list: unknown[]
): MessageType<Message> | number

export function translate<
  Context extends CoreContext<Message, Context['messages'], {}, {}>,
  Key extends string = string,
  ResourceKeys extends PickupKeys<Context['messages']> = PickupKeys<
    Context['messages']
  >,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  list: unknown[],
  plural: number
): MessageType<Message> | number

export function translate<
  Context extends CoreContext<Message, Context['messages'], {}, {}>,
  Key extends string = string,
  ResourceKeys extends PickupKeys<Context['messages']> = PickupKeys<
    Context['messages']
  >,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  list: unknown[],
  defaultMsg: string
): MessageType<Message> | number

export function translate<
  Context extends CoreContext<Message, Context['messages'], {}, {}>,
  Key extends string = string,
  ResourceKeys extends PickupKeys<Context['messages']> = PickupKeys<
    Context['messages']
  >,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  list: unknown[],
  options: TranslateOptions<Context['locale']>
): MessageType<Message> | number

export function translate<
  Context extends CoreContext<Message, Context['messages'], {}, {}>,
  Key extends string = string,
  ResourceKeys extends PickupKeys<Context['messages']> = PickupKeys<
    Context['messages']
  >,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  named: NamedValue
): MessageType<Message> | number

export function translate<
  Context extends CoreContext<Message, Context['messages'], {}, {}>,
  Key extends string = string,
  ResourceKeys extends PickupKeys<Context['messages']> = PickupKeys<
    Context['messages']
  >,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  named: NamedValue,
  plural: number
): MessageType<Message> | number

export function translate<
  Context extends CoreContext<Message, Context['messages'], {}, {}>,
  Key extends string = string,
  ResourceKeys extends PickupKeys<Context['messages']> = PickupKeys<
    Context['messages']
  >,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  named: NamedValue,
  defaultMsg: string
): MessageType<Message> | number

export function translate<
  Context extends CoreContext<Message, Context['messages'], {}, {}>,
  Key extends string = string,
  ResourceKeys extends PickupKeys<Context['messages']> = PickupKeys<
    Context['messages']
  >,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  named: NamedValue,
  options: TranslateOptions<Context['locale']>
): MessageType<Message> | number

// implementation of `translate` function
export function translate<
  Context extends CoreContext<Message, Context['messages'], {}, {}>,
  Message = string
>(context: Context, ...args: unknown[]): MessageType<Message> | number {
  const {
    fallbackFormat,
    postTranslation,
    unresolving,
    fallbackLocale,
    messages
  } = context
  const [key, options] = parseTranslateArgs<Message>(...args)

  const missingWarn = isBoolean(options.missingWarn)
    ? options.missingWarn
    : context.missingWarn

  const fallbackWarn = isBoolean(options.fallbackWarn)
    ? options.fallbackWarn
    : context.fallbackWarn

  const escapeParameter = isBoolean(options.escapeParameter)
    ? options.escapeParameter
    : context.escapeParameter

  const resolvedMessage = !!options.resolvedMessage

  // prettier-ignore
  const defaultMsgOrKey =
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
  let [format, targetLocale, message]: [
    PathValue | MessageFunction<Message>,
    Locale | undefined,
    LocaleMessageValue<Message>
  ] = !resolvedMessage
    ? resolveMessageFormat(
        context,
        key as string,
        locale,
        fallbackLocale as FallbackLocale,
        fallbackWarn,
        missingWarn
      )
    : [
        key,
        locale,
        (messages as unknown as LocaleMessages<Message>)[locale] || {}
      ]

  // if you use default message, set it as message format!
  let cacheBaseKey = key
  if (
    !resolvedMessage &&
    !(isString(format) || isMessageFunction<Message>(format))
  ) {
    if (enableDefaultMsg) {
      format = defaultMsgOrKey
      cacheBaseKey = format as Path | MessageFunction<Message>
    }
  }

  // checking message format and target locale
  if (
    !resolvedMessage &&
    (!(isString(format) || isMessageFunction<Message>(format)) ||
      !isString(targetLocale))
  ) {
    return unresolving ? NOT_REOSLVED : (key as MessageType<Message>)
  }

  if (__DEV__ && isString(format) && context.messageCompiler == null) {
    warn(
      `The message format compilation is not supported in this build. ` +
        `Because message compiler isn't included. ` +
        `You need to pre-compilation all message format. ` +
        `So translate function return '${key}'.`
    )
    return key as MessageType<Message>
  }

  // setup compile error detecting
  let occurred = false
  const errorDetector = () => {
    occurred = true
  }

  // compile message format
  const msg = !isMessageFunction(format)
    ? compileMessageFormat(
        context,
        key as string,
        targetLocale!,
        format,
        cacheBaseKey as string,
        errorDetector
      )
    : format

  // if occurred compile error, return the message format
  if (occurred) {
    return format as MessageType<Message>
  }

  // evaluate message with context
  const ctxOptions = getMessageContextOptions(
    context,
    targetLocale!,
    message,
    options
  )
  const msgContext = createMessageContext<Message>(ctxOptions)
  const messaged = evaluateMessage(
    context,
    msg as MessageFunction<Message>,
    msgContext
  )

  // if use post translation option, proceed it with handler
  const ret = postTranslation ? postTranslation(messaged) : messaged

  // NOTE: experimental !!
  if (__DEV__ || __FEATURE_PROD_INTLIFY_DEVTOOLS__) {
    // prettier-ignore
    const payloads = {
      timestamp: Date.now(),
      key: isString(key)
        ? key
        : isMessageFunction(format)
          ? (format as MessageFunctionInternal).key!
          : '',
      locale: targetLocale || (isMessageFunction(format)
          ? (format as MessageFunctionInternal).locale!
          : ''),
      format:
        isString(format)
        ? format
        : isMessageFunction(format)
          ? (format as MessageFunctionInternal).source!
          : '',
      message: ret as string
    }
    ;(payloads as AdditionalPayloads).meta = assign(
      {},
      (context as unknown as CoreInternalContext).__meta,
      getAdditionalMeta() || {}
    )
    translateDevTools(payloads)
  }

  return ret
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
  context: CoreContext<Message, Messages>,
  key: string,
  locale: Locale,
  fallbackLocale: FallbackLocale,
  fallbackWarn: boolean | RegExp,
  missingWarn: boolean | RegExp
): [PathValue, Locale | undefined, LocaleMessageValue<Message>] {
  const {
    messages,
    onWarn,
    messageResolver: resolveValue,
    localeFallbacker
  } = context
  const locales = localeFallbacker(context as any, fallbackLocale, locale) // eslint-disable-line @typescript-eslint/no-explicit-any

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
      const emitter = (context as unknown as CoreInternalContext).__v_emitter
      if (emitter) {
        emitter.emit(VueDevToolsTimelineEvents.FALBACK, {
          type,
          key,
          from,
          to,
          groupId: `${type}:${key}`
        })
      }
    }

    message =
      (messages as unknown as LocaleMessages<Message>)[targetLocale] || {}

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
      const emitter = (context as unknown as CoreInternalContext).__v_emitter
      if (emitter && start && format) {
        emitter.emit(VueDevToolsTimelineEvents.MESSAGE_RESOLVE, {
          type: VueDevToolsTimelineEvents.MESSAGE_RESOLVE,
          key,
          message: format,
          time: end - start,
          groupId: `${type}:${key}`
        })
      }
      if (startTag && endTag && mark && measure) {
        mark(endTag)
        measure('intlify message resolve', startTag, endTag)
      }
    }

    if (isString(format) || isFunction(format)) break
    const missingRet = handleMissing(
      context as any, // eslint-disable-line @typescript-eslint/no-explicit-any
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

function compileMessageFormat<Messages, Message>(
  context: CoreContext<Message, Messages>,
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

  const msg = messageCompiler!(
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
    const emitter = (context as unknown as CoreInternalContext).__v_emitter
    if (emitter && start) {
      emitter.emit(VueDevToolsTimelineEvents.MESSAGE_COMPILATION, {
        type: VueDevToolsTimelineEvents.MESSAGE_COMPILATION,
        message: format,
        time: end - start,
        groupId: `${'translate'}:${key}`
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
  context: CoreContext<Message, Messages>,
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
    const emitter = (context as unknown as CoreInternalContext).__v_emitter
    if (emitter && start) {
      emitter.emit(VueDevToolsTimelineEvents.MESSAGE_EVALUATION, {
        type: VueDevToolsTimelineEvents.MESSAGE_EVALUATION,
        value: messaged,
        time: end - start,
        groupId: `${'translate'}:${(msg as MessageFunctionInternal).key}`
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
export function parseTranslateArgs<Message = string>(
  ...args: unknown[]
): [Path | MessageFunction<Message>, TranslateOptions] {
  const [arg1, arg2, arg3] = args
  const options = {} as TranslateOptions

  if (!isString(arg1) && !isNumber(arg1) && !isMessageFunction(arg1)) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT)
  }

  // prettier-ignore
  const key = isNumber(arg1)
    ? String(arg1)
    : isMessageFunction(arg1)
      ? (arg1 as MessageFunction<Message>)
      : arg1

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
    assign(options, arg3)
  }

  return [key, options]
}

function getCompileOptions<Messages, Message>(
  context: CoreContext<Message, Messages>,
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
        const emitter = (context as unknown as CoreInternalContext).__v_emitter
        if (emitter) {
          emitter.emit(VueDevToolsTimelineEvents.COMPILE_ERROR, {
            message: source,
            error: err.message,
            start: err.location && err.location.start.offset,
            end: err.location && err.location.end.offset,
            groupId: `${'translate'}:${key}`
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
  context: CoreContext<Message, Messages>,
  locale: Locale,
  message: LocaleMessageValue<Message>,
  options: TranslateOptions
): MessageContextOptions<Message> {
  const { modifiers, pluralRules, messageResolver: resolveValue } = context

  const resolveMessage = (key: string): MessageFunction<Message> => {
    const val = resolveValue(message, key)
    if (isString(val)) {
      let occurred = false
      const errorDetector = () => {
        occurred = true
      }
      const msg = compileMessageFormat<Messages, Message>(
        context,
        key,
        locale,
        val,
        key,
        errorDetector
      ) as unknown as MessageFunction<Message>
      return !occurred
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
