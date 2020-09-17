import {
  CompileError,
  CompileErrorCodes,
  createCompileError
} from './message/errors'

export interface I18nError extends CompileError {
  code: I18nErrorCodes
}

export const enum I18nErrorCodes {
  // composer module errors
  UNEXPECTED_RETURN_TYPE = CompileErrorCodes.__EXTEND_POINT__,
  // legacy module errors
  INVALID_ARGUMENT,
  // i18n module errors
  NOT_INSLALLED,
  UNEXPECTED_ERROR,
  NOT_AVAILABLE_IN_LEGACY_MODE,
  // diretive module errors
  REQUIRED_VALUE,
  INVALID_VALUE,
  NOT_FOUND_COMPOSER,
  // for enhancement
  __EXTEND_POINT__
}

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
  [I18nErrorCodes.NOT_INSLALLED]: 'Need to install with app.use function',
  [I18nErrorCodes.UNEXPECTED_ERROR]: 'Unexpeced error',
  [I18nErrorCodes.NOT_AVAILABLE_IN_LEGACY_MODE]: 'Not available in legacy mode',
  [I18nErrorCodes.REQUIRED_VALUE]: `Required in value: {0}`,
  [I18nErrorCodes.INVALID_VALUE]: `Invalid value`,
  [I18nErrorCodes.NOT_FOUND_COMPOSER]: `Not found Composer`
}
