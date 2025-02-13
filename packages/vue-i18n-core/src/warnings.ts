import { CORE_WARN_CODES_EXTEND_POINT } from '@intlify/core-base'
import { format } from '@intlify/shared'

export const I18nWarnCodes = {
  FALLBACK_TO_ROOT: CORE_WARN_CODES_EXTEND_POINT as number, // 8
  NOT_FOUND_PARENT_SCOPE: 9,
  IGNORE_OBJ_FLATTEN: 10
} as const

type I18nWarnCodes = (typeof I18nWarnCodes)[keyof typeof I18nWarnCodes]

export const warnMessages: { [code: number]: string } = {
  [I18nWarnCodes.FALLBACK_TO_ROOT]: `Fall back to {type} '{key}' with root locale.`,
  [I18nWarnCodes.NOT_FOUND_PARENT_SCOPE]: `Not found parent scope. use the global scope.`,
  [I18nWarnCodes.IGNORE_OBJ_FLATTEN]: `Ignore object flatten: '{key}' key has an string value`
}

export function getWarnMessage(
  code: I18nWarnCodes,
  ...args: unknown[]
): string {
  return format(warnMessages[code], ...args)
}
