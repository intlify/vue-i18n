import { createScanner, CHAR_SP as SPACE, CHAR_LF as NEW_LINE } from './scanner'
import { createLocation, createPosition } from './location'
import { createCompileError, CompileErrorCodes } from './errors'

import type { Scanner } from './scanner'
import type { SourceLocation, Position } from './location'
import type { TokenizeOptions } from './options'

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

const EOF = undefined
const DOT = '.'
const LITERAL_DELIMITER = "'"
export const ERROR_DOMAIN = 'tokenizer'

export interface Token {
  type: TokenTypes
  value?: string
  loc?: SourceLocation
}

export interface TokenizeContext {
  currentType: TokenTypes
  offset: number
  startLoc: Position
  endLoc: Position
  lastType: TokenTypes
  lastOffset: number
  lastStartLoc: Position
  lastEndLoc: Position
  braceNest: number
  inLinked: boolean
  text: string
}

export interface Tokenizer {
  currentPosition(): Position
  currentOffset(): number
  context(): TokenizeContext
  nextToken(): Token
}

export function createTokenizer(
  source: string,
  options: TokenizeOptions = {}
): Tokenizer {
  const location = options.location !== false

  const _scnr = createScanner(source)

  const currentOffset = (): number => _scnr.index()
  const currentPosition = (): Position =>
    createPosition(_scnr.line(), _scnr.column(), _scnr.index())

  const _initLoc = currentPosition()
  const _initOffset = currentOffset()
  const _context: TokenizeContext = {
    currentType: TokenTypes.EOF,
    offset: _initOffset,
    startLoc: _initLoc,
    endLoc: _initLoc,
    lastType: TokenTypes.EOF,
    lastOffset: _initOffset,
    lastStartLoc: _initLoc,
    lastEndLoc: _initLoc,
    braceNest: 0,
    inLinked: false,
    text: ''
  }

  const context = (): TokenizeContext => _context

  const { onError } = options
  function emitError(
    code: CompileErrorCodes,
    pos: Position,
    offset: number,
    ...args: unknown[]
  ): void {
    const ctx = context()

    pos.column += offset
    pos.offset += offset

    if (onError) {
      const loc = location ? createLocation(ctx.startLoc, pos) : null
      const err = createCompileError(code, loc, {
        domain: ERROR_DOMAIN,
        args
      })
      onError(err)
    }
  }

  function getToken(
    context: TokenizeContext,
    type: TokenTypes,
    value?: string
  ): Token {
    context.endLoc = currentPosition()
    context.currentType = type

    const token = { type } as Token
    if (location) {
      token.loc = createLocation(context.startLoc, context.endLoc)
    }
    if (value != null) {
      token.value = value
    }

    return token
  }

  const getEndToken = (context: TokenizeContext): Token =>
    getToken(context, TokenTypes.EOF)

  function eat(scnr: Scanner, ch: string): string {
    if (scnr.currentChar() === ch) {
      scnr.next()
      return ch
    } else {
      emitError(CompileErrorCodes.EXPECTED_TOKEN, currentPosition(), 0, ch)
      return ''
    }
  }

  function peekSpaces(scnr: Scanner): string {
    let buf = ''
    while (scnr.currentPeek() === SPACE || scnr.currentPeek() === NEW_LINE) {
      buf += scnr.currentPeek()
      scnr.peek()
    }
    return buf
  }

  function skipSpaces(scnr: Scanner): string {
    const buf = peekSpaces(scnr)
    scnr.skipToPeek()
    return buf
  }

  function isIdentifierStart(ch: string): boolean {
    if (ch === EOF) {
      return false
    }
    const cc = ch.charCodeAt(0)
    return (
      (cc >= 97 && cc <= 122) || // a-z
      (cc >= 65 && cc <= 90) || // A-Z
      cc === 95 // _
    )
  }

  function isNumberStart(ch: string): boolean {
    if (ch === EOF) {
      return false
    }
    const cc = ch.charCodeAt(0)
    return cc >= 48 && cc <= 57 // 0-9
  }

  function isNamedIdentifierStart(
    scnr: Scanner,
    context: TokenizeContext
  ): boolean {
    const { currentType } = context

    if (currentType !== TokenTypes.BraceLeft) {
      return false
    }

    peekSpaces(scnr)

    const ret = isIdentifierStart(scnr.currentPeek())
    scnr.resetPeek()

    return ret
  }

  function isListIdentifierStart(
    scnr: Scanner,
    context: TokenizeContext
  ): boolean {
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

  function isLiteralStart(scnr: Scanner, context: TokenizeContext): boolean {
    const { currentType } = context

    if (currentType !== TokenTypes.BraceLeft) {
      return false
    }

    peekSpaces(scnr)

    const ret = scnr.currentPeek() === LITERAL_DELIMITER
    scnr.resetPeek()

    return ret
  }

  function isLinkedDotStart(scnr: Scanner, context: TokenizeContext): boolean {
    const { currentType } = context

    if (currentType !== TokenTypes.LinkedAlias) {
      return false
    }

    peekSpaces(scnr)
    const ret = scnr.currentPeek() === TokenChars.LinkedDot
    scnr.resetPeek()

    return ret
  }

  function isLinkedModifierStart(
    scnr: Scanner,
    context: TokenizeContext
  ): boolean {
    const { currentType } = context

    if (currentType !== TokenTypes.LinkedDot) {
      return false
    }

    peekSpaces(scnr)
    const ret = isIdentifierStart(scnr.currentPeek())
    scnr.resetPeek()

    return ret
  }

  function isLinkedDelimiterStart(
    scnr: Scanner,
    context: TokenizeContext
  ): boolean {
    const { currentType } = context

    if (
      !(
        currentType === TokenTypes.LinkedAlias ||
        currentType === TokenTypes.LinkedModifier
      )
    ) {
      return false
    }

    peekSpaces(scnr)
    const ret = scnr.currentPeek() === TokenChars.LinkedDelimiter
    scnr.resetPeek()

    return ret
  }

  function isLinkedReferStart(
    scnr: Scanner,
    context: TokenizeContext
  ): boolean {
    const { currentType } = context

    if (currentType !== TokenTypes.LinkedDelimiter) {
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
        // other characters
        return isIdentifierStart(ch)
      }
    }

    const ret = fn()
    scnr.resetPeek()

    return ret
  }

  function isPluralStart(scnr: Scanner): boolean {
    peekSpaces(scnr)

    const ret = scnr.currentPeek() === TokenChars.Pipe
    scnr.resetPeek()

    return ret
  }

  function detectModuloStart(scnr: Scanner): {
    isModulo: boolean
    hasSpace: boolean
  } {
    const spaces = peekSpaces(scnr)

    const ret =
      scnr.currentPeek() === TokenChars.Modulo &&
      scnr.peek() === TokenChars.BraceLeft
    scnr.resetPeek()

    return {
      isModulo: ret,
      hasSpace: spaces.length > 0
    }
  }

  function isTextStart(scnr: Scanner, reset = true): boolean {
    const fn = (hasSpace = false, prev = '', detectModulo = false): boolean => {
      const ch = scnr.currentPeek()
      if (ch === TokenChars.BraceLeft) {
        return prev === TokenChars.Modulo ? false : hasSpace
      } else if (ch === TokenChars.LinkedAlias || !ch) {
        return prev === TokenChars.Modulo ? true : hasSpace
      } else if (ch === TokenChars.Modulo) {
        scnr.peek()
        return fn(hasSpace, TokenChars.Modulo, true)
      } else if (ch === TokenChars.Pipe) {
        return prev === TokenChars.Modulo || detectModulo
          ? true
          : !(prev === SPACE || prev === NEW_LINE)
      } else if (ch === SPACE) {
        scnr.peek()
        return fn(true, SPACE, detectModulo)
      } else if (ch === NEW_LINE) {
        scnr.peek()
        return fn(true, NEW_LINE, detectModulo)
      } else {
        return true
      }
    }

    const ret = fn()
    reset && scnr.resetPeek()

    return ret
  }

  function takeChar(
    scnr: Scanner,
    fn: (ch: string) => boolean
  ): string | undefined | null {
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

  function takeIdentifierChar(scnr: Scanner): string | undefined | null {
    const closure = (ch: string) => {
      const cc = ch.charCodeAt(0)
      return (
        (cc >= 97 && cc <= 122) || // a-z
        (cc >= 65 && cc <= 90) || // A-Z
        (cc >= 48 && cc <= 57) || // 0-9
        cc === 95 || // _
        cc === 36 // $
      )
    }
    return takeChar(scnr, closure)
  }

  function takeDigit(scnr: Scanner): string | undefined | null {
    const closure = (ch: string) => {
      const cc = ch.charCodeAt(0)
      return cc >= 48 && cc <= 57 // 0-9
    }
    return takeChar(scnr, closure)
  }

  function takeHexDigit(scnr: Scanner): string | undefined | null {
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

  function getDigits(scnr: Scanner): string {
    let ch: string | undefined | null = ''
    let num = ''
    while ((ch = takeDigit(scnr))) {
      num += ch
    }

    return num
  }

  function readModulo(scnr: Scanner): string {
    skipSpaces(scnr)
    const ch = scnr.currentChar()
    if (ch !== TokenChars.Modulo) {
      emitError(CompileErrorCodes.EXPECTED_TOKEN, currentPosition(), 0, ch)
    }
    scnr.next()
    return TokenChars.Modulo
  }

  function readText(scnr: Scanner): string {
    let buf = ''
    while (true) {
      const ch = scnr.currentChar()
      if (
        ch === TokenChars.BraceLeft ||
        ch === TokenChars.BraceRight ||
        ch === TokenChars.LinkedAlias ||
        ch === TokenChars.Pipe ||
        !ch
      ) {
        break
      } else if (ch === TokenChars.Modulo) {
        if (isTextStart(scnr)) {
          buf += ch
          scnr.next()
        } else {
          break
        }
      } else if (ch === SPACE || ch === NEW_LINE) {
        if (isTextStart(scnr)) {
          buf += ch
          scnr.next()
        } else if (isPluralStart(scnr)) {
          break
        } else {
          buf += ch
          scnr.next()
        }
      } else {
        buf += ch
        scnr.next()
      }
    }
    return buf
  }

  function readNamedIdentifier(scnr: Scanner): string {
    skipSpaces(scnr)

    let ch: string | undefined | null = ''
    let name = ''
    while ((ch = takeIdentifierChar(scnr))) {
      name += ch
    }

    if (scnr.currentChar() === EOF) {
      emitError(
        CompileErrorCodes.UNTERMINATED_CLOSING_BRACE,
        currentPosition(),
        0
      )
    }

    return name
  }

  function readListIdentifier(scnr: Scanner): string {
    skipSpaces(scnr)

    let value = ''
    if (scnr.currentChar() === '-') {
      scnr.next()
      value += `-${getDigits(scnr)}`
    } else {
      value += getDigits(scnr)
    }

    if (scnr.currentChar() === EOF) {
      emitError(
        CompileErrorCodes.UNTERMINATED_CLOSING_BRACE,
        currentPosition(),
        0
      )
    }

    return value
  }

  function readLiteral(scnr: Scanner): string {
    skipSpaces(scnr)

    eat(scnr, `\'`)

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
      emitError(
        CompileErrorCodes.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER,
        currentPosition(),
        0
      )
      // TODO: Is it correct really?
      if (current === NEW_LINE) {
        scnr.next()
        eat(scnr, `\'`)
      }
      return literal
    }

    eat(scnr, `\'`)

    return literal
  }

  function readEscapeSequence(scnr: Scanner): string {
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
        emitError(
          CompileErrorCodes.UNKNOWN_ESCAPE_SEQUENCE,
          currentPosition(),
          0,
          ch
        )
        return ''
    }
  }

  function readUnicodeEscapeSequence(
    scnr: Scanner,
    unicode: string,
    digits: number
  ): string {
    eat(scnr, unicode)

    let sequence = ''
    for (let i = 0; i < digits; i++) {
      const ch = takeHexDigit(scnr)
      if (!ch) {
        emitError(
          CompileErrorCodes.INVALID_UNICODE_ESCAPE_SEQUENCE,
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

  function readInvalidIdentifier(scnr: Scanner): string {
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

  function readLinkedModifier(scnr: Scanner): string {
    let ch: string | undefined | null = ''
    let name = ''
    while ((ch = takeIdentifierChar(scnr))) {
      name += ch
    }

    return name
  }

  function readLinkedRefer(scnr: Scanner): string {
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
      } else if (ch === NEW_LINE || ch === DOT) {
        buf += ch
        scnr.next()
        return fn(detect, buf)
      } else if (!isIdentifierStart(ch)) {
        return buf
      } else {
        buf += ch
        scnr.next()
        return fn(true, buf)
      }
    }

    return fn(false, '')
  }

  function readPlural(scnr: Scanner): string {
    skipSpaces(scnr)
    const plural = eat(scnr, TokenChars.Pipe)
    skipSpaces(scnr)
    return plural
  }

  // TODO: We need refactoring of token parsing ...
  function readTokenInPlaceholder(
    scnr: Scanner,
    context: TokenizeContext
  ): Token | null {
    let token = null

    const ch = scnr.currentChar()
    switch (ch) {
      case TokenChars.BraceLeft:
        if (context.braceNest >= 1) {
          emitError(
            CompileErrorCodes.NOT_ALLOW_NEST_PLACEHOLDER,
            currentPosition(),
            0
          )
        }

        scnr.next()
        token = getToken(context, TokenTypes.BraceLeft, TokenChars.BraceLeft)

        skipSpaces(scnr)

        context.braceNest++
        return token

      case TokenChars.BraceRight:
        if (
          context.braceNest > 0 &&
          context.currentType === TokenTypes.BraceLeft
        ) {
          emitError(CompileErrorCodes.EMPTY_PLACEHOLDER, currentPosition(), 0)
        }

        scnr.next()
        token = getToken(context, TokenTypes.BraceRight, TokenChars.BraceRight)

        context.braceNest--
        context.braceNest > 0 && skipSpaces(scnr)
        if (context.inLinked && context.braceNest === 0) {
          context.inLinked = false
        }
        return token

      case TokenChars.LinkedAlias:
        if (context.braceNest > 0) {
          emitError(
            CompileErrorCodes.UNTERMINATED_CLOSING_BRACE,
            currentPosition(),
            0
          )
        }

        token = readTokenInLinked(scnr, context) || getEndToken(context)

        context.braceNest = 0
        return token

      default:
        let validNamedIdentifier = true
        let validListIdentifier = true
        let validLiteral = true

        if (isPluralStart(scnr)) {
          if (context.braceNest > 0) {
            emitError(
              CompileErrorCodes.UNTERMINATED_CLOSING_BRACE,
              currentPosition(),
              0
            )
          }

          token = getToken(context, TokenTypes.Pipe, readPlural(scnr))

          // reset
          context.braceNest = 0
          context.inLinked = false
          return token
        }

        if (
          context.braceNest > 0 &&
          (context.currentType === TokenTypes.Named ||
            context.currentType === TokenTypes.List ||
            context.currentType === TokenTypes.Literal)
        ) {
          emitError(
            CompileErrorCodes.UNTERMINATED_CLOSING_BRACE,
            currentPosition(),
            0
          )

          context.braceNest = 0
          return readToken(scnr, context)
        }

        if ((validNamedIdentifier = isNamedIdentifierStart(scnr, context))) {
          token = getToken(context, TokenTypes.Named, readNamedIdentifier(scnr))

          skipSpaces(scnr)
          return token
        }

        if ((validListIdentifier = isListIdentifierStart(scnr, context))) {
          token = getToken(context, TokenTypes.List, readListIdentifier(scnr))

          skipSpaces(scnr)
          return token
        }

        if ((validLiteral = isLiteralStart(scnr, context))) {
          token = getToken(context, TokenTypes.Literal, readLiteral(scnr))

          skipSpaces(scnr)
          return token
        }

        if (!validNamedIdentifier && !validListIdentifier && !validLiteral) {
          // TODO: we should be re-designed invalid cases, when we will extend message syntax near the future ...
          token = getToken(
            context,
            TokenTypes.InvalidPlace,
            readInvalidIdentifier(scnr)
          )
          emitError(
            CompileErrorCodes.INVALID_TOKEN_IN_PLACEHOLDER,
            currentPosition(),
            0,
            token.value
          )

          skipSpaces(scnr)
          return token
        }

        break
    }

    return token
  }

  // TODO: We need refactoring of token parsing ...
  function readTokenInLinked(
    scnr: Scanner,
    context: TokenizeContext
  ): Token | null {
    const { currentType } = context
    let token = null

    const ch = scnr.currentChar()
    if (
      (currentType === TokenTypes.LinkedAlias ||
        currentType === TokenTypes.LinkedDot ||
        currentType === TokenTypes.LinkedModifier ||
        currentType === TokenTypes.LinkedDelimiter) &&
      (ch === NEW_LINE || ch === SPACE)
    ) {
      emitError(CompileErrorCodes.INVALID_LINKED_FORMAT, currentPosition(), 0)
    }

    switch (ch) {
      case TokenChars.LinkedAlias:
        scnr.next()
        token = getToken(
          context,
          TokenTypes.LinkedAlias,
          TokenChars.LinkedAlias
        )

        context.inLinked = true
        return token

      case TokenChars.LinkedDot:
        skipSpaces(scnr)

        scnr.next()
        return getToken(context, TokenTypes.LinkedDot, TokenChars.LinkedDot)

      case TokenChars.LinkedDelimiter:
        skipSpaces(scnr)

        scnr.next()
        return getToken(
          context,
          TokenTypes.LinkedDelimiter,
          TokenChars.LinkedDelimiter
        )

      default:
        if (isPluralStart(scnr)) {
          token = getToken(context, TokenTypes.Pipe, readPlural(scnr))
          // reset
          context.braceNest = 0
          context.inLinked = false
          return token
        }

        if (
          isLinkedDotStart(scnr, context) ||
          isLinkedDelimiterStart(scnr, context)
        ) {
          skipSpaces(scnr)
          return readTokenInLinked(scnr, context)
        }

        if (isLinkedModifierStart(scnr, context)) {
          skipSpaces(scnr)
          return getToken(
            context,
            TokenTypes.LinkedModifier,
            readLinkedModifier(scnr)
          )
        }

        if (isLinkedReferStart(scnr, context)) {
          skipSpaces(scnr)
          if (ch === TokenChars.BraceLeft) {
            // scan the placeholder
            return readTokenInPlaceholder(scnr, context) || token
          } else {
            return getToken(
              context,
              TokenTypes.LinkedKey,
              readLinkedRefer(scnr)
            )
          }
        }

        if (currentType === TokenTypes.LinkedAlias) {
          emitError(
            CompileErrorCodes.INVALID_LINKED_FORMAT,
            currentPosition(),
            0
          )
        }

        context.braceNest = 0
        context.inLinked = false
        return readToken(scnr, context)
    }
  }

  // TODO: We need refactoring of token parsing ...
  function readToken(scnr: Scanner, context: TokenizeContext): Token {
    let token = { type: TokenTypes.EOF }

    if (context.braceNest > 0) {
      return readTokenInPlaceholder(scnr, context) || getEndToken(context)
    }

    if (context.inLinked) {
      return readTokenInLinked(scnr, context) || getEndToken(context)
    }

    const ch = scnr.currentChar()
    switch (ch) {
      case TokenChars.BraceLeft:
        return readTokenInPlaceholder(scnr, context) || getEndToken(context)

      case TokenChars.BraceRight:
        emitError(
          CompileErrorCodes.UNBALANCED_CLOSING_BRACE,
          currentPosition(),
          0
        )

        scnr.next()
        return getToken(context, TokenTypes.BraceRight, TokenChars.BraceRight)

      case TokenChars.LinkedAlias:
        return readTokenInLinked(scnr, context) || getEndToken(context)

      default:
        if (isPluralStart(scnr)) {
          token = getToken(context, TokenTypes.Pipe, readPlural(scnr))
          // reset
          context.braceNest = 0
          context.inLinked = false
          return token
        }

        const { isModulo, hasSpace } = detectModuloStart(scnr)
        if (isModulo) {
          return hasSpace
            ? getToken(context, TokenTypes.Text, readText(scnr))
            : getToken(context, TokenTypes.Modulo, readModulo(scnr))
        }

        if (isTextStart(scnr)) {
          return getToken(context, TokenTypes.Text, readText(scnr))
        }

        break
    }

    return token
  }

  function nextToken(): Token {
    const { currentType, offset, startLoc, endLoc } = _context
    _context.lastType = currentType
    _context.lastOffset = offset
    _context.lastStartLoc = startLoc
    _context.lastEndLoc = endLoc
    _context.offset = currentOffset()
    _context.startLoc = currentPosition()

    if (_scnr.currentChar() === EOF) {
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
