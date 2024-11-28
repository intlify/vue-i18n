import {
  COMPILE_ERROR_CODES_EXTEND_POINT,
  createCompileError
} from '@intlify/message-compiler'

import type { BaseError } from '@intlify/shared'

export interface CoreError extends BaseError {}

export const CoreErrorCodes = {
  INVALID_ARGUMENT: COMPILE_ERROR_CODES_EXTEND_POINT, // 17
  INVALID_DATE_ARGUMENT: 18,
  INVALID_ISO_DATE_ARGUMENT: 19,
  NOT_SUPPORT_NON_STRING_MESSAGE: 20,
  NOT_SUPPORT_LOCALE_PROMISE_VALUE: 21,
  NOT_SUPPORT_LOCALE_ASYNC_FUNCTION: 22,
  NOT_SUPPORT_LOCALE_TYPE: 23
} as const

export const CORE_ERROR_CODES_EXTEND_POINT = 24

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
