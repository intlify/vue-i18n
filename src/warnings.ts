import { format } from './utils'
import { CoreWarnCodes } from './core/warnings'

export const enum I18nWarnCodes {
  FALLBACK_TO_ROOT = CoreWarnCodes.__EXTEND_POINT__,
  NOT_SUPPORTED_PRESERVE,
  NOT_SUPPORTED_FORMATTER,
  NOT_SUPPORTED_PRESERVE_DIRECTIVE,
  NOT_SUPPORTED_GET_CHOICE_INDEX,
  COMPONENT_NAME_LEGACY_COMPATIBLE,
  NOT_FOUND_PARENT_COMPOSER
}

export const warnMessages: { [code: number]: string } = {
  [I18nWarnCodes.FALLBACK_TO_ROOT]: `Fall back to {type} '{key}' with root locale.`,
  [I18nWarnCodes.NOT_SUPPORTED_PRESERVE]: `not supportted 'preserve'.`,
  [I18nWarnCodes.NOT_SUPPORTED_FORMATTER]: `not supportted 'formatter'.`,
  [I18nWarnCodes.NOT_SUPPORTED_PRESERVE_DIRECTIVE]: `not supportted 'preserveDirectiveContent'.`,
  [I18nWarnCodes.NOT_SUPPORTED_GET_CHOICE_INDEX]: `not supportted 'getChoiceIndex'.`,
  [I18nWarnCodes.COMPONENT_NAME_LEGACY_COMPATIBLE]: `component name legacy compatible: '{name}' -> 'i18n'`,
  [I18nWarnCodes.NOT_FOUND_PARENT_COMPOSER]: `not found parent composer. use the global composer`
}

export function getWarnMessage(
  code: I18nWarnCodes,
  ...args: unknown[]
): string {
  return format(warnMessages[code], ...args)
}
