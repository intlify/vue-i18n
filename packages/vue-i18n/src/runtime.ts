import {
  registerMessageResolver,
  resolveValue,
  registerLocaleFallbacker,
  fallbackWithLocaleChain
} from '@intlify/core-base'

// register message resolver at vue-i18n
registerMessageResolver(resolveValue)

// register fallback locale at vue-i18n
registerLocaleFallbacker(fallbackWithLocaleChain)

export * from '@intlify/vue-i18n-core'
