import {
  registerMessageResolver,
  resolveValue,
  registerLocaleFallbacker,
  fallbackWithLocaleChain
} from '@intlify/core-base'
import { initFeatureFlags } from '../../core-base/src/misc'

if (__ESM_BUNDLER__ && !__TEST__) {
  initFeatureFlags()
}

// register message resolver at @intlify/core
registerMessageResolver(resolveValue)

// register fallback locale at @intlify/core
registerLocaleFallbacker(fallbackWithLocaleChain)

export * from '@intlify/core-base'
