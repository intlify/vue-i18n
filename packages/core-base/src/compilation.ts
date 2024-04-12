import { warn, format, isObject, isBoolean, isString } from '@intlify/shared'
import {
  baseCompile as baseCompileCore,
  CompileWarnCodes,
  defaultOnError,
  detectHtmlTag
} from '@intlify/message-compiler'
import { format as formatMessage } from './format'
import { CoreErrorCodes, createCoreError } from './errors'

import type {
  CompileOptions,
  CompileError,
  CompilerResult,
  ResourceNode,
  CompileWarn
} from '@intlify/message-compiler'
import type { MessageFunction, MessageFunctions } from './runtime'
import type { MessageCompilerContext } from './context'

const WARN_MESSAGE = `Detected HTML in '{source}' message. Recommend not using HTML messages to avoid XSS.`

function checkHtmlMessage(source: string, warnHtmlMessage?: boolean): void {
  if (warnHtmlMessage && detectHtmlTag(source)) {
    warn(format(WARN_MESSAGE, { source }))
  }
}

const defaultOnCacheKey = (message: string): string => message
let compileCache: unknown = Object.create(null)

function onCompileWarn(_warn: CompileWarn): void {
  if (_warn.code === CompileWarnCodes.USE_MODULO_SYNTAX) {
    warn(
      `The use of named interpolation with modulo syntax is deprecated. ` +
        `It will be removed in v10.\n` +
        `reference: https://vue-i18n.intlify.dev/guide/essentials/syntax#rails-i18n-format \n` +
        `(message compiler warning message: ${_warn.message})`
    )
  }
}

export function clearCompileCache(): void {
  compileCache = Object.create(null)
}

export const isMessageAST = (val: unknown): val is ResourceNode =>
  isObject(val) &&
  (val.t === 0 || val.type === 0) &&
  ('b' in val || 'body' in val)

function baseCompile(
  message: string,
  options: CompileOptions = {}
): CompilerResult & { detectError: boolean } {
  // error detecting on compile
  let detectError = false
  const onError = options.onError || defaultOnError
  options.onError = (err: CompileError): void => {
    detectError = true
    onError(err)
  }

  // compile with mesasge-compiler
  return { ...baseCompileCore(message, options), detectError }
}

/* #__NO_SIDE_EFFECTS__ */
export const compileToFunction = <
  Message = string,
  MessageSource = string | ResourceNode
>(
  message: MessageSource,
  context: MessageCompilerContext
): MessageFunction<Message> => {
  if (!isString(message)) {
    throw createCoreError(CoreErrorCodes.NOT_SUPPORT_NON_STRING_MESSAGE)
  }

  // set onWarn
  if (__DEV__) {
    context.onWarn = onCompileWarn
  }

  if (__RUNTIME__) {
    __DEV__ &&
      warn(
        `Runtime compilation is not supported in ${
          __BUNDLE_FILENAME__ || 'N/A'
        }.`
      )
    return (() => message) as MessageFunction<Message>
  } else {
    // check HTML message
    const warnHtmlMessage = isBoolean(context.warnHtmlMessage)
      ? context.warnHtmlMessage
      : true
    __DEV__ && checkHtmlMessage(message, warnHtmlMessage)

    // check caches
    const onCacheKey = context.onCacheKey || defaultOnCacheKey
    const cacheKey = onCacheKey(message)
    const cached = (compileCache as MessageFunctions<Message>)[cacheKey]
    if (cached) {
      return cached
    }

    // compile
    const { code, detectError } = baseCompile(message, context)

    // evaluate function
    const msg = new Function(`return ${code}`)() as MessageFunction<Message>

    // if occurred compile error, don't cache
    return !detectError
      ? ((compileCache as MessageFunctions<Message>)[cacheKey] = msg)
      : msg
  }
}

export function compile<
  Message = string,
  MessageSource = string | ResourceNode
>(
  message: MessageSource,
  context: MessageCompilerContext
): MessageFunction<Message> {
  // set onWarn
  if (__DEV__) {
    context.onWarn = onCompileWarn
  }

  if (
    (__ESM_BROWSER__ ||
      __NODE_JS__ ||
      __GLOBAL__ ||
      (__FEATURE_JIT_COMPILATION__ && !__FEATURE_DROP_MESSAGE_COMPILER__)) &&
    isString(message)
  ) {
    // check HTML message
    const warnHtmlMessage = isBoolean(context.warnHtmlMessage)
      ? context.warnHtmlMessage
      : true
    __DEV__ && checkHtmlMessage(message, warnHtmlMessage)

    // check caches
    const onCacheKey = context.onCacheKey || defaultOnCacheKey
    const cacheKey = onCacheKey(message)
    const cached = (compileCache as MessageFunctions<Message>)[cacheKey]
    if (cached) {
      return cached
    }

    // compile with JIT mode
    const { ast, detectError } = baseCompile(message, {
      ...context,
      location: __DEV__,
      jit: true
    })

    // compose message function from AST
    const msg = formatMessage<Message>(ast)

    // if occurred compile error, don't cache
    return !detectError
      ? ((compileCache as MessageFunctions<Message>)[cacheKey] = msg)
      : msg
  } else {
    if (__DEV__ && !isMessageAST(message)) {
      warn(
        `the message that is resolve with key '${context.key}' is not supported for jit compilation`
      )
      return (() => message) as MessageFunction<Message>
    }

    // AST case (passed from bundler)
    const cacheKey = (message as unknown as ResourceNode).cacheKey
    if (cacheKey) {
      const cached = (compileCache as MessageFunctions<Message>)[cacheKey]
      if (cached) {
        return cached
      }
      // compose message function from message (AST)
      return ((compileCache as MessageFunctions<Message>)[cacheKey] =
        formatMessage<Message>(message as unknown as ResourceNode))
    } else {
      return formatMessage<Message>(message as unknown as ResourceNode)
    }
  }
}
