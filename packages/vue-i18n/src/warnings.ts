import { format } from '@intlify/shared'
import { CoreWarnCodes } from '@intlify/core-base'

export const I18nWarnCodes = {
  FALLBACK_TO_ROOT: CoreWarnCodes.__EXTEND_POINT__,
  NOT_SUPPORTED_PRESERVE: CoreWarnCodes.__EXTEND_POINT__ + 1,
  NOT_SUPPORTED_FORMATTER: CoreWarnCodes.__EXTEND_POINT__ + 2,
  NOT_SUPPORTED_PRESERVE_DIRECTIVE: CoreWarnCodes.__EXTEND_POINT__ + 3,
  NOT_SUPPORTED_GET_CHOICE_INDEX: CoreWarnCodes.__EXTEND_POINT__ + 4,
  COMPONENT_NAME_LEGACY_COMPATIBLE: CoreWarnCodes.__EXTEND_POINT__ + 5,
  NOT_FOUND_PARENT_SCOPE: CoreWarnCodes.__EXTEND_POINT__ + 6
} as const

type I18nWarnCodes = typeof I18nWarnCodes[keyof typeof I18nWarnCodes]

export const warnMessages: { [code: number]: string } = {
  [I18nWarnCodes.FALLBACK_TO_ROOT]: `Fall back to {type} '{key}' with root locale.`,
  [I18nWarnCodes.NOT_SUPPORTED_PRESERVE]: `Not supported 'preserve'.`,
  [I18nWarnCodes.NOT_SUPPORTED_FORMATTER]: `Not supported 'formatter'.`,
  [I18nWarnCodes.NOT_SUPPORTED_PRESERVE_DIRECTIVE]: `Not supported 'preserveDirectiveContent'.`,
  [I18nWarnCodes.NOT_SUPPORTED_GET_CHOICE_INDEX]: `Not supported 'getChoiceIndex'.`,
  [I18nWarnCodes.COMPONENT_NAME_LEGACY_COMPATIBLE]: `Component name legacy compatible: '{name}' -> 'i18n'`,
  [I18nWarnCodes.NOT_FOUND_PARENT_SCOPE]: `Not found parent scope. use the global scope.`
}

export function getWarnMessage(
  code: I18nWarnCodes,
  ...args: unknown[]
): string {
  return format(warnMessages[code], ...args)
}
