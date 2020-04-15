import {
  createScanner,
  CHAR_SP as SPACE,
  CHAR_LF as NEW_LINE,
  Scanner
} from './scanner'
import {
  SourceLocation,
  createLocation,
  createPosition,
  Position
} from './location'

export const enum TokenTypes {
  Text, // 0
  Pipe,
  BraceLeft,
  BraceRight,
  Modulo,
  Named, // 5
  List,
  LinkedAlias,
  LinkedDot,
  LinkedDelimiter,
  LinkedKey, // 10
  LinkedModifier,
  ParenLeft,
  ParenRight,
  EOF
}

const enum TokenChars {
  Pipe = '|',
  BraceLeft = '{',
  BraceRight = '}',
  Modulo = '%',
  LinkedAlias = '@',
  LinkedDot = '.',
  LinkedDelimiter = ':',
  ParenLeft = '(',
  ParenRight = ')'
}

// TODO: should be move to utils
const EOF = undefined

export type Token = {
  type: TokenTypes
  value?: string | number
  loc?: SourceLocation
}

export type TokenizeContext = {
  currentType: TokenTypes
  currentValue: string | number | undefined | null // TODO: if dont' use, should be removed
  offset: number
  startLoc: Position
  endLoc: Position
  lastType: TokenTypes
  lastOffset: number
  lastStartLoc: Position
  lastEndLoc: Position
}

export type Tokenizer = Readonly<{
  currentPosition: () => Position
  currentOffset: () => number
  context: () => TokenizeContext
  nextToken: () => Token
}>

export function createTokenizer(source: string): Tokenizer {
  const _scnr = createScanner(source)

  const currentOffset = (): number => _scnr.index()
  const currentPosition = (): Position =>
    createPosition(_scnr.line(), _scnr.column(), _scnr.index())

  const _initLoc = currentPosition()
  const _initOffset = currentOffset()
  const _context: TokenizeContext = {
    currentType: TokenTypes.EOF,
    currentValue: null,
    offset: _initOffset,
    startLoc: _initLoc,
    endLoc: _initLoc,
    lastType: TokenTypes.EOF,
    lastOffset: _initOffset,
    lastStartLoc: _initLoc,
    lastEndLoc: _initLoc
  }

  const context = (): TokenizeContext => _context

  const getToken = (
    context: TokenizeContext,
    type: TokenTypes,
    value?: string | number
  ): Token => {
    context.endLoc = currentPosition()
    context.currentType = type
    context.currentValue = value
    return {
      type,
      value,
      loc: createLocation(context.startLoc, context.endLoc)
    }
  }

  const peekSpaces = (scnr: Scanner): void => {
    while (scnr.currentPeek() === SPACE || scnr.currentPeek() === NEW_LINE) {
      scnr.peek()
    }
  }

  const skipSpaces = (scnr: Scanner): void => {
    peekSpaces(scnr)
    scnr.skipToPeek()
  }

  const isIdentifierStart = (ch: string): boolean => {
    if (!ch) {
      return false
    }
    const cc = ch.charCodeAt(0)
    return (
      (cc >= 97 && cc <= 122) || // a-z
      (cc >= 65 && cc <= 90)
    ) // A-Z
  }

  const isNumberStart = (ch: string): boolean => {
    if (!ch) {
      return false
    }
    const cc = ch.charCodeAt(0)
    return cc >= 48 && cc <= 57 // 0-9
  }

  const isNamedIdentifier = (
    scnr: Scanner,
    context: TokenizeContext
  ): boolean => {
    const { currentType } = context
    if (currentType !== TokenTypes.BraceLeft) {
      return false
    }
    peekSpaces(scnr)
    const ret = isIdentifierStart(scnr.currentPeek())
    scnr.resetPeek()
    return ret
  }

  const isListIdentifier = (
    scnr: Scanner,
    context: TokenizeContext
  ): boolean => {
    const { currentType } = context
    if (currentType !== TokenTypes.BraceLeft) {
      return false
    }
    peekSpaces(scnr)
    const ch = scnr.currentPeek() === '-' ? scnr.peek() : scnr.currentPeek()
    const ret = isNumberStart(ch)
    scnr.resetPeek()
    return ret
  }

  const isLinkedModifier = (
    scnr: Scanner,
    context: TokenizeContext
  ): boolean => {
    const { currentType } = context
    if (currentType !== TokenTypes.LinkedDot) {
      return false
    }
    const ret = isIdentifierStart(scnr.currentPeek())
    scnr.resetPeek()
    return ret
  }

  const isLinkedIdentifier = (
    scnr: Scanner,
    context: TokenizeContext
  ): boolean => {
    const { currentType } = context
    if (
      !(
        currentType === TokenTypes.LinkedDelimiter ||
        currentType === TokenTypes.ParenLeft
      )
    ) {
      return false
    }
    const fn = (): boolean => {
      const ch = scnr.currentPeek()
      if (ch === TokenChars.BraceLeft) {
        return isIdentifierStart(scnr.peek())
      } else if (
        ch === TokenChars.LinkedAlias ||
        ch === TokenChars.Modulo ||
        ch === TokenChars.Pipe ||
        ch === TokenChars.LinkedDelimiter ||
        ch === TokenChars.LinkedDot ||
        ch === SPACE ||
        !ch
      ) {
        return false
      } else if (ch === NEW_LINE) {
        return fn()
      } else {
        // other charactors
        return isIdentifierStart(ch)
      }
    }
    const ret = fn()
    scnr.resetPeek()
    return ret
  }

  const isPluralStart = (scnr: Scanner): boolean => {
    peekSpaces(scnr)
    const ret = scnr.currentPeek() === TokenChars.Pipe
    scnr.resetPeek()
    return ret
  }

  const isTextStart = (scnr: Scanner, context: TokenizeContext): boolean => {
    const { currentType } = context
    if (
      currentType === TokenTypes.BraceLeft ||
      currentType === TokenTypes.ParenLeft ||
      currentType === TokenTypes.LinkedDot ||
      currentType === TokenTypes.LinkedDelimiter
    ) {
      return false
    }

    const fn = (hasSpace = false): boolean => {
      const ch = scnr.currentPeek()
      if (
        ch === TokenChars.BraceLeft ||
        ch === TokenChars.Modulo ||
        ch === TokenChars.LinkedAlias ||
        !ch
      ) {
        return hasSpace
      } else if (ch === TokenChars.Pipe) {
        return false
      } else if (ch === SPACE) {
        scnr.peek()
        return fn(true)
      } else if (ch === NEW_LINE) {
        scnr.peek()
        return fn(true)
      } else {
        return true
      }
    }

    const ret = fn()
    scnr.resetPeek()
    return ret
  }

  const takeChar = (scnr: Scanner, fn: Function): string | undefined | null => {
    const ch = scnr.currentChar()
    if (ch === EOF) {
      return EOF
    }
    if (fn(ch)) {
      scnr.next()
      return ch
    }
    return null
  }

  const takeIdentifierChar = (scnr: Scanner): string | undefined | null => {
    const closure = (ch: string) => {
      const cc = ch.charCodeAt(0)
      return (
        (cc >= 97 && cc <= 122) || // a-z
        (cc >= 65 && cc <= 90) || // A-Z
        (cc >= 48 && cc <= 57) || // 0-9
        cc === 95 ||
        cc === 36
      ) // _ $
    }
    return takeChar(scnr, closure)
  }

  const takeDigit = (scnr: Scanner): string | undefined | null => {
    const closure = (ch: string) => {
      const cc = ch.charCodeAt(0)
      return cc >= 48 && cc <= 57 // 0-9
    }
    return takeChar(scnr, closure)
  }

  const getDigits = (scnr: Scanner): string => {
    let ch: string | undefined | null = ''
    let num = ''
    while ((ch = takeDigit(scnr))) {
      num += ch
    }
    if (num.length === 0) {
      // TODO: parse errror
    }
    return num
  }

  const readText = (scnr: Scanner): string => {
    const fn = (buf: string): string => {
      const ch = scnr.currentChar()
      if (
        ch === TokenChars.BraceLeft ||
        ch === TokenChars.Modulo ||
        ch === TokenChars.LinkedAlias ||
        !ch
      ) {
        return buf
      } else if (ch === SPACE || ch === NEW_LINE) {
        if (isPluralStart(scnr)) {
          return buf
        } else {
          buf += ch
          scnr.next()
          return fn(buf)
        }
      } else {
        buf += ch
        scnr.next()
        return fn(buf)
      }
    }
    return fn('')
  }

  const readNamedIdentifier = (scnr: Scanner): string => {
    skipSpaces(scnr)
    let ch: string | undefined | null = ''
    let name = ''
    while ((ch = takeIdentifierChar(scnr))) {
      name += ch
    }
    skipSpaces(scnr)
    return name
  }

  const readListIdentifier = (scnr: Scanner): number => {
    skipSpaces(scnr)
    let value = ''
    if (scnr.currentChar() === '-') {
      scnr.next()
      value += `-${getDigits(scnr)}`
    } else {
      value += getDigits(scnr)
    }
    skipSpaces(scnr)
    return parseInt(value, 10)
  }

  const readLinkedModifierArg = (scnr: Scanner): string => {
    let ch: string | undefined | null = ''
    let name = ''
    while ((ch = takeIdentifierChar(scnr))) {
      name += ch
    }
    return name
  }

  const readLinkedIdentifier = (
    scnr: Scanner,
    context: TokenizeContext
  ): string => {
    const fn = (detect = false, useParentLeft = false, buf: string): string => {
      const ch = scnr.currentChar()
      if (
        ch === TokenChars.BraceLeft ||
        ch === TokenChars.Modulo ||
        ch === TokenChars.LinkedAlias ||
        ch === TokenChars.ParenRight ||
        ch === TokenChars.Pipe ||
        !ch
      ) {
        return buf
      } else if (ch === SPACE) {
        if (useParentLeft) {
          buf += ch
          scnr.next()
          return fn(detect, useParentLeft, buf)
        } else {
          return buf
        }
      } else if (ch === NEW_LINE) {
        buf += ch
        scnr.next()
        return fn(detect, useParentLeft, buf)
      } else {
        buf += ch
        scnr.next()
        return fn(true, useParentLeft, buf)
      }
    }
    return fn(false, context.currentType === TokenTypes.ParenLeft, '')
  }

  const readPlural = (scnr: Scanner): string => {
    skipSpaces(scnr)
    const plural = scnr.currentChar()
    scnr.next()
    skipSpaces(scnr)
    return plural
  }

  const readToken = (scnr: Scanner, context: TokenizeContext): Token => {
    let token = { type: TokenTypes.EOF }
    const ch = scnr.currentChar()
    switch (ch) {
      case TokenChars.BraceLeft:
        scnr.next()
        token = getToken(context, TokenTypes.BraceLeft, TokenChars.BraceLeft)
        break
      case TokenChars.BraceRight:
        scnr.next()
        token = getToken(context, TokenTypes.BraceRight, TokenChars.BraceRight)
        break
      case TokenChars.LinkedAlias:
        scnr.next()
        token = getToken(
          context,
          TokenTypes.LinkedAlias,
          TokenChars.LinkedAlias
        )
        break
      case TokenChars.LinkedDot:
        scnr.next()
        token = getToken(context, TokenTypes.LinkedDot, TokenChars.LinkedDot)
        break
      case TokenChars.LinkedDelimiter:
        scnr.next()
        token = getToken(
          context,
          TokenTypes.LinkedDelimiter,
          TokenChars.LinkedDelimiter
        )
        break
      case TokenChars.ParenLeft:
        scnr.next()
        token = getToken(context, TokenTypes.ParenLeft, TokenChars.ParenLeft)
        break
      case TokenChars.ParenRight:
        scnr.next()
        token = getToken(context, TokenTypes.ParenRight, TokenChars.ParenRight)
        break
      case TokenChars.Modulo:
        scnr.next()
        token = getToken(context, TokenTypes.Modulo, TokenChars.Modulo)
        break
      default:
        if (isPluralStart(scnr)) {
          token = getToken(context, TokenTypes.Pipe, readPlural(scnr))
        } else if (isTextStart(scnr, context)) {
          token = getToken(context, TokenTypes.Text, readText(scnr))
        } else if (isNamedIdentifier(scnr, context)) {
          token = getToken(context, TokenTypes.Named, readNamedIdentifier(scnr))
        } else if (isListIdentifier(scnr, context)) {
          token = getToken(context, TokenTypes.List, readListIdentifier(scnr))
        } else if (isLinkedModifier(scnr, context)) {
          token = getToken(
            context,
            TokenTypes.LinkedModifier,
            readLinkedModifierArg(scnr)
          )
        } else if (isLinkedIdentifier(scnr, context)) {
          if (ch === TokenChars.BraceLeft) {
            scnr.next()
            token = getToken(
              context,
              TokenTypes.BraceLeft,
              TokenChars.BraceLeft
            )
          } else {
            token = getToken(
              context,
              TokenTypes.LinkedKey,
              readLinkedIdentifier(scnr, context)
            )
          }
        }
        break
    }
    return token
  }

  const nextToken = (): Token => {
    const { currentType, offset, startLoc, endLoc } = _context
    _context.lastType = currentType
    _context.lastOffset = offset
    _context.lastStartLoc = startLoc
    _context.lastEndLoc = endLoc
    _context.offset = currentOffset()
    _context.startLoc = currentPosition()

    if (!_scnr.currentChar()) {
      return getToken(_context, TokenTypes.EOF)
    }

    return readToken(_scnr, _context)
  }

  return {
    nextToken,
    currentOffset,
    currentPosition,
    context
  }
}

export function parse(source: string): Token[] {
  const tokens = [] as Token[]
  const tokenizer = createTokenizer(source)
  let token: Token | null = null
  do {
    token = tokenizer.nextToken()
    tokens.push(token)
  } while (token.type !== TokenTypes.EOF)
  return tokens
}
