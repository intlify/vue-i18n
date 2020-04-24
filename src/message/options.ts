import { CompileError } from './errors'

export type CompileErrorHandler = (error: CompileError) => void

export type TokenizeOptions = {
  // TODO: other options
  location?: boolean
  onError?: CompileErrorHandler
}

export type ParserOptions = {
  // TODO: other options
  // Generate source map?
  // - Default: false
  // sourceMap?: boolean
  // Filename for source map generation.
  // - Default: `message.intl`
  // filename?: string
  location?: boolean
  onError?: CompileErrorHandler
}

export type TransformOptions = {
  // TODO: other options
  onError?: CompileErrorHandler
}

export type CodeGenOptions = {
  // TODO: other options
  onError?: CompileErrorHandler
}

export type CompileOptions = TransformOptions &
  CodeGenOptions &
  ParserOptions &
  TokenizeOptions
