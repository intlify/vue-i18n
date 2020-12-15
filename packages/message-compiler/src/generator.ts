import { isString } from '@intlify/shared'
import { SourceMapGenerator, RawSourceMap } from 'source-map'
import {
  ResourceNode,
  Node,
  NodeTypes,
  PluralNode,
  MessageNode,
  TextNode,
  ListNode,
  NamedNode,
  LinkedNode,
  LinkedKeyNode,
  LinkedModitierNode,
  LiteralNode
} from './parser'
import { Position, LocationStub } from './location'
import { CodeGenOptions } from './options'
import { HelperNameMap } from './helpers'

export interface CodeGenResult {
  code: string
  ast: ResourceNode
  map?: RawSourceMap
}

type CodeGenContext = {
  source: string
  code: string
  indentLevel: number
  filename: string
  line: number
  breakLineCode: string
  needIndent: boolean
  column: number
  offset: number
  map?: SourceMapGenerator
}

type CodeGenNode =
  | TextNode
  | NamedNode
  | ListNode
  | LiteralNode
  | LinkedKeyNode
  | LinkedModitierNode

type CodeGenerator = {
  context(): CodeGenContext
  push(code: string, node?: CodeGenNode): void
  indent(withNewLine?: boolean): void
  deindent(withNewLine?: boolean): void
  newline(): void
  helper(key: string): string
  needIndent(): boolean
}

function createCodeGenerator(
  ast: ResourceNode,
  options: CodeGenOptions
): CodeGenerator {
  const {
    sourceMap,
    filename,
    breakLineCode,
    needIndent: _needIndent
  } = options
  const _context = {
    source: ast.loc!.source,
    filename,
    code: '',
    column: 1,
    line: 1,
    offset: 0,
    map: undefined,
    breakLineCode,
    needIndent: _needIndent,
    indentLevel: 0
  } as CodeGenContext

  const context = (): CodeGenContext => _context

  function push(code: string, node?: CodeGenNode): void {
    _context.code += code
    if (!__BROWSER__ && _context.map) {
      if (node && node.loc && node.loc !== LocationStub) {
        addMapping(node.loc.start, getMappingName(node))
      }
      advancePositionWithSource(_context, code)
    }
  }

  function _newline(n: number, withBreakLine = true): void {
    const _breakLineCode = withBreakLine ? breakLineCode : ''
    push(_needIndent ? _breakLineCode! + `  `.repeat(n) : _breakLineCode!)
  }

  function indent(withNewLine = true): void {
    const level = ++_context.indentLevel
    withNewLine && _newline(level)
  }

  function deindent(withNewLine = true): void {
    const level = --_context.indentLevel
    withNewLine && _newline(level)
  }

  function newline(): void {
    _newline(_context.indentLevel)
  }

  const helper = (key: string): string => `_${key}`
  const needIndent = (): boolean => _context.needIndent

  function addMapping(loc: Position, name?: string) {
    _context.map!.addMapping({
      name,
      source: _context.filename,
      original: {
        line: loc.line,
        column: loc.column - 1
      },
      generated: {
        line: _context.line,
        column: _context.column - 1
      }
    })
  }

  if (!__BROWSER__ && sourceMap) {
    _context.map = new SourceMapGenerator()
    _context.map!.setSourceContent(filename!, _context.source)
  }

  return {
    context,
    push,
    indent,
    deindent,
    newline,
    helper,
    needIndent
  }
}

function generateLinkedNode(generator: CodeGenerator, node: LinkedNode): void {
  const { helper } = generator
  generator.push(`${helper(HelperNameMap.LINKED)}(`)
  generateNode(generator, node.key)
  if (node.modifier) {
    generator.push(`, `)
    generateNode(generator, node.modifier)
  }
  generator.push(`)`)
}

function generateMessageNode(
  generator: CodeGenerator,
  node: MessageNode
): void {
  const { helper, needIndent } = generator
  generator.push(`${helper(HelperNameMap.NORMALIZE)}([`)
  generator.indent(needIndent())
  const length = node.items.length
  for (let i = 0; i < length; i++) {
    generateNode(generator, node.items[i])
    if (i === length - 1) {
      break
    }
    generator.push(', ')
  }
  generator.deindent(needIndent())
  generator.push('])')
}

function generatePluralNode(generator: CodeGenerator, node: PluralNode): void {
  const { helper, needIndent } = generator
  if (node.cases.length > 1) {
    generator.push(`${helper(HelperNameMap.PLURAL)}([`)
    generator.indent(needIndent())
    const length = node.cases.length
    for (let i = 0; i < length; i++) {
      generateNode(generator, node.cases[i])
      if (i === length - 1) {
        break
      }
      generator.push(', ')
    }
    generator.deindent(needIndent())
    generator.push(`])`)
  }
}

function generateResource(generator: CodeGenerator, node: ResourceNode): void {
  if (node.body) {
    generateNode(generator, node.body)
  } else {
    generator.push('null')
  }
}

function generateNode(generator: CodeGenerator, node: Node): void {
  const { helper } = generator
  switch (node.type) {
    case NodeTypes.Resource:
      generateResource(generator, node as ResourceNode)
      break
    case NodeTypes.Plural:
      generatePluralNode(generator, node as PluralNode)
      break
    case NodeTypes.Message:
      generateMessageNode(generator, node as MessageNode)
      break
    case NodeTypes.Linked:
      generateLinkedNode(generator, node as LinkedNode)
      break
    case NodeTypes.LinkedModifier:
      generator.push(
        JSON.stringify((node as LinkedModitierNode).value),
        node as LinkedModitierNode
      )
      break
    case NodeTypes.LinkedKey:
      generator.push(
        JSON.stringify((node as LinkedKeyNode).value),
        node as LinkedKeyNode
      )
      break
    case NodeTypes.List:
      generator.push(
        `${helper(HelperNameMap.INTERPOLATE)}(${helper(HelperNameMap.LIST)}(${
          (node as ListNode).index
        }))`,
        node as ListNode
      )
      break
    case NodeTypes.Named:
      generator.push(
        `${helper(HelperNameMap.INTERPOLATE)}(${helper(
          HelperNameMap.NAMED
        )}(${JSON.stringify((node as NamedNode).key)}))`,
        node as NamedNode
      )
      break
    case NodeTypes.Literal:
      generator.push(
        JSON.stringify((node as LiteralNode).value),
        node as LiteralNode
      )
      break
    case NodeTypes.Text:
      generator.push(JSON.stringify((node as TextNode).value), node as TextNode)
      break
    default:
      if (__DEV__) {
        throw new Error(`unhandled codegen node type: ${node.type}`)
      }
  }
}

// generate code from AST
export const generate = (
  ast: ResourceNode,
  options: CodeGenOptions = {} // eslint-disable-line
): CodeGenResult => {
  const mode = isString(options.mode) ? options.mode : 'normal'
  const filename = isString(options.filename)
    ? options.filename
    : 'message.intl'
  const sourceMap = !!options.sourceMap
  // prettier-ignore
  const breakLineCode = options.breakLineCode != null
    ? options.breakLineCode
    : mode === 'arrow'
      ? ';'
      : '\n'
  const needIndent = options.needIndent ? options.needIndent : mode !== 'arrow'
  const helpers = ast.helpers || []
  const generator = createCodeGenerator(ast, {
    mode,
    filename,
    sourceMap,
    breakLineCode,
    needIndent
  })

  generator.push(mode === 'normal' ? `function __msg__ (ctx) {` : `(ctx) => {`)
  generator.indent(needIndent)

  if (helpers.length > 0) {
    generator.push(
      `const { ${helpers.map(s => `${s}: _${s}`).join(', ')} } = ctx`
    )
    generator.newline()
  }

  generator.push(`return `)
  generateNode(generator, ast)
  generator.deindent(needIndent)
  generator.push(`}`)

  const { code, map } = generator.context()
  return {
    ast,
    code,
    map: map ? (map as any).toJSON() : undefined // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

function getMappingName(node: CodeGenNode): string | undefined {
  switch (node.type) {
    case NodeTypes.Text:
      return node.value
    case NodeTypes.List:
      return node.index.toString()
    case NodeTypes.Named:
      return node.key
    case NodeTypes.Literal:
      return node.value
    case NodeTypes.LinkedModifier:
      return node.value
    case NodeTypes.LinkedKey:
      return node.value
    default:
      return undefined
  }
}

function advancePositionWithSource(
  pos: Position,
  source: string,
  numberOfCharacters: number = source.length
): Position {
  let linesCount = 0
  let lastNewLinePos = -1
  for (let i = 0; i < numberOfCharacters; i++) {
    if (source.charCodeAt(i) === 10 /* newline char code */) {
      linesCount++
      lastNewLinePos = i
    }
  }

  pos.offset += numberOfCharacters
  pos.line += linesCount
  pos.column =
    lastNewLinePos === -1
      ? pos.column + numberOfCharacters
      : numberOfCharacters - lastNewLinePos

  return pos
}
