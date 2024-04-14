import { SourceLocation } from './location'

export const enum NodeTypes {
  Resource, // 0
  Plural,
  Message,
  Text,
  Named,
  List, // 5
  Linked,
  LinkedKey,
  LinkedModifier,
  Literal
}

// not containing whitespace or control characters
export type Identifier = string

export interface Node {
  type: NodeTypes
  /**
   * @internal `type` alias
   */
  t?: NodeTypes
  start?: number
  end?: number
  loc?: SourceLocation
}

export interface ResourceNode extends Node {
  type: NodeTypes.Resource
  body: MessageNode | PluralNode
  /**
   * @internal `body` alias
   */
  b?: MessageNode | PluralNode
  cacheKey?: string
  helpers?: string[]
}

export interface PluralNode extends Node {
  type: NodeTypes.Plural
  cases: MessageNode[]
  /**
   * @internal `cases` alias
   */
  c?: MessageNode[]
}

export interface MessageNode extends Node {
  type: NodeTypes.Message
  static?: string
  /**
   * @internal `static` alias
   */
  s?: string
  items: MessageElementNode[]
  /**
   * @internal `items` alias
   */
  i?: MessageElementNode[]
}

type MessageElementNode =
  | TextNode
  | NamedNode
  | ListNode
  | LiteralNode
  | LinkedNode

export interface TextNode extends Node {
  type: NodeTypes.Text
  value?: string
  /**
   * @internal `value` alias
   */
  v?: string
}

export interface NamedNode extends Node {
  type: NodeTypes.Named
  key: Identifier
  modulo?: boolean
  /**
   * @internal `key` alias
   */
  k?: Identifier
}

export interface ListNode extends Node {
  type: NodeTypes.List
  index: number
  /**
   * @internal `index` alias
   */
  i?: number
}

export interface LiteralNode extends Node {
  type: NodeTypes.Literal
  value?: string
  /**
   * @internal `value` alias
   */
  v?: string
}

export interface LinkedNode extends Node {
  type: NodeTypes.Linked
  modifier?: LinkedModifierNode
  /**
   * @internal `modifier` alias
   */
  m?: LinkedModifierNode
  key: LinkedKeyNode | NamedNode | ListNode | LiteralNode
  /**
   * @internal `key` alias
   */
  k?: LinkedKeyNode | NamedNode | ListNode | LiteralNode
}

export interface LinkedKeyNode extends Node {
  type: NodeTypes.LinkedKey
  value: string
  /**
   * @internal `value` alias
   */
  v?: string
}

export interface LinkedModifierNode extends Node {
  type: NodeTypes.LinkedModifier
  value: Identifier
  /**
   * @internal `value` alias
   */
  v?: Identifier
}
