import { warn, format, isBoolean } from '@intlify/shared'
import {
  baseCompile,
  defaultOnError,
  detectHtmlTag
} from '@intlify/message-compiler'

import type { CompileOptions, CompileError } from '@intlify/message-compiler'
import type { MessageFunction, MessageFunctions } from './runtime'

const WARN_MESSAGE = `Detected HTML in '{source}' message. Recommend not using HTML messages to avoid XSS.`

function checkHtmlMessage(source: string, warnHtmlMessage?: boolean): void {
  if (warnHtmlMessage && detectHtmlTag(source)) {
    warn(format(WARN_MESSAGE, { source }))
  }
}

const defaultOnCacheKey = (source: string): string => source
let compileCache: unknown = Object.create(null)

export function clearCompileCache(): void {
  compileCache = Object.create(null)
}

export function compileToFunction<T = string>(
  source: string,
  options: CompileOptions = {}
): MessageFunction<T> {
  if (__RUNTIME__) {
    __DEV__ &&
      warn(
        `Runtime compilation is not supported in ${
          __BUNDLE_FILENAME__ || 'N/A'
        }.`
      )
    return (() => source) as MessageFunction<T>
  } else {
    // check HTML message
    const warnHtmlMessage = isBoolean((options as any).warnHtmlMessage)
      ? (options as any).warnHtmlMessage
      : true
    __DEV__ && checkHtmlMessage(source, warnHtmlMessage)

    // check caches
    const onCacheKey = options.onCacheKey || defaultOnCacheKey
    const key = onCacheKey(source)
    const cached = (compileCache as MessageFunctions<T>)[key]
    if (cached) {
      return cached
    }

    // compile error detecting
    let occurred = false
    const onError = options.onError || defaultOnError
    options.onError = (err: CompileError): void => {
      occurred = true
      onError(err)
    }

    // compile
    const { code } = baseCompile(source, options)

    // evaluate function
    const msg = new Function(`return ${code}`)() as MessageFunction<T>

    // if occurred compile error, don't cache
    return !occurred ? ((compileCache as MessageFunctions<T>)[key] = msg) : msg
  }
}
