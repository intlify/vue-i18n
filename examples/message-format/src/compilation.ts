import IntlMessageFormat from 'intl-messageformat'

import type { CompileError, MessageCompiler, MessageContext } from 'vue-i18n'

export const messageCompiler: MessageCompiler = (message, { locale, key, onError }) => {
  if (typeof message === 'string') {
    /**
     * You can tune your message compiler performance more with your cache strategy or also memoization at here
     */
    const formatter = new IntlMessageFormat(message, locale)
    return <T = string>(ctx: MessageContext<T>): T => {
      return formatter.format(ctx.values) as T
    }
  } else {
    /**
     * for AST.
     * If you would like to support it,
     * You need to transform locale mesages such as `json`, `yaml`, etc. with the bundle plugin.
     */
    onError?.(new Error('not support for AST') as CompileError)
    return () => key
  }
}
