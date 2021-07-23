import {
  registerMessageResolver,
  resolveValue,
  registerLocaleFallbacker,
  fallbackWithLocaleChain
} from '@intlify/core-base'

// register message resolver at @intlify/core
registerMessageResolver(resolveValue)

// register fallback locale at @intlify/core
registerLocaleFallbacker(fallbackWithLocaleChain)

export * from '@intlify/core-base'
