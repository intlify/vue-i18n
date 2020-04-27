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
import { TokenizeOptions } from './options'
import { createCompileError, CompileErrorCodes } from './errors'

export const enum TokenTypes {
  Text, // 0
  Pipe,
  BraceLeft,
  BraceRight,
  Modulo,
  Named, // 5
  List,
  Literal,
  LinkedAlias,
  LinkedDot,
  LinkedDelimiter, // 10
  LinkedKey,
  LinkedModifier,
  InvalidPlace,
  EOF
}

const enum TokenChars {
  Pipe = '|',
  BraceLeft = '{',
  BraceRight = '}',
  Modulo = '%',
  LinkedAlias = '@',
  LinkedDot = '.',
  LinkedDelimiter = ':'
}

// TODO: should be move to utils
const EOF = undefined
const LITERAL_DELIMITER = "'"
export const ERROR_DOMAIN_TOKENIZE = 'tokenizer'

export type Token = {
  type: TokenTypes
  value?: string
  loc?: SourceLocation
}

export type TokenizeContext = {
  currentType: TokenTypes
  currentValue: string | undefined | null // TODO: if don't use, should be removed
  currentToken: Token | null
  offset: number
  startLoc: Position
  endLoc: Position
  lastType: TokenTypes
  lastToken: Token | null
  lastOffset: number
  lastStartLoc: Position
  lastEndLoc: Position
  braceNest: number
  inLinked: boolean
}

export type Tokenizer = Readonly<{
  currentPosition: () => Position
  currentOffset: () => number
  context: () => TokenizeContext
  nextToken: () => Token
}>

export function createTokenizer(
  source: string,
  options: TokenizeOptions = {}
): Tokenizer {
  const location = !options.location

  const _scnr = createScanner(source)

  const currentOffset = (): number => _scnr.index()
  const currentPosition = (): Position =>
    createPosition(_scnr.line(), _scnr.column(), _scnr.index())

  const _initLoc = currentPosition()
  const _initOffset = currentOffset()
  const _context: TokenizeContext = {
    currentType: TokenTypes.EOF,
    currentValue: null,
    currentToken: null,
    offset: _initOffset,
    startLoc: _initLoc,
    endLoc: _initLoc,
    lastType: TokenTypes.EOF,
    lastToken: null,
    lastOffset: _initOffset,
    lastStartLoc: _initLoc,
    lastEndLoc: _initLoc,
    braceNest: 0,
    inLinked: false
  }
  const context = (): TokenizeContext => _context

  const { onError } = options
  // TODO: This code should be removed with using rollup (`/*#__PURE__*/`)
  const emitError = (
    code: CompileErrorCodes,
    pos: Position,
    offset: number,
    ...args: unknown[]
  ): void => {
    const ctx = context()
    pos.column += offset
    pos.offset += offset
    if (onError) {
      const loc = createLocation(ctx.startLoc, pos)
      const err = createCompileError(code, loc, {
        domain: ERROR_DOMAIN_TOKENIZE,
        args
      })
      onError(err)
    }
  }

  const getToken = (
    context: TokenizeContext,
    type: TokenTypes,
    value?: string
  ): Token => {
    context.endLoc = currentPosition()
    context.currentType = type
    context.currentValue = value

    const token = { type } as Token
    if (location) {
      token.loc = createLocation(context.startLoc, context.endLoc)
    }
    if (value != null) {
      token.value = value
    }

    return token
  }

  const eat = (scnr: Scanner, ch: string): string => {
    if (scnr.currentChar() === ch) {
      scnr.next()
      return ch
    } else {
      // TODO: This code should be removed with using rollup (`/*#__PURE__*/`)
      emitError(CompileErrorCodes.T_EXPECTED_TOKEN, currentPosition(), 0, ch)
      return ''
    }
  }

  const peekNewLines = (scnr: Scanner): void => {
    while (scnr.currentPeek() === NEW_LINE) {
      scnr.peek()
    }
  }

  const skipNewLines = (scnr: Scanner): void => {
    peekNewLines(scnr)
    scnr.skipToPeek()
  }

  const peekSpaces = (scnr: Scanner): string => {
    let buf = ''
    while (scnr.currentPeek() === SPACE || scnr.currentPeek() === NEW_LINE) {
      buf += scnr.currentPeek()
      scnr.peek()
    }
    return buf
  }

  const skipSpaces = (scnr: Scanner): string => {
    const buf = peekSpaces(scnr)
    scnr.skipToPeek()
    return buf
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

  const isNamedIdentifierStart = (
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

  const isListIdentifierStart = (
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

  const isLiteralStart = (scnr: Scanner, context: TokenizeContext): boolean => {
    const { currentType } = context
    if (currentType !== TokenTypes.BraceLeft) {
      return false
    }
    peekSpaces(scnr)
    const ret = scnr.currentPeek() === LITERAL_DELIMITER
    scnr.resetPeek()
    return ret
  }

  const isLinkedModifierStart = (
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

  const isLinkedReferStart = (
    scnr: Scanner,
    context: TokenizeContext
  ): boolean => {
    const { currentType } = context
    if (!(currentType === TokenTypes.LinkedDelimiter)) {
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
        scnr.peek()
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
    if (currentType === TokenTypes.BraceLeft) {
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

  const takeHexDigit = (scnr: Scanner): string | undefined | null => {
    const closure = (ch: string) => {
      const cc = ch.charCodeAt(0)
      return (
        (cc >= 48 && cc <= 57) || // 0-9
        (cc >= 65 && cc <= 70) || // A-F
        (cc >= 97 && cc <= 102)
      ) // a-f
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
    return name
  }

  const readListIdentifier = (scnr: Scanner): string => {
    skipSpaces(scnr)
    let value = ''
    if (scnr.currentChar() === '-') {
      scnr.next()
      value += `-${getDigits(scnr)}`
    } else {
      value += getDigits(scnr)
    }
    return value
  }

  const readLiteral = (scnr: Scanner): string => {
    skipSpaces(scnr)

    eat(scnr, LITERAL_DELIMITER)

    let ch: string | undefined | null = ''
    let literal = ''
    const fn = (x: string) => x !== LITERAL_DELIMITER && x !== NEW_LINE
    while ((ch = takeChar(scnr, fn))) {
      if (ch === '\\') {
        literal += readEscapeSequence(scnr)
      } else {
        literal += ch
      }
    }

    const current = scnr.currentChar()
    if (current === NEW_LINE || current === EOF) {
      // TODO: This code should be removed with using rollup (`/*#__PURE__*/`)
      emitError(
        CompileErrorCodes.T_UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER,
        currentPosition(),
        0
      )
      return literal
    }

    eat(scnr, LITERAL_DELIMITER)

    return literal
  }

  const readEscapeSequence = (scnr: Scanner): string => {
    const ch = scnr.currentChar()
    switch (ch) {
      case '\\':
      case `\'`:
        scnr.next()
        return `\\${ch}`
      case 'u':
        return readUnicodeEscapeSequence(scnr, ch, 4)
      case 'U':
        return readUnicodeEscapeSequence(scnr, ch, 6)
      default:
        // TODO: This code should be removed with using rollup (`/*#__PURE__*/`)
        emitError(
          CompileErrorCodes.T_UNKNOWN_ESCAPE_SEQUENCE,
          currentPosition(),
          0,
          ch
        )
        return ''
    }
  }

  const readUnicodeEscapeSequence = (
    scnr: Scanner,
    unicode: string,
    digits: number
  ): string => {
    eat(scnr, unicode)

    let sequence = ''
    for (let i = 0; i < digits; i++) {
      const ch = takeHexDigit(scnr)
      if (!ch) {
        // TODO: This code should be removed with using rollup (`/*#__PURE__*/`)
        emitError(
          CompileErrorCodes.T_INVALID_UNICODE_ESCAPE_SEQUENCE,
          currentPosition(),
          0,
          `\\${unicode}${sequence}${scnr.currentChar()}`
        )
        break
      }
      sequence += ch
    }

    return `\\${unicode}${sequence}`
  }

  const readInvalidIdentifier = (scnr: Scanner): string => {
    skipSpaces(scnr)
    let ch: string | undefined | null = ''
    let identifiers = ''
    const closure = (ch: string) =>
      ch !== TokenChars.BraceLeft &&
      ch !== TokenChars.BraceRight &&
      ch !== SPACE &&
      ch !== NEW_LINE
    while ((ch = takeChar(scnr, closure))) {
      identifiers += ch
    }
    return identifiers
  }

  const readLinkedModifier = (scnr: Scanner): string => {
    let ch: string | undefined | null = ''
    let name = ''
    while ((ch = takeIdentifierChar(scnr))) {
      name += ch
    }
    return name
  }

  const readLinkedRefer = (scnr: Scanner): string => {
    const fn = (detect = false, buf: string): string => {
      const ch = scnr.currentChar()
      if (
        ch === TokenChars.BraceLeft ||
        ch === TokenChars.Modulo ||
        ch === TokenChars.LinkedAlias ||
        ch === TokenChars.Pipe ||
        !ch
      ) {
        return buf
      } else if (ch === SPACE) {
        return buf
      } else if (ch === NEW_LINE) {
        buf += ch
        scnr.next()
        return fn(detect, buf)
      } else {
        buf += ch
        scnr.next()
        return fn(true, buf)
      }
    }
    return fn(false, '')
  }

  const readPlural = (scnr: Scanner): string => {
    skipSpaces(scnr)
    const plural = eat(scnr, TokenChars.Pipe)
    skipSpaces(scnr)
    return plural
  }

  const readTokenInPlaceholder = (
    scnr: Scanner,
    context: TokenizeContext
  ): Token | null => {
    let token = null
    const ch = scnr.currentChar()
    switch (ch) {
      case TokenChars.BraceLeft:
        scnr.next()
        token = getToken(context, TokenTypes.BraceLeft, TokenChars.BraceLeft)
        skipSpaces(scnr)
        context.braceNest++
        break
      case TokenChars.BraceRight:
        scnr.next()
        token = getToken(context, TokenTypes.BraceRight, TokenChars.BraceRight)
        context.braceNest--
        context.braceNest > 0 && skipSpaces(scnr)
        if (context.inLinked && context.braceNest === 0) {
          context.inLinked = false
        }
        break
      default:
        let validNamedIdentifier = true
        let validListIdentifier = true
        let validLeteral = true
        if (isPluralStart(scnr)) {
          token = getToken(context, TokenTypes.Pipe, readPlural(scnr))
          // reset
          context.braceNest = 0
          context.inLinked = false
        } else if (
          (validNamedIdentifier = isNamedIdentifierStart(scnr, context))
        ) {
          token = getToken(context, TokenTypes.Named, readNamedIdentifier(scnr))
          skipSpaces(scnr)
        } else if (
          (validListIdentifier = isListIdentifierStart(scnr, context))
        ) {
          token = getToken(context, TokenTypes.List, readListIdentifier(scnr))
          skipSpaces(scnr)
        } else if ((validLeteral = isLiteralStart(scnr, context))) {
          token = getToken(context, TokenTypes.Literal, readLiteral(scnr))
          skipSpaces(scnr)
        } else if (
          !validNamedIdentifier &&
          !validListIdentifier &&
          !validLeteral
        ) {
          // TODO:
          //  we should be more refactor to handle token invalid cases ...
          //  we should be emitted errors
          token = getToken(
            context,
            TokenTypes.InvalidPlace,
            readInvalidIdentifier(scnr)
          )
          skipSpaces(scnr)
        }
        break
    }
    return token
  }

  const readTokenInLinked = (
    scnr: Scanner,
    context: TokenizeContext
  ): Token | null => {
    let token = null
    const ch = scnr.currentChar()
    switch (ch) {
      case TokenChars.LinkedAlias:
        scnr.next()
        token = getToken(
          context,
          TokenTypes.LinkedAlias,
          TokenChars.LinkedAlias
        )
        context.inLinked = true
        skipNewLines(scnr)
        break
      case TokenChars.LinkedDot:
        scnr.next()
        token = getToken(context, TokenTypes.LinkedDot, TokenChars.LinkedDot)
        skipNewLines(scnr)
        break
      case TokenChars.LinkedDelimiter:
        scnr.next()
        token = getToken(
          context,
          TokenTypes.LinkedDelimiter,
          TokenChars.LinkedDelimiter
        )
        skipNewLines(scnr)
        break
      default:
        if (isPluralStart(scnr)) {
          token = getToken(context, TokenTypes.Pipe, readPlural(scnr))
          // reset
          context.braceNest = 0
          context.inLinked = false
        } else if (isLinkedModifierStart(scnr, context)) {
          token = getToken(
            context,
            TokenTypes.LinkedModifier,
            readLinkedModifier(scnr)
          )
          skipNewLines(scnr)
        } else if (isLinkedReferStart(scnr, context)) {
          if (ch === TokenChars.BraceLeft) {
            // scan the placeholder
            token = readTokenInPlaceholder(scnr, context) || token
          } else {
            token = getToken(
              context,
              TokenTypes.LinkedKey,
              readLinkedRefer(scnr)
            )
          }
        } else {
          context.braceNest = 0
          context.inLinked = false
          token = readToken(scnr, context)
        }
        break
    }
    return token
  }

  const readToken = (scnr: Scanner, context: TokenizeContext): Token => {
    let token = { type: TokenTypes.EOF }
    const ch = scnr.currentChar()

    if (context.braceNest > 0) {
      return readTokenInPlaceholder(scnr, context) || token
    }

    switch (ch) {
      case TokenChars.BraceLeft:
        token = readTokenInPlaceholder(scnr, context) || token
        break
      case TokenChars.LinkedAlias:
        token = readTokenInLinked(scnr, context) || token
        break
      case TokenChars.Modulo:
        scnr.next()
        token = getToken(context, TokenTypes.Modulo, TokenChars.Modulo)
        break
      default:
        if (isPluralStart(scnr)) {
          token = getToken(context, TokenTypes.Pipe, readPlural(scnr))
          // reset
          context.braceNest = 0
          context.inLinked = false
        } else if (context.braceNest > 0) {
          // scan the placeholder
          token = readTokenInPlaceholder(scnr, context) || token
        } else if (context.inLinked) {
          // scan the linked
          token = readTokenInLinked(scnr, context) || token
        } else if (isTextStart(scnr, context)) {
          token = getToken(context, TokenTypes.Text, readText(scnr))
        }
        break
    }
    return token
  }

  const nextToken = (): Token => {
    const { currentType, currentToken, offset, startLoc, endLoc } = _context
    _context.lastType = currentType
    _context.lastToken = currentToken
    _context.lastOffset = offset
    _context.lastStartLoc = startLoc
    _context.lastEndLoc = endLoc
    _context.offset = currentOffset()
    _context.startLoc = currentPosition()

    if (!_scnr.currentChar()) {
      return (_context.currentToken = getToken(_context, TokenTypes.EOF))
    }

    return (_context.currentToken = readToken(_scnr, _context))
  }

  return {
    nextToken,
    currentOffset,
    currentPosition,
    context
  }
}

export function parse(source: string, options: TokenizeOptions = {}): Token[] {
  const tokens = [] as Token[]
  const tokenizer = createTokenizer(source, options)
  let token: Token | null = null
  do {
    token = tokenizer.nextToken()
    tokens.push(token)
  } while (token.type !== TokenTypes.EOF)
  return tokens
}
