import { createParser, ResourceNode, Node, NodeTypes } from './parser'

type CodeGenContext = {
  source?: string
  code: string
  indentLevel: number
  // line: number
  // column: number
  // offset: number
  // map?: SourceMapGenerator
}

type CodeGenerator = Readonly<{
  context: () => CodeGenContext
  push: (code: string) => void
  indent: () => void
  deindent: (withoutNewLine?: boolean) => void
  newline: () => void
}>

function createCodeGenerator (source?: string): CodeGenerator {
  const _context = {
    source,
    code: '',
    indentLevel: 0
  } as CodeGenContext

  const context = (): CodeGenContext => _context

  const push = (code: string): void => {
    _context.code += code
  }

  const _newline = (n: number): void => {
    push('\n' + `  `.repeat(n))
  }

  const indent = (): void => {
    _newline(++_context.indentLevel)
  }

  const deindent = (withoutNewLine?: boolean): void => {
    if (withoutNewLine) {
      --_context.indentLevel
    } else {
      _newline(--_context.indentLevel)
    }
  }

  const newline = (): void => {
    _newline(_context.indentLevel)
  }

  return Object.freeze({
    context, push, indent, deindent, newline
  })
}

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

  const generateNode = (generator: CodeGenerator, node: Node): void => {
    generator.push(`''`)
    /*
    switch (node.type) {
      default:
        // TODO: should be handled with error
        throw new Error(`unhandled codegen node type: ${node.type}`)
    }
    */
  }

  // generate code from AST
  const generate = (ast: ResourceNode, options: CompileOptions): string => {
    const generator = createCodeGenerator(ast.loc && ast.loc.source)
    generator.push(`function __msg__ (ctx) {`)
    generator.indent()
    generator.push('return ')
    generateNode(generator, ast)
    generator.deindent()
    generator.push(`}`)
    return generator.context().code
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
