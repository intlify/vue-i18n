import { SourceLocation } from './location'
import { createTokenizer } from './tokenizer'

export const enum NodeTypes {
  RESOURCE,
  LITERAL,
  NAMED,
  LIST,
  PLURAL,
  LINKED,
  FUNCTION
}

// not containing whitespace or control characters
export type Identifier = string

export interface Node {
  type: NodeTypes
  loc?: SourceLocation
}

type SinglePartNode =
  | LiteralNode
  | NamedNode
  | ListNode
  | LinkedNode
  | FunctionNode

type MultiPartNode = PluralNode

export interface ResourceNode extends Node {
  type: NodeTypes.RESOURCE
  body: SinglePartNode[] | MultiPartNode
}

export interface LiteralNode extends Node {
  type: NodeTypes.LITERAL
  value: string
}

export interface NamedNode extends Node {
  type: NodeTypes.NAMED
  key: Identifier
}

export interface ListNode extends Node {
  type: NodeTypes.LIST
  index: number
}

export interface PluralNode extends Node {
  type: NodeTypes.PLURAL
  cases: SinglePartNode[]
}

export interface LinkedNode extends Node {
  type: NodeTypes.LINKED
  key: Identifier | NamedNode | ListNode
}

export interface FunctionNode extends Node {
  type: NodeTypes.FUNCTION
  name: Identifier
  key: Identifier
  args?: Identifier[]
}

type Parser = Readonly<{
  parse: (source: string) => Node[]
}>

export function createParser (): Parser {
  function parse (source: string): Node[] {
    const tokenizer = createTokenizer(source)
    const tokens = tokenizer.parse(source)
    console.log(tokens)
    return []
  }

  return Object.freeze({
    parse
  })
}
