import { CompileError } from './errors'

export type CompileErrorHandler = (error: CompileError) => void
export type CompileCacheKeyHandler = (source: string) => string

export interface TokenizeOptions {
  location?: boolean
  onError?: CompileErrorHandler
}

export interface ParserOptions {
  // Generate source map?
  // - Default: false
  // sourceMap?: boolean
  // Filename for source map generation.
  // - Default: `message.intl`
  // filename?: string
  location?: boolean
  onError?: CompileErrorHandler
}

export interface TransformOptions {
  onError?: CompileErrorHandler
}

export interface CodeGenOptions {
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
