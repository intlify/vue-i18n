import {
  createParser,
  defaultOnError,
  detectHtmlTag,
  mangle,
  optimize
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

const defaultOnCacheKey = (message: string): string => message
let compileCache: unknown = create()

export function clearCompileCache(): void {
  compileCache = create()
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

  // parse source codes
  const parser = createParser(options)
  const ast = parser.parse(message)

  // optimize ASTs
  options.optimize && optimize(ast)

  // minimize ASTs
  options.mangle && mangle(ast)

  return { ast, detectError, code: '' }
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
    const cached = (compileCache as MessageFunctions<Message>)[cacheKey]
    if (cached) {
      return cached
    }

    // compile message
    const { ast, detectError } = baseCompile(message, {
      ...context,
      location: __DEV__,
      mangle: !__DEV__,
      optimize: !__DEV__
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
