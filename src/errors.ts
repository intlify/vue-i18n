import {
  CompileError,
  CompileErrorCodes,
  createCompileError
} from './message/errors'

export interface I18nError extends CompileError {
  code: I18nErrorCodes
}

export const enum I18nErrorCodes {
  // composer errors
  I18N_UNEXPECTED_RETURN_TYPE = CompileErrorCodes.__EXTEND_POINT__,
  // for enhancement
  __EXTEND_POINT__
}

export function createI18nError(code: I18nErrorCodes): I18nError {
  return createCompileError(
    code,
    null,
    __DEV__ ? { messages: errorMessages } : undefined
  )
}

export const errorMessages: { [code: number]: string } = {
  [I18nErrorCodes.I18N_UNEXPECTED_RETURN_TYPE]:
    'Unexpected return type in composer'
}
