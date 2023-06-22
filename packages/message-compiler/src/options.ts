import type { CompileError } from './errors'

export type CompileErrorHandler = (error: CompileError) => void
export type CacheKeyHandler = (source: string) => string

export interface TokenizeOptions {
  location?: boolean
  onError?: CompileErrorHandler
}

export interface ParserOptions {
  location?: boolean
  onCacheKey?: (source: string) => string
  onError?: CompileErrorHandler
}

export interface TransformOptions {
  onError?: CompileErrorHandler
}

export interface CodeGenOptions {
  location?: boolean
  mode?: 'normal' | 'arrow' // default normal
  breakLineCode?: '\n' | ';' // default newline
  needIndent?: boolean // default true
  onError?: CompileErrorHandler
  // Generate source map?
  // - Default: false
  sourceMap?: boolean
  // Filename for source map generation.
  // - Default: `message.intl`
  filename?: string
}

export type CompileOptions = {
  useJIT?: boolean
} & TransformOptions &
  CodeGenOptions &
  ParserOptions &
  TokenizeOptions
