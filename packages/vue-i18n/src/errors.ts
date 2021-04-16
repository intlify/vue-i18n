import {
  CompileError,
  CompileErrorCodes,
  createCompileError
} from '@intlify/core-base'

export interface I18nError extends CompileError {
  code: I18nErrorCodes
}

export const I18nErrorCodes = {
  // composer module errors
  UNEXPECTED_RETURN_TYPE: CompileErrorCodes.__EXTEND_POINT__,
  // legacy module errors
  INVALID_ARGUMENT: CompileErrorCodes.__EXTEND_POINT__ + 1,
  // i18n module errors
  MUST_BE_CALL_SETUP_TOP: CompileErrorCodes.__EXTEND_POINT__ + 2,
  NOT_INSLALLED: CompileErrorCodes.__EXTEND_POINT__ + 3,
  NOT_AVAILABLE_IN_LEGACY_MODE: CompileErrorCodes.__EXTEND_POINT__ + 4,
  // directive module errors
  REQUIRED_VALUE: CompileErrorCodes.__EXTEND_POINT__ + 5,
  INVALID_VALUE: CompileErrorCodes.__EXTEND_POINT__ + 6,
  // vue-devtools errors
  CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN: CompileErrorCodes.__EXTEND_POINT__ + 7,
  // unexpected error
  UNEXPECTED_ERROR: CompileErrorCodes.__EXTEND_POINT__ + 8,
  // for enhancement
  __EXTEND_POINT__: CompileErrorCodes.__EXTEND_POINT__ + 9
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
  [I18nErrorCodes.CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN]: `Cannot setup vue-devtools plugin`
}
