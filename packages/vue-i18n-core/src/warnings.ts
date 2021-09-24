import { format } from '@intlify/shared'
import { CoreWarnCodes } from '@intlify/core-base'

let code = CoreWarnCodes.__EXTEND_POINT__
const inc = () => code++

export const I18nWarnCodes = {
  FALLBACK_TO_ROOT: code, // 7
  NOT_SUPPORTED_PRESERVE: inc(), // 8
  NOT_SUPPORTED_FORMATTER: inc(), // 9
  NOT_SUPPORTED_PRESERVE_DIRECTIVE: inc(), // 10
  NOT_SUPPORTED_GET_CHOICE_INDEX: inc(), // 11
  COMPONENT_NAME_LEGACY_COMPATIBLE: inc(), // 12
  NOT_FOUND_PARENT_SCOPE: inc(), // 13
  NOT_SUPPORT_MULTI_I18N_INSTANCE: inc() // 14
} as const

type I18nWarnCodes = typeof I18nWarnCodes[keyof typeof I18nWarnCodes]

export const warnMessages: { [code: number]: string } = {
  [I18nWarnCodes.FALLBACK_TO_ROOT]: `Fall back to {type} '{key}' with root locale.`,
  [I18nWarnCodes.NOT_SUPPORTED_PRESERVE]: `Not supported 'preserve'.`,
  [I18nWarnCodes.NOT_SUPPORTED_FORMATTER]: `Not supported 'formatter'.`,
  [I18nWarnCodes.NOT_SUPPORTED_PRESERVE_DIRECTIVE]: `Not supported 'preserveDirectiveContent'.`,
  [I18nWarnCodes.NOT_SUPPORTED_GET_CHOICE_INDEX]: `Not supported 'getChoiceIndex'.`,
  [I18nWarnCodes.COMPONENT_NAME_LEGACY_COMPATIBLE]: `Component name legacy compatible: '{name}' -> 'i18n'`,
  [I18nWarnCodes.NOT_FOUND_PARENT_SCOPE]: `Not found parent scope. use the global scope.`,
  [I18nWarnCodes.NOT_SUPPORT_MULTI_I18N_INSTANCE]: `Not support multi i18n instance.`
}

export function getWarnMessage(
  code: I18nWarnCodes,
  ...args: unknown[]
): string {
  return format(warnMessages[code], ...args)
}
