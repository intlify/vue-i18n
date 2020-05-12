import { format } from './utils'
import { CoreWarnCodes } from './core/warnings'

export const enum VueI18nWarnCodes {
  FALLBACK_TO_ROOT = CoreWarnCodes.__EXTEND_POINT__,
  NOT_SUPPORTED_PRESERVE,
  NOT_SUPPORTED_FORMATTER,
  NOT_SUPPORTED_PRESERVE_DIRECTIVE,
  NOT_SUPPORTED_GET_CHOICE_INDEX,
  COMPONENT_NAME_LEGACY_COMPATIBLE
}

export const warnMessages: { [code: number]: string } = {
  [VueI18nWarnCodes.FALLBACK_TO_ROOT]: `Fall back to {type} '{key}' with root locale.`,
  [VueI18nWarnCodes.NOT_SUPPORTED_PRESERVE]: `not supportted 'preserve'.`,
  [VueI18nWarnCodes.NOT_SUPPORTED_FORMATTER]: `not supportted 'formatter'.`,
  [VueI18nWarnCodes.NOT_SUPPORTED_PRESERVE_DIRECTIVE]: `not supportted 'preserveDirectiveContent'.`,
  [VueI18nWarnCodes.NOT_SUPPORTED_GET_CHOICE_INDEX]: `not supportted 'getChoiceIndex'.`,
  [VueI18nWarnCodes.COMPONENT_NAME_LEGACY_COMPATIBLE]: `component name legacy compatible: '{name}' -> 'i18n'`
}

export function getWarnMessage(
  code: VueI18nWarnCodes,
  ...args: unknown[]
): string {
  return format(warnMessages[code], ...args)
}
