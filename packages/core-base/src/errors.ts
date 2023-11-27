import { incrementer } from '@intlify/shared'
import {
  CompileErrorCodes,
  createCompileError
} from '@intlify/message-compiler'

import type { BaseError } from '@intlify/shared'

export interface CoreError extends BaseError {}

const code = CompileErrorCodes.__EXTEND_POINT__
const inc = incrementer(code)

export const CoreErrorCodes = {
  INVALID_ARGUMENT: code, // 18
  INVALID_DATE_ARGUMENT: inc(), // 19
  INVALID_ISO_DATE_ARGUMENT: inc(), // 20
  NOT_SUPPORT_NON_STRING_MESSAGE: inc(), // 21
  NOT_SUPPORT_LOCALE_PROMISE_VALUE: inc(), // 22
  NOT_SUPPORT_LOCALE_ASYNC_FUNCTION: inc(), // 23
  NOT_SUPPORT_LOCALE_TYPE: inc(), // 24
  __EXTEND_POINT__: inc() // 25
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
    'Not support non-string message',
  [CoreErrorCodes.NOT_SUPPORT_LOCALE_PROMISE_VALUE]:
    'cannot support promise value',
  [CoreErrorCodes.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION]:
    'cannot support async function',
  [CoreErrorCodes.NOT_SUPPORT_LOCALE_TYPE]: 'cannot support locale type'
}
