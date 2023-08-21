import IntlMessageFormat from 'intl-messageformat'

import type { MessageCompiler, CompileError, MessageContext } from 'vue-i18n'

export const messageCompiler: MessageCompiler = (
  message,
  { locale, key, onError }
) => {
  if (typeof message === 'string') {
    /**
     * You can tune your message compiler performance more with your cache strategy or also memoization at here
     */
    const formatter = new IntlMessageFormat(message, locale)
    return (ctx: MessageContext) => {
      return formatter.format(ctx.values)
    }
  } else {
    /**
     * for AST.
     * If you would like to support it,
     * You need to transform locale mesages such as `json`, `yaml`, etc. with the bundle plugin.
     */
    onError && onError(new Error('not support for AST') as CompileError)
    return () => key
  }
}
