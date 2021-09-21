import {
  CompileError,
  CompileErrorCodes,
  createCompileError
} from '@intlify/core-base'

export interface I18nError extends CompileError {
  code: I18nErrorCodes
}

let code = CompileErrorCodes.__EXTEND_POINT__
const inc = () => code++

export const I18nErrorCodes = {
  // composer module errors
  UNEXPECTED_RETURN_TYPE: code, // 15
  // legacy module errors
  INVALID_ARGUMENT: inc(), // 16
  // i18n module errors
  MUST_BE_CALL_SETUP_TOP: inc(), // 17
  NOT_INSLALLED: inc(), // 18
  NOT_AVAILABLE_IN_LEGACY_MODE: inc(), // 19
  // directive module errors
  REQUIRED_VALUE: inc(), // 20
  INVALID_VALUE: inc(), // 21
  // vue-devtools errors
  CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN: inc(), // 22
  NOT_INSLALLED_WITH_PROVIDE: inc(), // 23
  // unexpected error
  UNEXPECTED_ERROR: inc(), // 24
  // not compatible legacy vue-i18n constructor
  NOT_COMPATIBLE_LEGACY_VUE_I18N: inc(), // 25
  // for enhancement
  __EXTEND_POINT__: inc() // 26
} as const

type I18nErrorCodes = typeof I18nErrorCodes[keyof typeof I18nErrorCodes]

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
  [I18nErrorCodes.NOT_INSLALLED]: 'Need to install with `app.use` function',
  [I18nErrorCodes.UNEXPECTED_ERROR]: 'Unexpected error',
  [I18nErrorCodes.NOT_AVAILABLE_IN_LEGACY_MODE]: 'Not available in legacy mode',
  [I18nErrorCodes.REQUIRED_VALUE]: `Required in value: {0}`,
  [I18nErrorCodes.INVALID_VALUE]: `Invalid value`,
  [I18nErrorCodes.CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN]: `Cannot setup vue-devtools plugin`,
  [I18nErrorCodes.NOT_INSLALLED_WITH_PROVIDE]:
    'Need to install with `provide` function',
  [I18nErrorCodes.NOT_COMPATIBLE_LEGACY_VUE_I18N]:
    'Not compatible legacy VueI18n.'
}
