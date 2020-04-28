import { createLocation, SourceLocation, Position } from './location'
import { ParserOptions } from './options'
import { createCompileError, CompileErrorCodes } from './errors'
import { createTokenizer, Tokenizer, TokenTypes } from './tokenizer'

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
  start: number
  end: number
  loc?: SourceLocation
}

export interface ResourceNode extends Node {
  type: NodeTypes.Resource
  body: MessageNode | PluralNode
  needInterpolate?: boolean
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
  modifier?: LinkedModitierNode
  key: LinkedKeyNode | NamedNode | ListNode | LiteralNode
}

export interface LinkedKeyNode extends Node {
  type: NodeTypes.LinkedKey
  value: string
}

export interface LinkedModitierNode extends Node {
  type: NodeTypes.LinkedModifier
  value: Identifier
}

export type Parser = Readonly<{
  parse: (source: string) => ResourceNode
}>

export const ERROR_DOMAIN = 'parser'

export function createParser(options: ParserOptions = {}): Parser {
  const location = !options.location

  const { onError } = options
  // TODO: This code should be removed with using rollup (`/*#__PURE__*/`)
  const emitError = (
    tokenzer: Tokenizer,
    code: CompileErrorCodes,
    start: Position,
    offset: number,
    ...args: unknown[]
  ): void => {
    const end = tokenzer.currentPosition()
    end.offset += offset
    end.column += offset
    if (onError) {
      const loc = createLocation(start, end)
      const err = createCompileError(code, loc, {
        domain: ERROR_DOMAIN,
        args
      })
      onError(err)
    }
  }

  const startNode = (type: NodeTypes, offset: number, loc: Position): Node => {
    const node = {
      type,
      start: offset,
      end: offset
    } as Node

    if (location) {
      node.loc = { start: loc, end: loc }
    }

    return node
  }

  const endNode = (
    node: Node,
    offset: number,
    pos: Position,
    type?: NodeTypes
  ): void => {
    node.end = offset

    if (type) {
      node.type = type
    }

    if (location && node.loc) {
      node.loc.end = pos
    }
  }

  const parseText = (tokenizer: Tokenizer, value: string): TextNode => {
    const context = tokenizer.context()
    const node = startNode(
      NodeTypes.Text,
      context.offset,
      context.startLoc
    ) as TextNode
    node.value = value
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition())
    return node
  }

  const parseList = (tokenizer: Tokenizer, index: string): ListNode => {
    const context = tokenizer.context()
    const { lastOffset: offset, lastStartLoc: loc } = context // get brace left loc
    const node = startNode(NodeTypes.List, offset, loc) as ListNode
    node.index = parseInt(index, 10)
    tokenizer.nextToken() // skip brach right
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition())
    return node
  }

  const parseNamed = (tokenizer: Tokenizer, key: string): NamedNode => {
    const context = tokenizer.context()
    const { lastOffset: offset, lastStartLoc: loc } = context // get brace left loc
    const node = startNode(NodeTypes.Named, offset, loc) as NamedNode
    node.key = key
    tokenizer.nextToken() // skip brach right
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition())
    return node
  }

  const parseLiteral = (tokenizer: Tokenizer, value: string): LiteralNode => {
    const context = tokenizer.context()
    const { lastOffset: offset, lastStartLoc: loc } = context // get brace left loc
    const node = startNode(NodeTypes.Literal, offset, loc) as LiteralNode
    node.value = value
    tokenizer.nextToken() // skip brach right
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition())
    return node
  }

  const parseLinkedModifier = (tokenizer: Tokenizer): LinkedModitierNode => {
    const token = tokenizer.nextToken()
    // check token
    if (!token.value || typeof token.value === 'number') {
      // TODO: should be thrown syntax error
      throw new Error()
    }
    const context = tokenizer.context()
    const { lastOffset: offset, lastStartLoc: loc } = context // get linked dot loc
    const node = startNode(
      NodeTypes.LinkedModifier,
      offset,
      loc
    ) as LinkedModitierNode
    node.value = token.value
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition())
    return node
  }

  const parseLinkedKey = (
    tokenizer: Tokenizer,
    value: string
  ): LinkedKeyNode => {
    const context = tokenizer.context()
    const node = startNode(
      NodeTypes.LinkedKey,
      context.offset,
      context.startLoc
    ) as LinkedKeyNode
    node.value = value
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition())
    return node
  }

  const parseLinked = (tokenizer: Tokenizer): LinkedNode => {
    const context = tokenizer.context()
    const linkedNode = startNode(
      NodeTypes.Linked,
      context.offset,
      context.startLoc
    ) as LinkedNode

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

    // skip brace left
    if (token.type === TokenTypes.BraceLeft) {
      token = tokenizer.nextToken()
    }

    switch (token.type) {
      case TokenTypes.LinkedKey:
        if (token.value == null) {
          // TODO: should be thrown syntax error
          throw new Error()
        }
        linkedNode.key = parseLinkedKey(tokenizer, token.value)
        break
      case TokenTypes.Named:
        if (token.value == null) {
          // TODO: should be thrown syntax error
          throw new Error()
        }
        linkedNode.key = parseNamed(tokenizer, token.value)
        break
      case TokenTypes.List:
        if (token.value == null) {
          // TODO: should be thrown syntax error
          throw new Error()
        }
        linkedNode.key = parseList(tokenizer, token.value)
        break
      case TokenTypes.Literal:
        if (token.value == null) {
          // TODO: should be thrown syntax error
          throw new Error()
        }
        linkedNode.key = parseLiteral(tokenizer, token.value)
        break
      default:
        // TODO: should be thrown syntax error
        throw new Error()
    }

    endNode(linkedNode, tokenizer.currentOffset(), tokenizer.currentPosition())
    return linkedNode
  }

  const parseMessage = (tokenizer: Tokenizer): MessageNode => {
    const context = tokenizer.context()
    const startOffset =
      context.currentType === TokenTypes.Pipe
        ? tokenizer.currentOffset()
        : context.offset
    const startLoc =
      context.currentType === TokenTypes.Pipe
        ? context.endLoc
        : context.startLoc
    const node = startNode(
      NodeTypes.Message,
      startOffset,
      startLoc
    ) as MessageNode
    node.items = []

    do {
      const token = tokenizer.nextToken()
      switch (token.type) {
        case TokenTypes.Text:
          if (token.value == null) {
            // TODO: should be thrown syntax error
            throw new Error()
          }
          node.items.push(parseText(tokenizer, token.value))
          break
        case TokenTypes.List:
          if (token.value == null) {
            // TODO: should be thrown syntax error
            throw new Error()
          }
          node.items.push(parseList(tokenizer, token.value))
          break
        case TokenTypes.Named:
          if (token.value == null) {
            // TODO: should be thrown syntax error
            throw new Error()
          }
          node.items.push(parseNamed(tokenizer, token.value))
          break
        case TokenTypes.Literal:
          if (token.value == null) {
            // TODO: should be thrown syntax error
            throw new Error()
          }
          node.items.push(parseLiteral(tokenizer, token.value))
          break
        case TokenTypes.LinkedAlias:
          node.items.push(parseLinked(tokenizer))
          break
        default:
          break
      }
    } while (
      context.currentType !== TokenTypes.EOF &&
      context.currentType !== TokenTypes.Pipe
    )

    // adjust message node loc
    const endOffset =
      context.currentType === TokenTypes.Pipe
        ? context.lastOffset
        : tokenizer.currentOffset()
    const endLoc =
      context.currentType === TokenTypes.Pipe
        ? context.lastEndLoc
        : tokenizer.currentPosition()

    endNode(node, endOffset, endLoc)
    return node
  }

  const parsePlural = (
    tokenizer: Tokenizer,
    offset: number,
    loc: Position,
    msgNode: MessageNode
  ): PluralNode => {
    const context = tokenizer.context()
    let hasEmptyMessage = msgNode.items.length === 0

    const node = startNode(NodeTypes.Plural, offset, loc) as PluralNode
    node.cases = []
    node.cases.push(msgNode)

    do {
      const msg = parseMessage(tokenizer)
      if (!hasEmptyMessage) {
        hasEmptyMessage = msg.items.length === 0
      }
      node.cases.push(msg)
    } while (context.currentType !== TokenTypes.EOF)

    if (hasEmptyMessage) {
      emitError(
        tokenizer,
        CompileErrorCodes.P_MUST_HAVE_MESSAGES_IN_PLURAL,
        loc,
        0
      )
    }

    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition())
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

  function parse(source: string): ResourceNode {
    const tokenizer = createTokenizer(source, { ...options })
    const context = tokenizer.context()

    const node = startNode(
      NodeTypes.Resource,
      context.offset,
      context.startLoc
    ) as ResourceNode
    node.body = parseResource(tokenizer)

    // assert wheather achieved to EOF
    if (context.currentType !== TokenTypes.EOF) {
      // TODO: should be thrown syntax error
      throw new Error()
    }

    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition())
    return node
  }

  return { parse }
}
