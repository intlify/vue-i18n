import { warn, format, isBoolean, isString } from '@intlify/shared'
import {
  baseCompile as baseCompileCore,
  defaultOnError,
  detectHtmlTag
} from '@intlify/message-compiler'
import { format as formatMessage } from './format'
import { CoreErrorCodes, createCoreError } from './errors'

import type {
  CompileOptions,
  CompileError,
  CompilerResult,
  ResourceNode
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

export function clearCompileCache(): void {
  compileCache = Object.create(null)
}

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

export function compileToFunction<
  Message = string,
  MessageSource = string | ResourceNode
>(
  message: MessageSource,
  context: MessageCompilerContext
): MessageFunction<Message> {
  if (!isString(message)) {
    throw createCoreError(CoreErrorCodes.NOT_SUPPORT_NON_STRING_MESSAGE)
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
  if (isString(message)) {
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
