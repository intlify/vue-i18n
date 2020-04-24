import { SourceLocation } from './location'

export type CompileDomain =
  | 'tokenizer'
  | 'parser'
  | 'generator'
  | 'transformer'
  | 'compiler'

export interface CompileError extends SyntaxError {
  code: CompileErrorCodes
  domain?: CompileDomain
  loc?: SourceLocation
}

export const enum CompileErrorCodes {
  MISSING_END_BRACE,
  MISSING_END_PAREN,
  // Special value for higher-order compilers to pick up the last code
  // to avoid collision of error codes. This should always be kept as the last
  // item.
  __EXTEND_POINT__
}

export const errorMessages: { [code: number]: string } = {
  // TODO:
  [CompileErrorCodes.MISSING_END_BRACE]: 'foo'
}

export function createCompilerError(
  code: CompileErrorCodes,
  loc?: SourceLocation,
  messages?: { [code: number]: string }
): CompileError {
  const msg = __DEV__ ? (messages || errorMessages)[code] : code
  const error = new SyntaxError(String(msg)) as CompileError
  error.code = code
  error.loc = loc
  return error
}
