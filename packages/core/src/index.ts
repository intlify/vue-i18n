import {
  registerMessageCompiler,
  compileToFunction,
  compile,
  registerMessageResolver,
  resolveValue,
  registerLocaleFallbacker,
  fallbackWithLocaleChain
} from '@intlify/core-base'

// register message compiler at @intlify/core
if (!__FEATURE_JIT_COMPILATION__) {
  registerMessageCompiler(compileToFunction)
} else {
  registerMessageCompiler(compile)
}

// register message resolver at @intlify/core
registerMessageResolver(resolveValue)

// register fallback locale at @intlify/core
registerLocaleFallbacker(fallbackWithLocaleChain)

export * from '@intlify/core-base'
