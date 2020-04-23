import { SourceLocation } from './location'

export interface CompilerError extends SyntaxError {
  code: CompilerErrorCodes
  loc?: SourceLocation
}

export const enum CompilerErrorCodes {
  MISSING_END_BRACE,
  MISSING_END_PAREN,
  // Special value for higher-order compilers to pick up the last code
  // to avoid collision of error codes. This should always be kept as the last
  // item.
  __EXTEND_POINT__
}

export const errorMessages: { [code: number]: string } = {
  // TODO:
  [CompilerErrorCodes.MISSING_END_BRACE]: 'foo'
}

export function createCompilerError(
  code: CompilerErrorCodes,
  loc?: SourceLocation,
  messages?: { [code: number]: string }
): CompilerError {
  const msg = __DEV__ ? (messages || errorMessages)[code] : code
  const error = new SyntaxError(String(msg)) as CompilerError
  error.code = code
  error.loc = loc
  return error
}
