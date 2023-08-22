import { format, incrementer } from '@intlify/shared'
import { CoreWarnCodes } from '@intlify/core-base'

const code = CoreWarnCodes.__EXTEND_POINT__
const inc = incrementer(code)

export const I18nWarnCodes = {
  FALLBACK_TO_ROOT: code, // 9
  NOT_SUPPORTED_PRESERVE: inc(), // 10
  NOT_SUPPORTED_FORMATTER: inc(), // 11
  NOT_SUPPORTED_PRESERVE_DIRECTIVE: inc(), // 12
  NOT_SUPPORTED_GET_CHOICE_INDEX: inc(), // 13
  COMPONENT_NAME_LEGACY_COMPATIBLE: inc(), // 14
  NOT_FOUND_PARENT_SCOPE: inc(), // 15
  IGNORE_OBJ_FLATTEN: inc(), // 16
  NOTICE_DROP_ALLOW_COMPOSITION: inc() // 17
} as const

type I18nWarnCodes = (typeof I18nWarnCodes)[keyof typeof I18nWarnCodes]

export const warnMessages: { [code: number]: string } = {
  [I18nWarnCodes.FALLBACK_TO_ROOT]: `Fall back to {type} '{key}' with root locale.`,
  [I18nWarnCodes.NOT_SUPPORTED_PRESERVE]: `Not supported 'preserve'.`,
  [I18nWarnCodes.NOT_SUPPORTED_FORMATTER]: `Not supported 'formatter'.`,
  [I18nWarnCodes.NOT_SUPPORTED_PRESERVE_DIRECTIVE]: `Not supported 'preserveDirectiveContent'.`,
  [I18nWarnCodes.NOT_SUPPORTED_GET_CHOICE_INDEX]: `Not supported 'getChoiceIndex'.`,
  [I18nWarnCodes.COMPONENT_NAME_LEGACY_COMPATIBLE]: `Component name legacy compatible: '{name}' -> 'i18n'`,
  [I18nWarnCodes.NOT_FOUND_PARENT_SCOPE]: `Not found parent scope. use the global scope.`,
  [I18nWarnCodes.IGNORE_OBJ_FLATTEN]: `Ignore object flatten: '{key}' key has an string value`,
  [I18nWarnCodes.NOTICE_DROP_ALLOW_COMPOSITION]: `'allowComposition' option will be dropped in the next major version. For more information, please see 👉 https://tinyurl.com/2p97mcze`
}

export function getWarnMessage(
  code: I18nWarnCodes,
  ...args: unknown[]
): string {
  return format(warnMessages[code], ...args)
}
