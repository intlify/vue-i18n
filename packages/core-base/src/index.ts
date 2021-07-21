import { getGlobalThis } from '@intlify/shared'

export * from '@intlify/message-resolver'
export * from '@intlify/runtime'
export {
  CompileError,
  CompileErrorCodes,
  createCompileError
} from '@intlify/message-compiler'
export * from './context'
export * from './fallbacker'
export * from './compile'
export * from './translate'
export * from './datetime'
export * from './number'
export { getWarnMessage, CoreWarnCodes } from './warnings'
export { CoreError, CoreErrorCodes, createCoreError } from './errors'
export * from './types'
export * from './devtools'

if (__ESM_BUNDLER__ && !__TEST__) {
  if (typeof __FEATURE_PROD_INTLIFY_DEVTOOLS__ !== 'boolean') {
    getGlobalThis().__INTLIFY_PROD_DEVTOOLS__ = false
  }
}
