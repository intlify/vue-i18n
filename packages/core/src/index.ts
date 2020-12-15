import { registerMessageCompiler, compileToFunction } from '@intlify/core-base'

// register message compiler at @intlify/core
registerMessageCompiler(compileToFunction)

export * from '@intlify/core-base'
