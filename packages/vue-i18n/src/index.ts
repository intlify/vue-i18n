import {
  registerMessageCompiler,
  compileToFunction,
  registerMessageResolver,
  resolveValue,
  registerLocaleFallbacker,
  fallbackWithLocaleChain
} from '@intlify/core-base'

// register message compiler at vue-i18n
registerMessageCompiler(compileToFunction)

// register message resolver at vue-i18n
registerMessageResolver(resolveValue)

// register fallback locale at vue-i18n
registerLocaleFallbacker(fallbackWithLocaleChain)

export * from '@intlify/vue-i18n-core'
