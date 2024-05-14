import {
  compile,
  registerMessageCompiler,
  registerMessageResolver,
  resolveValue,
  registerLocaleFallbacker,
  fallbackWithLocaleChain
} from '@intlify/core-base'
import { initFeatureFlags } from '../../core-base/src/misc'

if (__ESM_BUNDLER__ && !__TEST__) {
  initFeatureFlags()
}

// register message compiler for jit compilation
registerMessageCompiler(compile)

// register message resolver at @intlify/core
registerMessageResolver(resolveValue)

// register fallback locale at @intlify/core
registerLocaleFallbacker(fallbackWithLocaleChain)

export * from '@intlify/core-base'
