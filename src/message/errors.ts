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
  location?: SourceLocation
}

export const enum CompileErrorCodes {
  // tokenizer error codes
  EXPECTED_TOKEN,
  INVALID_TOKEN_IN_PLACEHOLDER,
  UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER,
  UNKNOWN_ESCAPE_SEQUENCE,
  INVALID_UNICODE_ESCAPE_SEQUENCE,
  UNBALANCED_CLOSING_BRACE,
  UNTERMINATED_CLOSING_BRACE,
  EMPTY_PLACEHOLDER,
  NOT_ALLOW_NEST_PLACEHOLDER,
  INVALID_LINKED_FORMAT,

  // parser error codes
  MUST_HAVE_MESSAGES_IN_PLURAL,

  // Special value for higher-order compilers to pick up the last code
  // to avoid collision of error codes. This should always be kept as the last
  // item.
  __EXTEND_POINT__
}

export type CreateCompileErrorOptions = {
  domain?: CompileDomain
  messages?: { [code: number]: string }
  args?: unknown[]
}

// TODO: This code should be removed with using rollup (`/*#__PURE__*/`)
export const errorMessages: { [code: number]: string } = {
  // tokenizer error messages
  [CompileErrorCodes.EXPECTED_TOKEN]: `Expected token: '{0}'`,
  [CompileErrorCodes.INVALID_TOKEN_IN_PLACEHOLDER]: `Invalid token in placeholder: '{0}'`, // TODO: if we don't need this error, should be removed it!
  [CompileErrorCodes.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER]: `Unterminated single quote in placeholder`,
  [CompileErrorCodes.UNKNOWN_ESCAPE_SEQUENCE]: `Unknown escape sequence: \\{0}`,
  [CompileErrorCodes.INVALID_UNICODE_ESCAPE_SEQUENCE]: `Invalid unicode escape sequence: {0}`,
  [CompileErrorCodes.UNBALANCED_CLOSING_BRACE]: `Unbalanced closing brace`,
  [CompileErrorCodes.UNTERMINATED_CLOSING_BRACE]: `Unterminated closing brace`,
  [CompileErrorCodes.EMPTY_PLACEHOLDER]: `Empty placeholder`,
  [CompileErrorCodes.NOT_ALLOW_NEST_PLACEHOLDER]: `Not allowed nest placeholder`,
  [CompileErrorCodes.INVALID_LINKED_FORMAT]: `Invalid linked format`,
  // parser error messages
  [CompileErrorCodes.MUST_HAVE_MESSAGES_IN_PLURAL]: `Plural must have messages`
}

// TODO: This code should be removed with using rollup (`/*#__PURE__*/`)
const RE_ARGS = /\{([0-9]+)\}/g

/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: This code should be removed with using rollup (`/*#__PURE__*/`)
export function format(message: string, ...args: any[]): string {
  return message.replace(RE_ARGS, (match: string, ...replaceArgs): string => {
    const [index] = replaceArgs
    return args[index] || ''
  })
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// TODO: This code should be removed with using rollup (`/*#__PURE__*/`)
export function createCompileError(
  code: CompileErrorCodes,
  loc: SourceLocation,
  optinos: CreateCompileErrorOptions = {}
): CompileError {
  const { domain, messages, args } = optinos
  const msg = __DEV__
    ? format((messages || errorMessages)[code] || '', ...(args || []))
    : code
  const error = new SyntaxError(String(msg)) as CompileError
  error.code = code
  error.location = loc
  error.domain = domain
  return error
}

export function defaultOnError(error: CompileError) {
  throw error
}
