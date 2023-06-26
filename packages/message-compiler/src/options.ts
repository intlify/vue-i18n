import type { CompileError } from './errors'

export type CompileErrorHandler = (error: CompileError) => void
export type CacheKeyHandler = (source: string) => string

export interface TokenizeOptions {
  location?: boolean // default true
  onError?: CompileErrorHandler
}

export interface ParserOptions {
  location?: boolean // default true
  onCacheKey?: (source: string) => string
  onError?: CompileErrorHandler
}

export interface TransformOptions {
  onError?: CompileErrorHandler
}

export interface CodeGenOptions {
  location?: boolean // default true
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
  optimize?: boolean // default true
  useJIT?: boolean // default false
} & TransformOptions &
  CodeGenOptions &
  ParserOptions &
  TokenizeOptions
