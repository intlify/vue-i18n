import { format } from '@intlify/shared'
import { SourceLocation } from './location'

export type CompileDomain =
  | 'tokenizer'
  | 'parser'
  | 'generator'
  | 'transformer'
  | 'compiler'

export interface CompileError extends SyntaxError {
  code: number
  domain?: CompileDomain
  location?: SourceLocation
}

export interface CreateCompileErrorOptions {
  domain?: CompileDomain
  messages?: { [code: number]: string }
  args?: unknown[]
}

export const CompileErrorCodes = {
  // tokenizer error codes
  EXPECTED_TOKEN: 1,
  INVALID_TOKEN_IN_PLACEHOLDER: 2,
  UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER: 3,
  UNKNOWN_ESCAPE_SEQUENCE: 4,
  INVALID_UNICODE_ESCAPE_SEQUENCE: 5,
  UNBALANCED_CLOSING_BRACE: 6,
  UNTERMINATED_CLOSING_BRACE: 7,
  EMPTY_PLACEHOLDER: 8,
  NOT_ALLOW_NEST_PLACEHOLDER: 9,
  INVALID_LINKED_FORMAT: 10,

  // parser error codes
  MUST_HAVE_MESSAGES_IN_PLURAL: 11,
  UNEXPECTED_EMPTY_LINKED_MODIFIER: 12,
  UNEXPECTED_EMPTY_LINKED_KEY: 13,
  UNEXPECTED_LEXICAL_ANALYSIS: 14,

  // Special value for higher-order compilers to pick up the last code
  // to avoid collision of error codes. This should always be kept as the last
  // item.
  __EXTEND_POINT__: 15
} as const

export type CompileErrorCodes =
  (typeof CompileErrorCodes)[keyof typeof CompileErrorCodes]

/** @internal */
export const errorMessages: { [code: number]: string } = {
  // tokenizer error messages
  [CompileErrorCodes.EXPECTED_TOKEN]: `Expected token: '{0}'`,
  [CompileErrorCodes.INVALID_TOKEN_IN_PLACEHOLDER]: `Invalid token in placeholder: '{0}'`,
  [CompileErrorCodes.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER]: `Unterminated single quote in placeholder`,
  [CompileErrorCodes.UNKNOWN_ESCAPE_SEQUENCE]: `Unknown escape sequence: \\{0}`,
  [CompileErrorCodes.INVALID_UNICODE_ESCAPE_SEQUENCE]: `Invalid unicode escape sequence: {0}`,
  [CompileErrorCodes.UNBALANCED_CLOSING_BRACE]: `Unbalanced closing brace`,
  [CompileErrorCodes.UNTERMINATED_CLOSING_BRACE]: `Unterminated closing brace`,
  [CompileErrorCodes.EMPTY_PLACEHOLDER]: `Empty placeholder`,
  [CompileErrorCodes.NOT_ALLOW_NEST_PLACEHOLDER]: `Not allowed nest placeholder`,
  [CompileErrorCodes.INVALID_LINKED_FORMAT]: `Invalid linked format`,
  // parser error messages
  [CompileErrorCodes.MUST_HAVE_MESSAGES_IN_PLURAL]: `Plural must have messages`,
  [CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_MODIFIER]: `Unexpected empty linked modifier`,
  [CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_KEY]: `Unexpected empty linked key`,
  [CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS]: `Unexpected lexical analysis in token: '{0}'`
}

export function createCompileError<T extends number>(
  code: T,
  loc: SourceLocation | null,
  options: CreateCompileErrorOptions = {}
): CompileError {
  const { domain, messages, args } = options
  const msg = __DEV__
    ? format((messages || errorMessages)[code] || '', ...(args || []))
    : code
  const error = new SyntaxError(String(msg)) as CompileError
  error.code = code
  if (loc) {
    error.location = loc
  }
  error.domain = domain
  return error
}

/** @internal */
export function defaultOnError(error: CompileError): never {
  throw error
}
