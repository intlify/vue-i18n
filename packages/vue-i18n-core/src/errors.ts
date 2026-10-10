import { CORE_ERROR_CODES_EXTEND_POINT, createCompileError } from '@intlify/core-base'

import type { BaseError } from '@intlify/shared'

interface I18nError extends BaseError {}

export const I18nErrorCodes = {
  // composer module errors
  UNEXPECTED_RETURN_TYPE: CORE_ERROR_CODES_EXTEND_POINT as number, // 23
  INVALID_ARGUMENT: 24,
  // i18n module errors
  MUST_BE_CALL_SETUP_TOP: 25,
  NOT_INSTALLED: 26,
  // vue-devtools errors
  CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN: 27,
  // i18n module errors
  NOT_INSTALLED_WITH_PROVIDE: 28,
  // unexpected error
  UNEXPECTED_ERROR: 29,
  // duplicate `useI18n` calling
  DUPLICATE_USE_I18N_CALLING: 30
} as const

type I18nErrorCodes = (typeof I18nErrorCodes)[keyof typeof I18nErrorCodes]

export function createI18nError(code: I18nErrorCodes, ...args: unknown[]): I18nError {
  return createCompileError(code, null, __DEV__ ? { messages: errorMessages, args } : undefined)
}

export const errorMessages: { [code: number]: string } = {
  [I18nErrorCodes.UNEXPECTED_RETURN_TYPE]: 'Unexpected return type in composer',
  [I18nErrorCodes.INVALID_ARGUMENT]: 'Invalid argument',
  [I18nErrorCodes.MUST_BE_CALL_SETUP_TOP]: 'Must be called at the top of a `setup` function',
  [I18nErrorCodes.NOT_INSTALLED]: 'Need to install with `app.use` function',
  [I18nErrorCodes.UNEXPECTED_ERROR]: 'Unexpected error',
  [I18nErrorCodes.CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN]: `Cannot setup vue-devtools plugin`,
  [I18nErrorCodes.NOT_INSTALLED_WITH_PROVIDE]: 'Need to install with `provide` function',
  [I18nErrorCodes.DUPLICATE_USE_I18N_CALLING]:
    'Duplicate local-scope `useI18n` call detected. Call `useI18n` only once per component.'
}
