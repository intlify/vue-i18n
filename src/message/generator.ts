import { ResourceNode, Node, NodeTypes, PluralNode, MessageNode, TextNode, ListNode, NamedNode } from './parser'

export const INTERPOLATE_CODE = `const interpolate = val => { return val == null ? "" : Array.isArray(val) || ((Object.prototype.toString.call(val) === "[object Object]") && val.toString === Object.prototype.toString) ? JSON.stringify(val, null, 2) : String(val) }`

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

function generateMessageNode (generator: CodeGenerator, node: MessageNode): void {
  if (node.items.length > 1) {
    generator.push('[')
    generator.indent()
    for (let i = 0; i < node.items.length; i++) {
      generateNode(generator, node.items[i])
      generator.push(', ')
    }
    generator.push('""')
    generator.deindent()
    generator.push('].join("")')
  } else {
    generateNode(generator, node.items[0])
  }
}

function generatePluralNode (generator: CodeGenerator, node: PluralNode): void {
  if (node.cases.length > 1) {
    generator.push('[')
    generator.indent()
    for (let i = 0; i < node.cases.length; i++) {
      generateNode(generator, node.cases[i])
      generator.push(', ')
    }
    generator.push('""')
    generator.deindent()
    generator.push('].join("")')
  }
}

function generateResource (generator: CodeGenerator, node: ResourceNode): void {
  if (node.body) {
    generateNode(generator, node.body)
  } else {
    generator.push('null')
  }
}

function generateNode (generator: CodeGenerator, node: Node): void {
  switch (node.type) {
    case NodeTypes.Resource:
      generateResource(generator, (node as ResourceNode))
      break
    case NodeTypes.Plural:
      generatePluralNode(generator, (node as PluralNode))
      break
    case NodeTypes.Message:
      generateMessageNode(generator, (node as MessageNode))
      break
    case NodeTypes.List:
      generator.push(`interpolate(ctx.list[${(node as ListNode).index}])`)
      break
    case NodeTypes.Named:
      generator.push(`interpolate(ctx.named.${(node as NamedNode).key})`)
      break
    case NodeTypes.Text:
      generator.push(JSON.stringify((node as TextNode).value))
      break
    default:
      // TODO: should be handled with error
      throw new Error(`unhandled codegen node type: ${node.type}`)
  }
}

// generate code from AST
export const generate = (ast: ResourceNode): string => {
  const generator = createCodeGenerator(ast.loc && ast.loc.source)
  generator.push(`function __msg__ (ctx) {`)
  generator.indent()
  if (ast.needInterpolate) {
    generator.push(INTERPOLATE_CODE)
    generator.newline()
  }
  generator.push(`return `)
  generateNode(generator, ast)
  generator.deindent()
  generator.push(`}`)
  return generator.context().code
}
