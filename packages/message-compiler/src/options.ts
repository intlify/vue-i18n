import type { CompileError } from './errors'
import type { CompileWarn } from './warnings'

export type CompileWarnHandler = (warn: CompileWarn) => void
export type CompileErrorHandler = (error: CompileError) => void
export type CacheKeyHandler = (source: string) => string

export interface TokenizeOptions {
  location?: boolean // default true
  onError?: CompileErrorHandler
}

export interface ParserOptions {
  location?: boolean // default true
  onCacheKey?: (source: string) => string
  onWarn?: CompileWarnHandler
  onError?: CompileErrorHandler
}

export interface TransformOptions {
  onWarn?: CompileWarnHandler
  onError?: CompileErrorHandler
}

export interface CodeGenOptions {
  location?: boolean // default true
  mode?: 'normal' | 'arrow' // default normal
  breakLineCode?: '\n' | ';' // default newline
  needIndent?: boolean // default true
  onWarn?: CompileWarnHandler
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
  minify?: boolean // default false
  jit?: boolean // default false
} & TransformOptions &
  CodeGenOptions &
  ParserOptions &
  TokenizeOptions
