import {
  registerMessageCompiler,
  compileToFunction,
  registerMessageResolver,
  resolveValue
} from '@intlify/core-base'

// register message compiler at @intlify/core
registerMessageCompiler(compileToFunction)

// register message resolver at @intlify/core
registerMessageResolver(resolveValue)

export * from '@intlify/core-base'
