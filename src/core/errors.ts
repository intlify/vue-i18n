import {
  CompileError,
  CompileErrorCodes,
  createCompileError
} from '../message/errors'

export interface CoreError extends CompileError {
  code: CoreErrorCodes
}

export const enum CoreErrorCodes {
  INVALID_ARGUMENT = CompileErrorCodes.__EXTEND_POINT__,
  __EXTEND_POINT__
}

export function createCoreError(code: CoreErrorCodes): CoreError {
  return createCompileError(
    code,
    null,
    __DEV__ ? { messages: errorMessages } : undefined
  )
}

export const errorMessages: { [code: number]: string } = {
  [CoreErrorCodes.INVALID_ARGUMENT]: 'Invalid arguments'
}
