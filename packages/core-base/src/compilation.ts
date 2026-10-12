import {
  baseCompile as baseCompileCore,
  defaultOnError,
  detectHtmlTag
} from '@intlify/message-compiler'
import { create, format, isBoolean, isString, warn } from '@intlify/shared'
import { isMessageAST } from './ast'
import { format as formatMessage } from './format'

import type {
  CompileError,
  CompileOptions,
  CompilerResult,
  ResourceNode
} from '@intlify/message-compiler'
import type { MessageCompilerContext } from './context'
import type { MessageFunction, MessageFunctions } from './runtime'

const WARN_MESSAGE = `Detected HTML in '{source}' message. Recommend not using HTML messages to avoid XSS.`

function checkHtmlMessage(source: string, warnHtmlMessage?: boolean): void {
  if (warnHtmlMessage && detectHtmlTag(source)) {
    warn(format(WARN_MESSAGE, { source }))
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CompileCache = MessageFunctions<any>

const defaultOnCacheKey = (message: string): string => message
let compileCache = create() as CompileCache

export function clearCompileCache(): void {
  compileCache = create() as CompileCache
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

/* #__NO_SIDE_EFFECTS__ */
export function compile<
  Message = string,
  MessageSource = string | ResourceNode
>(
  message: MessageSource,
  context: MessageCompilerContext
): MessageFunction<Message> {
  if (
    !__RUNTIME__ &&
    (__ESM_BROWSER__ ||
      __NODE_JS__ ||
      __GLOBAL__ ||
      !__FEATURE_DROP_MESSAGE_COMPILER__) &&
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
    const cached = compileCache[cacheKey]
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
    return !detectError ? (compileCache[cacheKey] = msg) : msg
  } else {
    // the message compiler is not included in this build (e.g. the runtime-only builds), so return a string message as is
    if (!isMessageAST(message)) {
      if (__DEV__) {
        warn(
          `Cannot compile the message of '${context.key}' key, because the message compiler is not included in this build. ` +
            `Pre-compile the message. So translate function returns the message as is.`
        )
      }
      return (() => message) as MessageFunction<Message>
    }

    // AST case (passed from bundler)
    const cacheKey = (message as unknown as ResourceNode).cacheKey
    if (cacheKey) {
      const cached = compileCache[cacheKey]
      if (cached) {
        return cached
      }
      // compose message function from message (AST)
      return (compileCache[cacheKey] = formatMessage<Message>(
        message as unknown as ResourceNode
      ))
    } else {
      return formatMessage<Message>(message as unknown as ResourceNode)
    }
  }
}
