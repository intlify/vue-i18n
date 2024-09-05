import { initFeatureFlags } from './misc'

export {
  CompileError,
  CompileErrorCodes,
  createCompileError,
  ResourceNode
} from '@intlify/message-compiler'
export * from './compilation'
export * from './context'
export * from './datetime'
export * from './devtools'
export {
  CORE_ERROR_CODES_EXTEND_POINT,
  CoreError,
  CoreErrorCodes,
  createCoreError
} from './errors'
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
