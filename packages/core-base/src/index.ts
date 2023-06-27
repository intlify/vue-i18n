import { initFeatureFlags } from './misc'

export {
  CompileError,
  CompileErrorCodes,
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
export { getWarnMessage, CoreWarnCodes } from './warnings'
export { CoreError, CoreErrorCodes, createCoreError } from './errors'
export * from './types'
export * from './devtools'

if (__ESM_BUNDLER__ && !__TEST__) {
  initFeatureFlags()
}
