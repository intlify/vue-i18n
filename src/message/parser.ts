import { SourceLocation, Position } from './location'
import { createTokenizer, Tokenizer, TokenTypes, TokenizeContext } from './tokenizer'

export const enum NodeTypes {
  Resource, // 0
  Plural,
  Message,
  Text,
  Named,
  List, // 5
  Linked,
  LinkedKey,
  LinkedModifier
}

// not containing whitespace or control characters
export type Identifier = string

export interface Node {
  type: NodeTypes
  start: number
  end: number
  loc?: SourceLocation
}

export interface ResourceNode extends Node {
  type: NodeTypes.Resource
  body: MessageNode | PluralNode
}

export interface PluralNode extends Node {
  type: NodeTypes.Plural
  cases: MessageNode[]
}

export interface MessageNode extends Node {
  type: NodeTypes.Message
  items: MessageElementNode[]
}

type MessageElementNode =
  | TextNode
  | NamedNode
  | ListNode
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

export interface LinkedNode extends Node {
  type: NodeTypes.Linked
  modifier?: LinkedModitierNode
  key: LinkedKeyNode | NamedNode | ListNode
}

export interface LinkedKeyNode extends Node {
  type: NodeTypes.LinkedKey
  value: string
}

export interface LinkedModitierNode extends Node {
  type: NodeTypes.LinkedModifier
  value: Identifier
}

type Parser = Readonly<{
  parse: (source: string) => ResourceNode
}>

export function createParser (): Parser {
  const startNode = (context: TokenizeContext, type: NodeTypes, init?: { offset: number, loc: Position }): Node => {
    let { lastOffset, lastStartLoc } = context
    if (init) {
      lastOffset = init.offset
      lastStartLoc = init.loc
    }
    return {
      type,
      start: lastOffset,
      end: -1,
      loc: { start: lastStartLoc, end: lastStartLoc }
    }
  }

  const endNode = (tokenizer: Tokenizer, node: Node, type?: NodeTypes): void => {
    node.end = tokenizer.currentOffset()
    if (type) {
      node.type = type
    }
    if (node.loc) {
      node.loc.end = tokenizer.currentPosition()
    }
  }

  const parseText = (tokenizer: Tokenizer, value: string): TextNode => {
    const context = tokenizer.context()
    const node = startNode(context, NodeTypes.Text) as TextNode
    node.value = value
    endNode(tokenizer, node)
    return node
  }

  const parseList = (tokenizer: Tokenizer, index: number): ListNode => {
    const context = tokenizer.context()
    const node = startNode(context, NodeTypes.List) as ListNode
    node.index = index
    // skip brach right
    tokenizer.nextToken()
    endNode(tokenizer, node)
    return node
  }

  const parseNamed = (tokenizer: Tokenizer, key: string): NamedNode => {
    const context = tokenizer.context()
    const node = startNode(context, NodeTypes.Named) as NamedNode
    node.key = key
    // skip brach right
    tokenizer.nextToken()
    endNode(tokenizer, node)
    return node
  }

  const parseLinkedModifier = (tokenizer: Tokenizer): LinkedModitierNode => {
    const token = tokenizer.nextToken()
    // asset check token
    if (!token.value || typeof token.value === 'number') {
      // TODO: should be thrown syntax error
      throw new Error()
    }
    const context = tokenizer.context()
    const node = startNode(context, NodeTypes.LinkedModifier) as LinkedModitierNode
    node.value = token.value
    endNode(tokenizer, node)
    return node
  }

  const parseLinkedKey = (tokenizer: Tokenizer, value: string): LinkedKeyNode => {
    const context = tokenizer.context()
    const node = startNode(context, NodeTypes.LinkedKey) as LinkedKeyNode
    node.value = value
    endNode(tokenizer, node)
    return node
  }

  const parseLinked = (tokenizer: Tokenizer): LinkedNode => {
    const context = tokenizer.context()
    const linkedNode = startNode(context, NodeTypes.Linked) as LinkedNode

    let token = tokenizer.nextToken()
    if (token.type === TokenTypes.LinkedDot) {
      linkedNode.modifier = parseLinkedModifier(tokenizer)
      token = tokenizer.nextToken()
    }

    // asset check token
    if (token.type !== TokenTypes.LinkedDelimiter) {
      // TODO: should be thrown syntax error
      throw new Error()
    }
    token = tokenizer.nextToken()

    // skip paren left
    if (token.type === TokenTypes.ParenLeft) {
      token = tokenizer.nextToken()
    }

    // skip brace left
    if (token.type === TokenTypes.BraceLeft) {
      token = tokenizer.nextToken()
    }

    switch (token.type) {
      case TokenTypes.LinkedKey:
        if (!token.value || typeof token.value !== 'string') {
          // TODO: should be thrown syntax error
          throw new Error()
        }
        linkedNode.key = parseLinkedKey(tokenizer, token.value)
        break
      case TokenTypes.Named:
        if (!token.value || typeof token.value === 'number') {
          // TODO: should be thrown syntax error
          throw new Error()
        }
        linkedNode.key = parseNamed(tokenizer, token.value)
        break
      case TokenTypes.List:
        if (token.value === undefined || typeof token.value === 'string') {
          // TODO: should be thrown syntax error
          throw new Error()
        }
        linkedNode.key = parseList(tokenizer, token.value)
        break
      default:
        // TODO: should be thrown syntax error
        throw new Error()
    }

    endNode(tokenizer, linkedNode)
    return linkedNode
  }

  const parseMessage = (tokenizer: Tokenizer): MessageNode => {
    const context = tokenizer.context()
    const node = startNode(context, NodeTypes.Message) as MessageNode
    node.items = []

    do {
      const token = tokenizer.nextToken()
      switch (token.type) {
        case TokenTypes.Text:
          if (!token.value || typeof token.value === 'number') {
            // TODO: should be thrown syntax error
            throw new Error()
          }
          node.items.push(parseText(tokenizer, token.value))
          break
        case TokenTypes.List:
          if (token.value === undefined || typeof token.value === 'string') {
            // TODO: should be thrown syntax error
            throw new Error()
          }
          node.items.push(parseList(tokenizer, token.value))
          break
        case TokenTypes.Named:
          if (!token.value || typeof token.value === 'number') {
            // TODO: should be thrown syntax error
            throw new Error()
          }
          node.items.push(parseNamed(tokenizer, token.value))
          break
        case TokenTypes.LinkedAlias:
          node.items.push(parseLinked(tokenizer))
          break
        default:
          break
      }
    } while (context.currentType !== TokenTypes.EOF && context.currentType !== TokenTypes.Pipe)

    endNode(tokenizer, node)
    return node
  }

  const parsePlural = (tokenizer: Tokenizer, offset: number, loc: Position, msgNode: MessageNode): PluralNode => {
    const context = tokenizer.context()

    const node = startNode(context, NodeTypes.Plural, { offset, loc }) as PluralNode
    node.cases = []
    node.cases.push(msgNode)

    do {
      const msg = parseMessage(tokenizer)
      node.cases.push(msg)
    } while (context.currentType !== TokenTypes.EOF)

    endNode(tokenizer, node)
    return node
  }

  const parseResource = (tokenizer: Tokenizer): MessageNode | PluralNode => {
    const context = tokenizer.context()
    const { offset, startLoc } = context

    const msgNode = parseMessage(tokenizer)
    if (context.currentType === TokenTypes.EOF) {
      return msgNode
    } else {
      return parsePlural(tokenizer, offset, startLoc, msgNode)
    }
  }

  function parse (source: string): ResourceNode {
    const tokenizer = createTokenizer(source)
    const context = tokenizer.context()

    const node = startNode(context, NodeTypes.Resource) as ResourceNode
    node.body = parseResource(tokenizer)

    // assert wheather achieved to EOF
    if (context.currentType !== TokenTypes.EOF) {
      // TODO: should be thrown syntax error
      throw new Error()
    }

    endNode(tokenizer, node)
    return node
  }

  return Object.freeze({
    parse
  })
}
