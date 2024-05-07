import {
  registerMessageCompiler,
  compileToFunction,
  compile,
  registerMessageResolver,
  resolveValue,
  registerLocaleFallbacker,
  fallbackWithLocaleChain
} from '@intlify/core-base'
import { initFeatureFlags } from '../../core-base/src/misc'
import { getGlobalThis } from '@intlify/shared'

if (__ESM_BUNDLER__ && !__TEST__) {
  initFeatureFlags()
  if (__NODE_JS__) {
    // avoid Node.js CSP for Function()
    getGlobalThis().__INTLIFY_JIT_COMPILATION__ = true
  }
}

// register message compiler at @intlify/core
if (
  __ESM_BROWSER__ ||
  __NODE_JS__ ||
  __GLOBAL__ ||
  __FEATURE_JIT_COMPILATION__
) {
  registerMessageCompiler(compile)
} else {
  registerMessageCompiler(compileToFunction)
}

// register message resolver at @intlify/core
registerMessageResolver(resolveValue)

// register fallback locale at @intlify/core
registerLocaleFallbacker(fallbackWithLocaleChain)

export * from '@intlify/core-base'
