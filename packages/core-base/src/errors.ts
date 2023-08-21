import {
  CompileErrorCodes,
  createCompileError
} from '@intlify/message-compiler'
import type { CompileError } from '@intlify/message-compiler'

export interface CoreError extends CompileError {
  code: CoreErrorCodes
}

let code = CompileErrorCodes.__EXTEND_POINT__
const inc = () => ++code

export const CoreErrorCodes = {
  INVALID_ARGUMENT: code, // 15
  INVALID_DATE_ARGUMENT: inc(), // 16
  INVALID_ISO_DATE_ARGUMENT: inc(), // 17
  NOT_SUPPORT_NON_STRING_MESSAGE: inc(), // 18
  __EXTEND_POINT__: inc() // 19
} as const

export type CoreErrorCodes =
  (typeof CoreErrorCodes)[keyof typeof CoreErrorCodes]

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
    'The argument provided is not a valid ISO date string',
  [CoreErrorCodes.NOT_SUPPORT_NON_STRING_MESSAGE]:
    'Not support non-string message'
}
