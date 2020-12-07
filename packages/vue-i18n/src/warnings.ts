import { format } from '@intlify/shared'
import { CoreWarnCodes } from '@intlify/core'

export const enum I18nWarnCodes {
  FALLBACK_TO_ROOT = CoreWarnCodes.__EXTEND_POINT__,
  NOT_SUPPORTED_PRESERVE,
  NOT_SUPPORTED_FORMATTER,
  NOT_SUPPORTED_PRESERVE_DIRECTIVE,
  NOT_SUPPORTED_GET_CHOICE_INDEX,
  COMPONENT_NAME_LEGACY_COMPATIBLE,
  NOT_FOUND_PARENT_SCOPE
}

export const warnMessages: { [code: number]: string } = {
  [I18nWarnCodes.FALLBACK_TO_ROOT]: `Fall back to {type} '{key}' with root locale.`,
  [I18nWarnCodes.NOT_SUPPORTED_PRESERVE]: `Not supportted 'preserve'.`,
  [I18nWarnCodes.NOT_SUPPORTED_FORMATTER]: `Not supportted 'formatter'.`,
  [I18nWarnCodes.NOT_SUPPORTED_PRESERVE_DIRECTIVE]: `Not supportted 'preserveDirectiveContent'.`,
  [I18nWarnCodes.NOT_SUPPORTED_GET_CHOICE_INDEX]: `Not supportted 'getChoiceIndex'.`,
  [I18nWarnCodes.COMPONENT_NAME_LEGACY_COMPATIBLE]: `Component name legacy compatible: '{name}' -> 'i18n'`,
  [I18nWarnCodes.NOT_FOUND_PARENT_SCOPE]: `Not found parent scope. use the global scope.`
}

export function getWarnMessage(
  code: I18nWarnCodes,
  ...args: unknown[]
): string {
  return format(warnMessages[code], ...args)
}
