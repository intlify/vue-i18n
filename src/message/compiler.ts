import { createParser, ResourceNode } from './parser'
import { transform } from './transformer'
import { generate } from './generator'

export type CompileOptions = {
  // TODO: should be defined some options
  // Generate source map?
  // - Default: false
  // sourceMap?: boolean
  // Filename for source map generation.
  // - Default: `message.intl`
  // filename?: string
}

export type CompileResult = {
  code: string
  ast: ResourceNode
  // TODO: should be implemetend sourcemap
  // map?: RawSourceMap
}

export type Compiler = Readonly<{
  compile: (source: string, options?: CompileOptions) => CompileResult
}>

export type MessageFunction = (ctx: unknown) => string

export function createCompiler (): Compiler {
  const _parser = createParser()

  const compile = (source: string, options: CompileOptions = {}): CompileResult => {
    const ast = _parser.parse(source)
    transform(ast)
    const code = generate(ast)
    return { code, ast }
  }

  return Object.freeze({
    compile
  })
}

const compileCache: Record<string, MessageFunction> = Object.create(null)
const compiler = createCompiler()

export function compile (source: string, options: CompileOptions = {}): MessageFunction {
  const { code } = compiler.compile(source, options)
  const msg = new Function(`return ${code}`)() as MessageFunction
  return (compileCache[source] = msg)
}
