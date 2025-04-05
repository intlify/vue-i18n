import { initFeatureFlags } from './misc'

export { createCompileError } from '@intlify/message-compiler'
export type {
  CompileError,
  CompileErrorCodes,
  ResourceNode
} from '@intlify/message-compiler'
export { AST_NODE_PROPS_KEYS, isMessageAST } from './ast'
export * from './compilation'
export * from './context'
export * from './datetime'
export * from './devtools'
export { CORE_ERROR_CODES_EXTEND_POINT, createCoreError } from './errors'
export type { CoreError, CoreErrorCodes } from './errors'
export * from './fallbacker'
export * from './number'
export * from './resolver'
export * from './runtime'
export * from './translate'
export * from './types'
export {
  CORE_WARN_CODES_EXTEND_POINT,
  CoreWarnCodes,
  getWarnMessage
} from './warnings'

if (__ESM_BUNDLER__ && !__TEST__) {
  initFeatureFlags()
}
