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

export type Compiler = Readonly<{
  compile: (source: string, options?: CompileOptions) => CompileResult
}>

export type MessageFunction = (ctx: unknown) => unknown

export function createCompiler(): Compiler {
  const _parser = createParser()

  const compile = (
    source: string /*,
    options: CompileOptions = {}*/
  ): CompileResult => {
    const ast = _parser.parse(source)
    transform(ast)
    const code = generate(ast)
    return { code, ast }
  }

  return { compile }
}

const compileCache: Record<string, MessageFunction> = Object.create(null)
const compiler = createCompiler()

export function compile(
  source: string,
  options: CompileOptions = {}
): MessageFunction {
  const { code } = compiler.compile(source, options)
  const msg = new Function(`return ${code}`)() as MessageFunction
  return (compileCache[source] = msg)
}
