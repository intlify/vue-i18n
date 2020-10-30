import {
  CompileError,
  CompileErrorCodes,
  createCompileError
} from '../message/errors'

/** @internal */
export interface CoreError extends CompileError {
  code: CoreErrorCodes
}

/** @internal */
export const enum CoreErrorCodes {
  INVALID_ARGUMENT = CompileErrorCodes.__EXTEND_POINT__,
  INVALID_DATE_ARGUMENT,
  INVALID_ISO_DATE_ARGUMENT,
  __EXTEND_POINT__
}

/** @internal */
export function createCoreError(code: CoreErrorCodes): CoreError {
  return createCompileError(
    code,
    null,
    __DEV__ ? { messages: errorMessages } : undefined
  )
}

/** @internal */
export const errorMessages: { [code: number]: string } = {
  [CoreErrorCodes.INVALID_ARGUMENT]: 'Invalid arguments',
  [CoreErrorCodes.INVALID_DATE_ARGUMENT]:
    'The date provided is an invalid Date object.' +
    'Make sure your Date represents a valid date.',
  [CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT]:
    'The argument provided is not a valid ISO date string'
}
