import { initFeatureFlags } from './misc'

export {
  CompileError,
  CompileErrorCodes,
  ResourceNode,
  createCompileError
} from '@intlify/message-compiler'
export * from './resolver'
export * from './runtime'
export * from './context'
export * from './fallbacker'
export * from './compilation'
export * from './translate'
export * from './datetime'
export * from './number'
export {
  getWarnMessage,
  CoreWarnCodes,
  CORE_WARN_CODES_EXTEND_POINT
} from './warnings'
export {
  CoreError,
  CoreErrorCodes,
  createCoreError,
  CORE_ERROR_CODES_EXTEND_POINT
} from './errors'
export * from './types'
export * from './devtools'

if (__ESM_BUNDLER__ && !__TEST__) {
  initFeatureFlags()
}
