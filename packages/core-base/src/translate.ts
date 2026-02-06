import {
  assign,
  create,
  escapeHtml,
  generateCodeFrame,
  generateFormatCacheKey,
  inBrowser,
  isArray,
  isBoolean,
  isFunction,
  isKeylessObject,
  isNumber,
  isObject,
  isPlainObject,
  isString,
  mark,
  measure,
  warn
} from '@intlify/shared'
import { isMessageAST } from './ast'
import {
  handleMissing,
  isAlmostSameLocale,
  isImplicitFallback,
  isTranslateFallbackWarn,
  NOT_RESOLVED
} from './context'
import { CoreErrorCodes, createCoreError } from './errors'
import { getLocale } from './fallbacker'
import { createMessageContext } from './runtime'
import { CoreWarnCodes, getWarnMessage } from './warnings'

import type { CompileError, ResourceNode } from '@intlify/message-compiler'
import type {
  CoreContext,
  CoreInternalContext,
  DefineCoreLocaleMessage,
  LocaleMessages,
  LocaleMessageValue,
  MessageCompilerContext
} from './context'
import type { LocaleOptions } from './fallbacker'
import type { Path, PathValue } from './resolver'
import type {
  FallbackLocale,
  Locale,
  MessageContext,
  MessageContextOptions,
  MessageFunction,
  MessageFunctionInternal,
  MessageFunctionReturn,
  NamedValue
} from './runtime'
import type {
  IsEmptyObject,
  IsNever,
  PickupKeys,
  PickupPaths,
  RemovedIndexResources
} from './types'

const NOOP_MESSAGE_FUNCTION = () => ''

export const isMessageFunction = <T>(val: unknown): val is MessageFunction<T> => isFunction(val)

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
export interface TranslateOptions<Locales = Locale> extends LocaleOptions<Locales> {
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
 * TODO:
 *  this type should be used (refactored) at `translate` type definition
 *  (Unfortunately, using this type will result in key completion failure due to type mismatch...)
 */
//
// type ResolveTranslateResourceKeys<
// Context extends CoreContext<string, {}, {}, {}>,
// DefinedLocaleMessage extends
//     RemovedIndexResources<DefineCoreLocaleMessage> = RemovedIndexResources<DefineCoreLocaleMessage>,
// CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
//     ? PickupPaths<{
//         [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
//       }>
//     : never,
// ContextMessages = IsEmptyObject<Context['messages']> extends false
//     ? PickupKeys<Context['messages']>
//     : never,
// Result extends
//     | CoreMessages
//     | ContextMessages = IsNever<CoreMessages> extends false
//     ? IsNever<ContextMessages> extends false
//       ? CoreMessages | ContextMessages
//       : CoreMessages
//     : IsNever<ContextMessages> extends false
//     ? ContextMessages
//     : never
// > = Result
//

/**
 * `translate` function overloads
 */

export function translate<
  Context extends CoreContext<Message>,
  Key extends string = string,
  DefinedLocaleMessage extends RemovedIndexResources<DefineCoreLocaleMessage> =
    RemovedIndexResources<DefineCoreLocaleMessage>,
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
  ContextMessages = IsEmptyObject<Context['messages']> extends false
    ? PickupKeys<Context['messages']>
    : never,
  ResourceKeys extends CoreMessages | ContextMessages = IsNever<CoreMessages> extends false
    ? IsNever<ContextMessages> extends false
      ? CoreMessages | ContextMessages
      : CoreMessages
    : IsNever<ContextMessages> extends false
      ? ContextMessages
      : never,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  plural: number
): MessageFunctionReturn<Message> | number

export function translate<
  Context extends CoreContext<Message, {}, {}, {}>,
  Key extends string = string,
  DefinedLocaleMessage extends RemovedIndexResources<DefineCoreLocaleMessage> =
    RemovedIndexResources<DefineCoreLocaleMessage>,
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
  ContextMessages = IsEmptyObject<Context['messages']> extends false
    ? PickupKeys<Context['messages']>
    : never,
  ResourceKeys extends CoreMessages | ContextMessages = IsNever<CoreMessages> extends false
    ? IsNever<ContextMessages> extends false
      ? CoreMessages | ContextMessages
      : CoreMessages
    : IsNever<ContextMessages> extends false
      ? ContextMessages
      : never,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>
): MessageFunctionReturn<Message> | number

export function translate<
  Context extends CoreContext<Message, {}, {}, {}>,
  Key extends string = string,
  DefinedLocaleMessage extends RemovedIndexResources<DefineCoreLocaleMessage> =
    RemovedIndexResources<DefineCoreLocaleMessage>,
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
  ContextMessages = IsEmptyObject<Context['messages']> extends false
    ? PickupKeys<Context['messages']>
    : never,
  ResourceKeys extends CoreMessages | ContextMessages = IsNever<CoreMessages> extends false
    ? IsNever<ContextMessages> extends false
      ? CoreMessages | ContextMessages
      : CoreMessages
    : IsNever<ContextMessages> extends false
      ? ContextMessages
      : never,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  plural: number
): MessageFunctionReturn<Message> | number

export function translate<
  Context extends CoreContext<Message, {}, {}, {}>,
  Key extends string = string,
  DefinedLocaleMessage extends RemovedIndexResources<DefineCoreLocaleMessage> =
    RemovedIndexResources<DefineCoreLocaleMessage>,
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
  ContextMessages = IsEmptyObject<Context['messages']> extends false
    ? PickupKeys<Context['messages']>
    : never,
  ResourceKeys extends CoreMessages | ContextMessages = IsNever<CoreMessages> extends false
    ? IsNever<ContextMessages> extends false
      ? CoreMessages | ContextMessages
      : CoreMessages
    : IsNever<ContextMessages> extends false
      ? ContextMessages
      : never,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  plural: number,
  options: TranslateOptions<Context['locale']>
): MessageFunctionReturn<Message> | number

export function translate<
  Context extends CoreContext<Message, {}, {}, {}>,
  Key extends string = string,
  DefinedLocaleMessage extends RemovedIndexResources<DefineCoreLocaleMessage> =
    RemovedIndexResources<DefineCoreLocaleMessage>,
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
  ContextMessages = IsEmptyObject<Context['messages']> extends false
    ? PickupKeys<Context['messages']>
    : never,
  ResourceKeys extends CoreMessages | ContextMessages = IsNever<CoreMessages> extends false
    ? IsNever<ContextMessages> extends false
      ? CoreMessages | ContextMessages
      : CoreMessages
    : IsNever<ContextMessages> extends false
      ? ContextMessages
      : never,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  defaultMsg: string
): MessageFunctionReturn<Message> | number

export function translate<
  Context extends CoreContext<Message, {}, {}, {}>,
  Key extends string = string,
  DefinedLocaleMessage extends RemovedIndexResources<DefineCoreLocaleMessage> =
    RemovedIndexResources<DefineCoreLocaleMessage>,
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
  ContextMessages = IsEmptyObject<Context['messages']> extends false
    ? PickupKeys<Context['messages']>
    : never,
  ResourceKeys extends CoreMessages | ContextMessages = IsNever<CoreMessages> extends false
    ? IsNever<ContextMessages> extends false
      ? CoreMessages | ContextMessages
      : CoreMessages
    : IsNever<ContextMessages> extends false
      ? ContextMessages
      : never,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  defaultMsg: string,
  options: TranslateOptions<Context['locale']>
): MessageFunctionReturn<Message> | number

export function translate<
  Context extends CoreContext<Message, {}, {}, {}>,
  Key extends string = string,
  DefinedLocaleMessage extends RemovedIndexResources<DefineCoreLocaleMessage> =
    RemovedIndexResources<DefineCoreLocaleMessage>,
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
  ContextMessages = IsEmptyObject<Context['messages']> extends false
    ? PickupKeys<Context['messages']>
    : never,
  ResourceKeys extends CoreMessages | ContextMessages = IsNever<CoreMessages> extends false
    ? IsNever<ContextMessages> extends false
      ? CoreMessages | ContextMessages
      : CoreMessages
    : IsNever<ContextMessages> extends false
      ? ContextMessages
      : never,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  list: unknown[]
): MessageFunctionReturn<Message> | number

export function translate<
  Context extends CoreContext<Message, {}, {}, {}>,
  Key extends string = string,
  DefinedLocaleMessage extends RemovedIndexResources<DefineCoreLocaleMessage> =
    RemovedIndexResources<DefineCoreLocaleMessage>,
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
  ContextMessages = IsEmptyObject<Context['messages']> extends false
    ? PickupKeys<Context['messages']>
    : never,
  ResourceKeys extends CoreMessages | ContextMessages = IsNever<CoreMessages> extends false
    ? IsNever<ContextMessages> extends false
      ? CoreMessages | ContextMessages
      : CoreMessages
    : IsNever<ContextMessages> extends false
      ? ContextMessages
      : never,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  list: unknown[],
  plural: number
): MessageFunctionReturn<Message> | number

export function translate<
  Context extends CoreContext<Message, {}, {}, {}>,
  Key extends string = string,
  DefinedLocaleMessage extends RemovedIndexResources<DefineCoreLocaleMessage> =
    RemovedIndexResources<DefineCoreLocaleMessage>,
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
  ContextMessages = IsEmptyObject<Context['messages']> extends false
    ? PickupKeys<Context['messages']>
    : never,
  ResourceKeys extends CoreMessages | ContextMessages = IsNever<CoreMessages> extends false
    ? IsNever<ContextMessages> extends false
      ? CoreMessages | ContextMessages
      : CoreMessages
    : IsNever<ContextMessages> extends false
      ? ContextMessages
      : never,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  list: unknown[],
  defaultMsg: string
): MessageFunctionReturn<Message> | number

export function translate<
  Context extends CoreContext<Message, {}, {}, {}>,
  Key extends string = string,
  DefinedLocaleMessage extends RemovedIndexResources<DefineCoreLocaleMessage> =
    RemovedIndexResources<DefineCoreLocaleMessage>,
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
  ContextMessages = IsEmptyObject<Context['messages']> extends false
    ? PickupKeys<Context['messages']>
    : never,
  ResourceKeys extends CoreMessages | ContextMessages = IsNever<CoreMessages> extends false
    ? IsNever<ContextMessages> extends false
      ? CoreMessages | ContextMessages
      : CoreMessages
    : IsNever<ContextMessages> extends false
      ? ContextMessages
      : never,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  list: unknown[],
  options: TranslateOptions<Context['locale']>
): MessageFunctionReturn<Message> | number

export function translate<
  Context extends CoreContext<Message, {}, {}, {}>,
  Key extends string = string,
  DefinedLocaleMessage extends RemovedIndexResources<DefineCoreLocaleMessage> =
    RemovedIndexResources<DefineCoreLocaleMessage>,
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
  ContextMessages = IsEmptyObject<Context['messages']> extends false
    ? PickupKeys<Context['messages']>
    : never,
  ResourceKeys extends CoreMessages | ContextMessages = IsNever<CoreMessages> extends false
    ? IsNever<ContextMessages> extends false
      ? CoreMessages | ContextMessages
      : CoreMessages
    : IsNever<ContextMessages> extends false
      ? ContextMessages
      : never,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  named: NamedValue
): MessageFunctionReturn<Message> | number

export function translate<
  Context extends CoreContext<Message, {}, {}, {}>,
  Key extends string = string,
  DefinedLocaleMessage extends RemovedIndexResources<DefineCoreLocaleMessage> =
    RemovedIndexResources<DefineCoreLocaleMessage>,
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
  ContextMessages = IsEmptyObject<Context['messages']> extends false
    ? PickupKeys<Context['messages']>
    : never,
  ResourceKeys extends CoreMessages | ContextMessages = IsNever<CoreMessages> extends false
    ? IsNever<ContextMessages> extends false
      ? CoreMessages | ContextMessages
      : CoreMessages
    : IsNever<ContextMessages> extends false
      ? ContextMessages
      : never,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  named: NamedValue,
  plural: number
): MessageFunctionReturn<Message> | number

export function translate<
  Context extends CoreContext<Message, {}, {}, {}>,
  Key extends string = string,
  DefinedLocaleMessage extends RemovedIndexResources<DefineCoreLocaleMessage> =
    RemovedIndexResources<DefineCoreLocaleMessage>,
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
  ContextMessages = IsEmptyObject<Context['messages']> extends false
    ? PickupKeys<Context['messages']>
    : never,
  ResourceKeys extends CoreMessages | ContextMessages = IsNever<CoreMessages> extends false
    ? IsNever<ContextMessages> extends false
      ? CoreMessages | ContextMessages
      : CoreMessages
    : IsNever<ContextMessages> extends false
      ? ContextMessages
      : never,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  named: NamedValue,
  defaultMsg: string
): MessageFunctionReturn<Message> | number

export function translate<
  Context extends CoreContext<Message, {}, {}, {}>,
  Key extends string = string,
  DefinedLocaleMessage extends RemovedIndexResources<DefineCoreLocaleMessage> =
    RemovedIndexResources<DefineCoreLocaleMessage>,
  CoreMessages = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
  ContextMessages = IsEmptyObject<Context['messages']> extends false
    ? PickupKeys<Context['messages']>
    : never,
  ResourceKeys extends CoreMessages | ContextMessages = IsNever<CoreMessages> extends false
    ? IsNever<ContextMessages> extends false
      ? CoreMessages | ContextMessages
      : CoreMessages
    : IsNever<ContextMessages> extends false
      ? ContextMessages
      : never,
  Message = string
>(
  context: Context,
  key: Key | ResourceKeys | number | MessageFunction<Message>,
  named: NamedValue,
  options: TranslateOptions<Context['locale']>
): MessageFunctionReturn<Message> | number

// implementation of `translate` function
export function translate<Context extends CoreContext<Message, {}, {}, {}>, Message = string>(
  context: Context,
  ...args: unknown[]
): MessageFunctionReturn<Message> | number {
  const [key, options] = parseTranslateArgs<Message>(...args)
  const locale = getLocale(context, options)

  // escape params
  const escapeParameter = isBoolean(options.escapeParameter)
    ? options.escapeParameter
    : context.escapeParameter
  escapeParameter && escapeParams(options)

  // resolve message format
  const resolvedMessage = !!options.resolvedMessage

  let [format, targetLocale, message]: [
    PathValue | MessageFunction<Message> | ResourceNode,
    Locale | undefined,
    LocaleMessageValue<Message>
  ] = !resolvedMessage
    ? resolveMessageFormat(
        context,
        key as string,
        locale,
        context.fallbackLocale as FallbackLocale,
        isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn,
        isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn
      )
    : [key, locale, (context.messages as unknown as LocaleMessages<Message>)[locale] || create()]

  // if you use default message, set it as message format!
  let cacheBaseKey = key
  if (
    !resolvedMessage &&
    !(isString(format) || isMessageAST(format) || isMessageFunction<Message>(format))
  ) {
    // prettier-ignore
    const defaultMsgOrKey =
      isString(options.default)
        ? options.default // default by string option
        : isBoolean(options.default) || context.fallbackFormat 
          ? (!context.messageCompiler ? () => key : key) // default by `fallbackFormat` option
          : null

    const enableDefaultMsg =
      context.fallbackFormat ||
      (defaultMsgOrKey != null && (isString(defaultMsgOrKey) || isFunction(defaultMsgOrKey)))

    if (enableDefaultMsg) {
      format = defaultMsgOrKey
      cacheBaseKey = format as Path | MessageFunction<Message>
    }
  }

  // checking message format and target locale
  if (
    !resolvedMessage &&
    (!(isString(format) || isMessageAST(format) || isMessageFunction<Message>(format)) ||
      !isString(targetLocale))
  ) {
    return context.unresolving ? NOT_RESOLVED : (key as MessageFunctionReturn<Message>)
  }

  // TODO: refactor
  if (__DEV__ && isString(format) && context.messageCompiler == null) {
    warn(
      `The message format compilation is not supported in this build. ` +
        `Because message compiler isn't included. ` +
        `You need to pre-compilation all message format. ` +
        `So translate function return '${
          isString(key)
            ? key
            : isObject(key)
              ? JSON.stringify(key as ResourceNode)
              : isFunction(key)
                ? (key as Function).name || 'function'
                : ''
        }'.`
    )
    return key as MessageFunctionReturn<Message>
  }

  // setup compile error detecting
  let occurred = false
  const onError = () => {
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
        onError
      )
    : format

  // if occurred compile error, return the message format
  if (occurred) {
    return format as MessageFunctionReturn<Message>
  }

  // evaluate message with context
  const ctxOptions = getMessageContextOptions(context, targetLocale!, message, options)
  const msgContext = createMessageContext<Message>(ctxOptions)

  const messaged =
    __DEV__ && inBrowser
      ? measureEvaluateMessage(context, msg as MessageFunction<Message>, msgContext)
      : (msg as MessageFunction<Message>)(msgContext)

  // prettier-ignore
  // if use post translation option, proceed it with handler
  const ret = context.postTranslation
    ? context.postTranslation(messaged, key as string)
    : messaged

  return ret
}

function escapeParams(options: TranslateOptions) {
  if (isArray(options.list)) {
    options.list = options.list.map(item => (isString(item) ? escapeHtml(item) : item))
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
  const { messages, onWarn, messageResolver: resolveValue, localeFallbacker } = context
  const locales = localeFallbacker(context as any, fallbackLocale, locale)

  let message: LocaleMessageValue<Message> = create()
  let targetLocale: Locale | undefined
  let format: PathValue = null
  // for vue-devtools timeline event
  let from: Locale = locale
  const type = 'translate'

  for (let i = 0; i < locales.length; i++) {
    targetLocale = locales[i]

    if (
      __DEV__ &&
      locale !== targetLocale &&
      !isAlmostSameLocale(locale, targetLocale) &&
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
        emitter.emit('fallback', {
          type,
          key,
          from,
          to: targetLocale,
          groupId: `${type}:${key}`
        })
      }
    }

    message = (messages as unknown as LocaleMessages<Message>)[targetLocale] || create()

    // for vue-devtools timeline event
    let start: number | null = null
    let startTag: string | undefined
    let endTag: string | undefined
    if (__DEV__ && inBrowser) {
      start = window.performance.now()
      startTag = 'intlify-message-resolve-start'
      endTag = 'intlify-message-resolve-end'
      mark?.(startTag)
    }

    if ((format = resolveValue(message, key)) === null) {
      // if null, resolve with object key path
      format = (message as any)[key]
    }

    // for vue-devtools timeline event
    if (__DEV__ && inBrowser) {
      const end = window.performance.now()
      const emitter = (context as unknown as CoreInternalContext).__v_emitter
      if (emitter && start && format) {
        emitter.emit('message-resolve', {
          type: 'message-resolve',
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

    if (isString(format) || isMessageAST(format) || isMessageFunction(format)) {
      break
    }

    if (!isImplicitFallback(targetLocale, locales)) {
      const missingRet = handleMissing(context as any, key, targetLocale, missingWarn, type)
      if (missingRet !== key) {
        format = missingRet as PathValue
      }
    }
    if (__DEV__) {
      from = targetLocale
    }
  }

  return [format, targetLocale, message]
}

function compileMessageFormat<Messages, Message>(
  context: CoreContext<Message, Messages>,
  key: string,
  targetLocale: string,
  format: PathValue | ResourceNode | MessageFunction<Message>,
  cacheBaseKey: string,
  onError: () => void
): MessageFunctionInternal {
  if (isMessageFunction<Message>(format)) {
    const msg = format as MessageFunctionInternal
    msg.locale = msg.locale || targetLocale
    msg.key = msg.key || key
    return msg
  }

  if (context.messageCompiler == null) {
    const msg = (() => format) as MessageFunctionInternal
    msg.locale = targetLocale
    msg.key = key
    return msg
  }

  // for vue-devtools timeline event
  let start: number | null = null
  let startTag: string | undefined
  let endTag: string | undefined
  if (__DEV__ && inBrowser && mark) {
    start = window.performance.now()
    startTag = 'intlify-message-compilation-start'
    endTag = 'intlify-message-compilation-end'
    mark?.(startTag)
  }

  const msg = context.messageCompiler(
    format as string | ResourceNode,
    getCompileContext(
      context,
      targetLocale,
      cacheBaseKey,
      format as string | ResourceNode,
      context.warnHtmlMessage,
      onError
    )
  ) as MessageFunctionInternal

  // for vue-devtools timeline event
  if (__DEV__ && inBrowser) {
    const end = window.performance.now()
    const emitter = (context as unknown as CoreInternalContext).__v_emitter
    if (emitter && start) {
      emitter.emit('message-compilation', {
        type: 'message-compilation',
        message: format as string | ResourceNode | MessageFunction,
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

// for vue-devtools timeline event
let measureEvaluateMessage: <Messages, Message>(
  context: CoreContext<Message, Messages>,
  msg: MessageFunction<Message>,
  msgCtx: MessageContext<Message>
) => MessageFunctionReturn<Message>
if (__DEV__ && inBrowser) {
  const startTag = 'intlify-message-evaluation-start'
  const endTag = 'intlify-message-evaluation-end'
  measureEvaluateMessage = (context, msg, msgCtx) => {
    const start = window.performance.now()
    mark(startTag)

    // evaluate message
    const messaged = msg(msgCtx)

    const end = window.performance.now()
    const emitter = (context as unknown as CoreInternalContext).__v_emitter
    emitter?.emit('message-evaluation', {
      type: 'message-evaluation',
      value: messaged,
      time: end - start,
      groupId: `${'translate'}:${(msg as MessageFunctionInternal).key}`
    })

    mark(endTag)
    measure('intlify message evaluation', startTag, endTag)

    return messaged
  }
}

/** @internal */
export function parseTranslateArgs<Message = string>(
  ...args: unknown[]
): [Path | MessageFunction<Message> | ResourceNode, TranslateOptions] {
  const [arg1, arg2, arg3] = args

  if (!isString(arg1) && !isNumber(arg1) && !isMessageFunction(arg1) && !isMessageAST(arg1)) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT)
  }

  // prettier-ignore
  const key = isNumber(arg1)
    ? String(arg1)
    : isMessageFunction(arg1)
      ? (arg1 as MessageFunction<Message>)
      : arg1

  const options = create() as TranslateOptions
  if (isNumber(arg2)) {
    options.plural = arg2
  } else if (isString(arg2)) {
    options.default = arg2
  } else if (isPlainObject(arg2) && !isKeylessObject(arg2)) {
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

function getCompileContext<Messages, Message>(
  context: CoreContext<Message, Messages>,
  locale: Locale,
  key: string,
  source: string | ResourceNode,
  warnHtmlMessage: boolean,
  onError: (err: CompileError) => void
): MessageCompilerContext {
  return {
    locale,
    key,
    warnHtmlMessage,
    onError: (err: CompileError): void => {
      onError?.(err)
      if (__DEV__) {
        const _source = getSourceForCodeFrame(source)
        const message = `Message compilation error: ${err.message}`
        const codeFrame =
          err.location &&
          _source &&
          generateCodeFrame(_source, err.location.start.offset, err.location.end.offset)
        const emitter = (context as unknown as CoreInternalContext).__v_emitter
        if (emitter && _source) {
          emitter.emit('compile-error', {
            message: _source,
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
    onCacheKey: (source: string): string => generateFormatCacheKey(locale, key, source)
  }
}

function getSourceForCodeFrame(source: string | ResourceNode): string | undefined {
  if (isString(source)) {
    return source
  } else if (source.loc?.source) {
    return source.loc.source
  }
}

function getMessageContextOptions<Messages, Message = string>(
  context: CoreContext<Message, Messages>,
  locale: Locale,
  message: LocaleMessageValue<Message>,
  options: TranslateOptions
): MessageContextOptions<Message> {
  const {
    modifiers,
    pluralRules,
    messageResolver: resolveValue,
    fallbackLocale,
    fallbackWarn,
    missingWarn,
    fallbackContext
  } = context

  const resolveMessage = (key: string, useLinked: boolean): MessageFunction<Message> => {
    let val = resolveValue(message, key)

    // fallback
    if (val == null && (fallbackContext || useLinked)) {
      const [, , message] = resolveMessageFormat(
        fallbackContext || context, // NOTE: if has fallbackContext, fallback to root, else if use linked, fallback to local context
        key,
        locale,
        fallbackLocale as FallbackLocale,
        fallbackWarn,
        missingWarn
      )
      val = resolveValue(message, key)
    }

    if (isString(val) || isMessageAST(val)) {
      let occurred = false
      const onError = () => {
        occurred = true
      }
      const msg = compileMessageFormat<Messages, Message>(
        context,
        key,
        locale,
        val,
        key,
        onError
      ) as unknown as MessageFunction<Message>
      return !occurred ? msg : (NOOP_MESSAGE_FUNCTION as MessageFunction<Message>)
    } else if (isMessageFunction<Message>(val)) {
      return val
    } else {
      // TODO: should be implemented warning message
      return NOOP_MESSAGE_FUNCTION as MessageFunction<Message>
    }
  }

  return {
    locale,
    modifiers,
    pluralRules,
    messages: resolveMessage,
    processor: context.processor ?? undefined,
    list: options.list ?? undefined,
    named: options.named ?? undefined,
    pluralIndex: isNumber(options.plural) ? options.plural : undefined
  }
}
