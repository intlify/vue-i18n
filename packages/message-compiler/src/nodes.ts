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
  start?: number
  end?: number
  loc?: SourceLocation
}

export interface ResourceNode extends Node {
  type: NodeTypes.Resource
  body: MessageNode | PluralNode
  cacheKey?: string
  helpers?: string[]
}

export interface PluralNode extends Node {
  type: NodeTypes.Plural
  cases: MessageNode[]
}

export interface MessageNode extends Node {
  type: NodeTypes.Message
  static?: string
  items: MessageElementNode[]
}

type MessageElementNode =
  | TextNode
  | NamedNode
  | ListNode
  | LiteralNode
  | LinkedNode

export interface TextNode extends Node {
  type: NodeTypes.Text
  value: string
}

export interface NamedNode extends Node {
  type: NodeTypes.Named
  key: Identifier
}

export interface ListNode extends Node {
  type: NodeTypes.List
  index: number
}

export interface LiteralNode extends Node {
  type: NodeTypes.Literal
  value: string
}

export interface LinkedNode extends Node {
  type: NodeTypes.Linked
  modifier?: LinkedModifierNode
  key: LinkedKeyNode | NamedNode | ListNode | LiteralNode
}

export interface LinkedKeyNode extends Node {
  type: NodeTypes.LinkedKey
  value: string
}

export interface LinkedModifierNode extends Node {
  type: NodeTypes.LinkedModifier
  value: Identifier
}
