import { createParser, ResourceNode } from './parser'

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

export function createCompiler (): Compiler {
  const _parser = createParser()

  // transform AST
  const transform = (ast: ResourceNode, options: CompileOptions): void => {
    // TODO:
  }

  // generate code
  const generate = (ast: ResourceNode, options: CompileOptions): string => {
    // TODO:
    return ''
  }

  const compile = (source: string, options: CompileOptions = {}): CompileResult => {
    const ast = _parser.parse(source)
    transform(ast, options)
    const code = generate(ast, options)
    return { code, ast }
  }

  return Object.freeze({
    compile
  })
}
