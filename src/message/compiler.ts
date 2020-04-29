import { CompileOptions } from './options'
import { createParser, ResourceNode } from './parser'
import { transform } from './transformer'
import { generate } from './generator'
import { CompileError, defaultOnError } from './errors'

export type CompileResult = {
  code: string
  ast: ResourceNode
  // TODO: should be implemetend sourcemap
  // map?: RawSourceMap
}

// TODO: should be removed!
export type Compiler = Readonly<{
  compile: (source: string, options?: CompileOptions) => CompileResult
}>

export type MessageFunction = (ctx: unknown) => unknown

const defaultOnCacheKey = (source: string): string => source
const compileCache: Record<string, MessageFunction> = Object.create(null)

export function compile(
  source: string,
  options: CompileOptions = {}
): MessageFunction {
  const onCacheKey = options.onCacheKey || defaultOnCacheKey

  // check caches
  const key = onCacheKey(source)
  const cached = compileCache[key]
  if (cached) {
    return cached
  }

  let occured = false
  const onError = options.onError || defaultOnError
  options.onError = (err: CompileError): void => {
    occured = true
    onError(err)
  }

  // parse source codes
  const parser = createParser({ ...options })
  const ast = parser.parse(source)

  // transform ASTs
  transform(ast, { ...options })

  // generate javascript codes
  const code = generate(ast, { ...options })

  const msg = new Function(`return ${code}`)() as MessageFunction

  // if occured compile error, don't cache
  return !occured ? (compileCache[key] = msg) : msg
}
