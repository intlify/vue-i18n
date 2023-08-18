import IntlMessageFormat from 'intl-messageformat'

import type { MessageCompiler, CompileError, MessageContext } from 'vue-i18n'

export const messageCompiler: MessageCompiler = (
  message,
  { locale, key, onError }
) => {
  if (typeof message === 'string') {
    /**
     * You can tune your performance more with your cache strategy or also memoization at here
     */
    const formatter = new IntlMessageFormat(message, locale)
    return (ctx: MessageContext) => formatter.format(ctx.values) as string
  } else {
    /**
     * for AST.
     * If you would like to support it,
     * you need to make the bundler plugin yourself, such as vite or unplugin
     */
    onError && onError(new Error('not support for AST') as CompileError)
    return () => key
  }
}
