import { CompileOptions } from './options'
import { createParser, ResourceNode } from './parser'
import { transform } from './transformer'
import { generate } from './generator'

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
  // const onError = options.onError || defaultOnError
  const onCacheKey = options.onCacheKey || defaultOnCacheKey

  // check caches
  const key = onCacheKey(source)
  const cached = compileCache[key]
  if (cached) {
    return cached
  }

  // parse source codes
  const parser = createParser({ ...options })
  const ast = parser.parse(source)

  // transform ASTs
  transform(ast, { ...options })

  // generate javascript codes
  const code = generate(ast, { ...options })

  const msg = new Function(`return ${code}`)() as MessageFunction
  return (compileCache[key] = msg)
}
