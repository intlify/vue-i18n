import { format, incrementer } from '@intlify/shared'
import { CoreWarnCodes } from '@intlify/core-base'

const code = CoreWarnCodes.__EXTEND_POINT__
const inc = incrementer(code)

export const I18nWarnCodes = {
  FALLBACK_TO_ROOT: code, // 8
  NOT_FOUND_PARENT_SCOPE: inc(), // 9
  IGNORE_OBJ_FLATTEN: inc(), // 10
  NOTICE_DROP_TRANSLATE_EXIST_COMPATIBLE_FLAG: inc(), // 11
  DEPRECATE_TC: inc(), // 12
  __EXTEND_POINT__: inc() // 13
} as const

type I18nWarnCodes = (typeof I18nWarnCodes)[keyof typeof I18nWarnCodes]

export const warnMessages: { [code: number]: string } = {
  [I18nWarnCodes.FALLBACK_TO_ROOT]: `Fall back to {type} '{key}' with root locale.`,
  [I18nWarnCodes.NOT_FOUND_PARENT_SCOPE]: `Not found parent scope. use the global scope.`,
  [I18nWarnCodes.IGNORE_OBJ_FLATTEN]: `Ignore object flatten: '{key}' key has an string value`,
  [I18nWarnCodes.NOTICE_DROP_TRANSLATE_EXIST_COMPATIBLE_FLAG]: `'translateExistCompatible' option will be dropped in the next major version.`,
  [I18nWarnCodes.DEPRECATE_TC]: `'tc' and '$tc' has been deprecated in v10. Use 't' or '$t' instead. 'tc' and '$tc’ are going to remove in v11.`
}

export function getWarnMessage(
  code: I18nWarnCodes,
  ...args: unknown[]
): string {
  return format(warnMessages[code], ...args)
}
