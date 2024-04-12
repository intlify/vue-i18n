import { incrementer } from '@intlify/shared'
import { CoreErrorCodes, createCompileError } from '@intlify/core-base'

import type { BaseError } from '@intlify/shared'

export interface I18nError extends BaseError {}

const code = CoreErrorCodes.__EXTEND_POINT__
const inc = incrementer(code)

export const I18nErrorCodes = {
  // composer module errors
  UNEXPECTED_RETURN_TYPE: code, // 24
  // legacy module errors
  INVALID_ARGUMENT: inc(), // 25
  // i18n module errors
  MUST_BE_CALL_SETUP_TOP: inc(), // 26
  NOT_INSTALLED: inc(), // 27
  NOT_AVAILABLE_IN_LEGACY_MODE: inc(), // 28
  // directive module errors
  REQUIRED_VALUE: inc(), // 29
  INVALID_VALUE: inc(), // 30
  // vue-devtools errors
  CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN: inc(), // 31
  NOT_INSTALLED_WITH_PROVIDE: inc(), // 32
  // unexpected error
  UNEXPECTED_ERROR: inc(), // 33
  // not compatible legacy vue-i18n constructor
  NOT_COMPATIBLE_LEGACY_VUE_I18N: inc(), // 34
  // bridge support vue 2.x only
  BRIDGE_SUPPORT_VUE_2_ONLY: inc(), // 35
  // need to define `i18n` option in `allowComposition: true` and `useScope: 'local' at `useI18n``
  MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION: inc(), // 36
  // Not available Compostion API in Legacy API mode. Please make sure that the legacy API mode is working properly
  NOT_AVAILABLE_COMPOSITION_IN_LEGACY: inc(), // 37
  // for enhancement
  __EXTEND_POINT__: inc() // 38
} as const

type I18nErrorCodes = (typeof I18nErrorCodes)[keyof typeof I18nErrorCodes]

export function createI18nError(
  code: I18nErrorCodes,
  ...args: unknown[]
): I18nError {
  return createCompileError(
    code,
    null,
    __DEV__ ? { messages: errorMessages, args } : undefined
  )
}

export const errorMessages: { [code: number]: string } = {
  [I18nErrorCodes.UNEXPECTED_RETURN_TYPE]: 'Unexpected return type in composer',
  [I18nErrorCodes.INVALID_ARGUMENT]: 'Invalid argument',
  [I18nErrorCodes.MUST_BE_CALL_SETUP_TOP]:
    'Must be called at the top of a `setup` function',
  [I18nErrorCodes.NOT_INSTALLED]: 'Need to install with `app.use` function',
  [I18nErrorCodes.UNEXPECTED_ERROR]: 'Unexpected error',
  [I18nErrorCodes.NOT_AVAILABLE_IN_LEGACY_MODE]: 'Not available in legacy mode',
  [I18nErrorCodes.REQUIRED_VALUE]: `Required in value: {0}`,
  [I18nErrorCodes.INVALID_VALUE]: `Invalid value`,
  [I18nErrorCodes.CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN]: `Cannot setup vue-devtools plugin`,
  [I18nErrorCodes.NOT_INSTALLED_WITH_PROVIDE]:
    'Need to install with `provide` function',
  [I18nErrorCodes.NOT_COMPATIBLE_LEGACY_VUE_I18N]:
    'Not compatible legacy VueI18n.',
  [I18nErrorCodes.BRIDGE_SUPPORT_VUE_2_ONLY]:
    'vue-i18n-bridge support Vue 2.x only',
  [I18nErrorCodes.MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION]:
    'Must define ‘i18n’ option or custom block in Composition API with using local scope in Legacy API mode',
  [I18nErrorCodes.NOT_AVAILABLE_COMPOSITION_IN_LEGACY]:
    'Not available Compostion API in Legacy API mode. Please make sure that the legacy API mode is working properly'
}
