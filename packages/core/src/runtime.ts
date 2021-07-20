import { registerMessageResolver, resolveValue } from '@intlify/core-base'

// register message resolver at @intlify/core
registerMessageResolver(resolveValue)

export * from '@intlify/core-base'
