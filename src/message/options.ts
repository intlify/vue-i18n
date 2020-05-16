import { CompileError } from './errors'

export type CompileErrorHandler = (error: CompileError) => void
export type CompileCacheKeyHandler = (source: string) => string

export type TokenizeOptions = {
  location?: boolean
  onError?: CompileErrorHandler
}

export type ParserOptions = {
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
  onError?: CompileErrorHandler
}

export type CodeGenOptions = {
  mode?: 'normal' | 'arrow' // default normal
  onError?: CompileErrorHandler
}

export type CompileOptions = {
  warnHtmlMessage?: boolean
  onCacheKey?: CompileCacheKeyHandler
} & TransformOptions &
  CodeGenOptions &
  ParserOptions &
  TokenizeOptions
