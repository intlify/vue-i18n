import { format, incrementer } from '@intlify/shared'
import { CompileWarnCodes } from '@intlify/message-compiler'

const code = CompileWarnCodes.__EXTEND_POINT__
const inc = incrementer(code)

export const CoreWarnCodes = {
  NOT_FOUND_KEY: code, // 2
  FALLBACK_TO_TRANSLATE: inc(), // 3
  CANNOT_FORMAT_NUMBER: inc(), // 4
  FALLBACK_TO_NUMBER_FORMAT: inc(), // 5
  CANNOT_FORMAT_DATE: inc(), // 6
  FALLBACK_TO_DATE_FORMAT: inc(), // 7
  EXPERIMENTAL_CUSTOM_MESSAGE_COMPILER: inc(), // 8
  __EXTEND_POINT__: inc() // 9
} as const

export type CoreWarnCodes = (typeof CoreWarnCodes)[keyof typeof CoreWarnCodes]

/** @internal */
export const warnMessages: { [code: number]: string } = {
  [CoreWarnCodes.NOT_FOUND_KEY]: `Not found '{key}' key in '{locale}' locale messages.`,
  [CoreWarnCodes.FALLBACK_TO_TRANSLATE]: `Fall back to translate '{key}' key with '{target}' locale.`,
  [CoreWarnCodes.CANNOT_FORMAT_NUMBER]: `Cannot format a number value due to not supported Intl.NumberFormat.`,
  [CoreWarnCodes.FALLBACK_TO_NUMBER_FORMAT]: `Fall back to number format '{key}' key with '{target}' locale.`,
  [CoreWarnCodes.CANNOT_FORMAT_DATE]: `Cannot format a date value due to not supported Intl.DateTimeFormat.`,
  [CoreWarnCodes.FALLBACK_TO_DATE_FORMAT]: `Fall back to datetime format '{key}' key with '{target}' locale.`,
  [CoreWarnCodes.EXPERIMENTAL_CUSTOM_MESSAGE_COMPILER]: `This project is using Custom Message Compiler, which is an experimental feature. It may receive breaking changes or be removed in the future.`
}

export function getWarnMessage(
  code: CoreWarnCodes,
  ...args: unknown[]
): string {
  return format(warnMessages[code], ...args)
}
