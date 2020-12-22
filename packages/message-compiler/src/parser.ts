import { Position, createLocation, SourceLocation } from './location'
import { ParserOptions } from './options'
import { createCompileError, CompileErrorCodes } from './errors'
import { Tokenizer, createTokenizer, TokenTypes, Token } from './tokenizer'

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
  helpers?: string[]
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

export interface Parser {
  parse(source: string): ResourceNode
}

export const ERROR_DOMAIN = 'parser'

// Backslash backslash, backslash quote, uHHHH, UHHHHHH.
const KNOWN_ESCAPES = /(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g

function fromEscapeSequence(
  match: string,
  codePoint4: string,
  codePoint6: string
): string {
  switch (match) {
    case `\\\\`:
      return `\\`
    case `\\\'`:
      return `\'`
    default: {
      const codePoint = parseInt(codePoint4 || codePoint6, 16)
      if (codePoint <= 0xd7ff || codePoint >= 0xe000) {
        return String.fromCodePoint(codePoint)
      }
      // invalid ...
      // Replace them with U+FFFD REPLACEMENT CHARACTER.
      return '�'
    }
  }
}

export function createParser(options: ParserOptions = {}): Parser {
  const location = options.location !== false

  const { onError } = options
  function emitError(
    tokenzer: Tokenizer,
    code: CompileErrorCodes,
    start: Position,
    offset: number,
    ...args: unknown[]
  ): void {
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

  function startNode(type: NodeTypes, offset: number, loc: Position): Node {
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

  function endNode(
    node: Node,
    offset: number,
    pos: Position,
    type?: NodeTypes
  ): void {
    node.end = offset

    if (type) {
      node.type = type
    }

    if (location && node.loc) {
      node.loc.end = pos
    }
  }

  function parseText(tokenizer: Tokenizer, value: string): TextNode {
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

  function parseList(tokenizer: Tokenizer, index: string): ListNode {
    const context = tokenizer.context()
    const { lastOffset: offset, lastStartLoc: loc } = context // get brace left loc
    const node = startNode(NodeTypes.List, offset, loc) as ListNode
    node.index = parseInt(index, 10)
    tokenizer.nextToken() // skip brach right
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition())
    return node
  }

  function parseNamed(tokenizer: Tokenizer, key: string): NamedNode {
    const context = tokenizer.context()
    const { lastOffset: offset, lastStartLoc: loc } = context // get brace left loc
    const node = startNode(NodeTypes.Named, offset, loc) as NamedNode
    node.key = key
    tokenizer.nextToken() // skip brach right
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition())
    return node
  }

  function parseLiteral(tokenizer: Tokenizer, value: string): LiteralNode {
    const context = tokenizer.context()
    const { lastOffset: offset, lastStartLoc: loc } = context // get brace left loc
    const node = startNode(NodeTypes.Literal, offset, loc) as LiteralNode
    node.value = value.replace(KNOWN_ESCAPES, fromEscapeSequence)
    tokenizer.nextToken() // skip brach right
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition())
    return node
  }

  function parseLinkedModifier(
    tokenizer: Tokenizer
  ): {
    nextConsumeToken?: Token
    node: LinkedModifierNode
  } {
    const token = tokenizer.nextToken()
    const context = tokenizer.context()
    const { lastOffset: offset, lastStartLoc: loc } = context // get linked dot loc
    const node = startNode(
      NodeTypes.LinkedModifier,
      offset,
      loc
    ) as LinkedModifierNode
    if (token.type !== TokenTypes.LinkedModifier) {
      // empty modifier
      emitError(
        tokenizer,
        CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_MODIFIER,
        context.lastStartLoc,
        0
      )
      node.value = ''
      endNode(node, offset, loc)
      return {
        nextConsumeToken: token,
        node
      }
    }
    // check token
    if (token.value == null) {
      emitError(
        tokenizer,
        CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS,
        context.lastStartLoc,
        0,
        getTokenCaption(token)
      )
    }
    node.value = token.value || ''
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition())
    return {
      node
    }
  }

  function parseLinkedKey(tokenizer: Tokenizer, value: string): LinkedKeyNode {
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

  function parseLinked(
    tokenizer: Tokenizer
  ): {
    nextConsumeToken?: Token
    node: LinkedNode
  } {
    const context = tokenizer.context()
    const linkedNode = startNode(
      NodeTypes.Linked,
      context.offset,
      context.startLoc
    ) as LinkedNode

    let token = tokenizer.nextToken()
    if (token.type === TokenTypes.LinkedDot) {
      const parsed = parseLinkedModifier(tokenizer)
      linkedNode.modifier = parsed.node
      token = parsed.nextConsumeToken || tokenizer.nextToken()
    }

    // asset check token
    if (token.type !== TokenTypes.LinkedDelimiter) {
      emitError(
        tokenizer,
        CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS,
        context.lastStartLoc,
        0,
        getTokenCaption(token)
      )
    }
    token = tokenizer.nextToken()

    // skip brace left
    if (token.type === TokenTypes.BraceLeft) {
      token = tokenizer.nextToken()
    }

    switch (token.type) {
      case TokenTypes.LinkedKey:
        if (token.value == null) {
          emitError(
            tokenizer,
            CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS,
            context.lastStartLoc,
            0,
            getTokenCaption(token)
          )
        }
        linkedNode.key = parseLinkedKey(tokenizer, token.value || '')
        break
      case TokenTypes.Named:
        if (token.value == null) {
          emitError(
            tokenizer,
            CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS,
            context.lastStartLoc,
            0,
            getTokenCaption(token)
          )
        }
        linkedNode.key = parseNamed(tokenizer, token.value || '')
        break
      case TokenTypes.List:
        if (token.value == null) {
          emitError(
            tokenizer,
            CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS,
            context.lastStartLoc,
            0,
            getTokenCaption(token)
          )
        }
        linkedNode.key = parseList(tokenizer, token.value || '')
        break
      case TokenTypes.Literal:
        if (token.value == null) {
          emitError(
            tokenizer,
            CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS,
            context.lastStartLoc,
            0,
            getTokenCaption(token)
          )
        }
        linkedNode.key = parseLiteral(tokenizer, token.value || '')
        break
      default:
        // empty key
        emitError(
          tokenizer,
          CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_KEY,
          context.lastStartLoc,
          0
        )
        const nextContext = tokenizer.context()
        const emptyLinkedKeyNode = startNode(
          NodeTypes.LinkedKey,
          nextContext.offset,
          nextContext.startLoc
        ) as LinkedKeyNode
        emptyLinkedKeyNode.value = ''
        endNode(emptyLinkedKeyNode, nextContext.offset, nextContext.startLoc)
        linkedNode.key = emptyLinkedKeyNode
        endNode(linkedNode, nextContext.offset, nextContext.startLoc)
        return {
          nextConsumeToken: token,
          node: linkedNode
        }
        break
    }

    endNode(linkedNode, tokenizer.currentOffset(), tokenizer.currentPosition())
    return {
      node: linkedNode
    }
  }

  function parseMessage(tokenizer: Tokenizer): MessageNode {
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

    let nextToken: Token | null = null
    do {
      const token = nextToken || tokenizer.nextToken()
      nextToken = null
      switch (token.type) {
        case TokenTypes.Text:
          if (token.value == null) {
            emitError(
              tokenizer,
              CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS,
              context.lastStartLoc,
              0,
              getTokenCaption(token)
            )
          }
          node.items.push(parseText(tokenizer, token.value || ''))
          break
        case TokenTypes.List:
          if (token.value == null) {
            emitError(
              tokenizer,
              CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS,
              context.lastStartLoc,
              0,
              getTokenCaption(token)
            )
          }
          node.items.push(parseList(tokenizer, token.value || ''))
          break
        case TokenTypes.Named:
          if (token.value == null) {
            emitError(
              tokenizer,
              CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS,
              context.lastStartLoc,
              0,
              getTokenCaption(token)
            )
          }
          node.items.push(parseNamed(tokenizer, token.value || ''))
          break
        case TokenTypes.Literal:
          if (token.value == null) {
            emitError(
              tokenizer,
              CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS,
              context.lastStartLoc,
              0,
              getTokenCaption(token)
            )
          }
          node.items.push(parseLiteral(tokenizer, token.value || ''))
          break
        case TokenTypes.LinkedAlias:
          const parsed = parseLinked(tokenizer)
          node.items.push(parsed.node)
          nextToken = parsed.nextConsumeToken || null
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

  function parsePlural(
    tokenizer: Tokenizer,
    offset: number,
    loc: Position,
    msgNode: MessageNode
  ): PluralNode {
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
        CompileErrorCodes.MUST_HAVE_MESSAGES_IN_PLURAL,
        loc,
        0
      )
    }

    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition())
    return node
  }

  function parseResource(tokenizer: Tokenizer): MessageNode | PluralNode {
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
    if (location && node.loc) {
      node.loc.source = source
    }
    node.body = parseResource(tokenizer)

    // assert wheather achieved to EOF
    if (context.currentType !== TokenTypes.EOF) {
      emitError(
        tokenizer,
        CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS,
        context.lastStartLoc,
        0,
        source[context.offset] || ''
      )
    }

    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition())
    return node
  }

  return { parse }
}

function getTokenCaption(token: Token) {
  if (token.type === TokenTypes.EOF) {
    return 'EOF'
  }
  const name = (token.value || '').replace(/\r?\n/gu, '\\n')
  return name.length > 10 ? name.slice(0, 9) + '…' : name
}
