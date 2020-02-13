import {
  createScanner,
  CHAR_SP as SPACE,
  CHAR_LF as NEW_LINE
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
  LinkedModifier,
  LinkedDelimiter,
  ParenLeft, // 10
  ParenRight,
  EOF
}

const enum TokenChars {
  Pipe = '|',
  BraceLeft = '{',
  BraceRight = '}',
  Modulo = '%',
  LinkedAlias = '@',
  LinkedModifier = '.',
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

export type Tokenizer = Readonly<{
  currentPosition: () => Position,
  nextToken: () => Token
}>

export function createTokenizer (source: string): Tokenizer {
  const _source = source
  const _scnr = createScanner(source)

  const currentPosition = (): Position => {
    return createPosition(_scnr.line(), _scnr.column(), _scnr.index())
  }

  let _currentType = TokenTypes.EOF
  let _prevType = -1
  let _currentValue: string | number | undefined | null = null
  let _startLoc = currentPosition()
  let _endLoc = _startLoc
  let _lastStartLoc: Position | null = null
  let _lastEndLoc: Position | null = null

  const getToken = (type: TokenTypes, value?: string | number): Token => {
    _endLoc = currentPosition()
    _prevType = _currentType
    _currentType = type
    _currentValue = value
    return {
      type,
      value,
      loc: createLocation(_startLoc, _endLoc)
    }
  }

  const peekSpaces = (): void => {
    while (_scnr.currentPeek() === SPACE || _scnr.currentPeek() === NEW_LINE) {
      _scnr.peek()
    }
  }

  const skipSpaces = (): void => {
    peekSpaces()
    _scnr.skipToPeek()
  }

  const isCharIdStart = (ch: string): boolean => {
    if (!ch) { return false }
    const cc = ch.charCodeAt(0)
    return (cc >= 97 && cc <= 122) || // a-z
           (cc >= 65 && cc <= 90) // A-Z
  }

  const isNumberStart = (ch: string): boolean => {
    if (!ch) {
      return false
    }
    const cc = ch.charCodeAt(0)
    return cc >= 48 && cc <= 57 // 0-9
  }

  const isNamedIdentifier = (): boolean => {
    if (_currentType !== TokenTypes.BraceLeft) { return false }
    peekSpaces()
    const ret = isCharIdStart(_scnr.currentPeek())
    _scnr.resetPeek()
    return ret
  }

  const isListIdentifier = (): boolean => {
    if (_currentType !== TokenTypes.BraceLeft) { return false }
    peekSpaces()
    const ch = _scnr.currentPeek() === '-'
      ? _scnr.peek()
      : _scnr.currentPeek()
    const ret = isNumberStart(ch)
    _scnr.resetPeek()
    return ret
  }

  const isTextStart = (): boolean => {
    if (_currentType === TokenTypes.BraceLeft ||
        _currentType === TokenTypes.Pipe ||
        _currentType === TokenTypes.LinkedAlias) {
      return false
    }

    const fn = (hasSpace = false): boolean => {
      const ch = _scnr.currentPeek()
      if ((ch === TokenChars.BraceLeft ||
        ch === TokenChars.Modulo ||
        ch === TokenChars.LinkedAlias || !ch)) {
        return hasSpace
      } else if (ch === TokenChars.Pipe) {
        return false
      } else if (ch === SPACE) {
        _scnr.peek()
        return fn(true)
      } else if (ch === NEW_LINE) {
        _scnr.peek()
        return fn(true)
      } else {
        return true
      }
    }

    const ret = fn()
    _scnr.resetPeek()
    return ret
  }

  const takeChar = (fn: Function): string | undefined | null => {
    const ch = _scnr.currentChar()
    if (ch === EOF) { return EOF }
    if (fn(ch)) {
      _scnr.next()
      return ch
    }
    return null
  }

  const takeNamedIdentifierChar = (): string | undefined | null => {
    const closure = (ch: string) => {
      const cc = ch.charCodeAt(0)
      return ((cc >= 97 && cc <= 122) || // a-z
              (cc >= 65 && cc <= 90) || // A-Z
              (cc >= 48 && cc <= 57) || // 0-9
               cc === 95 || cc === 36) // _ $
    }
    return takeChar(closure)
  }

  const takeDigit = (): string | undefined | null => {
    const closure = (ch: string) => {
      const cc = ch.charCodeAt(0)
      return (cc >= 48 && cc <= 57) // 0-9
    }
    return takeChar(closure)
  }

  const getDigits = (): string => {
    let ch: string | undefined | null = ''
    let num = ''
    while ((ch = takeDigit())) {
      num += ch
    }
    if (num.length === 0) {
      // TODO: parse errror
    }
    return num
  }

  const readText = (): string => {
    const fn = (detect = false, buf: string): string => {
      const ch = _scnr.currentChar()
      if ((ch === TokenChars.BraceLeft ||
        ch === TokenChars.Modulo ||
        ch === TokenChars.LinkedAlias || !ch)) {
        return buf
      } else if (ch === TokenChars.Pipe) {
        return buf
      } else if (ch === SPACE) {
        buf += ch
        _scnr.next()
        return fn(detect, buf)
      } else if (ch === NEW_LINE) {
        buf += ch
        _scnr.next()
        return fn(detect, buf)
      } else {
        buf += ch
        _scnr.next()
        return fn(true, buf)
      }
    }
    return fn(false, '')
  }

  const readNamedIdentifier = (): string => {
    skipSpaces()
    let ch: string | undefined | null = ''
    let name = ''
    while ((ch = takeNamedIdentifierChar())) {
      name += ch
    }
    skipSpaces()
    return name
  }

  const readListIdentifier = (): number => {
    skipSpaces()
    let value = ''
    if (_scnr.currentChar() === '-') {
      _scnr.next()
      value += `-${getDigits()}`
    } else {
      value += getDigits()
    }
    skipSpaces()
    return parseInt(value, 10)
  }

  const readToken = (): Token => {
    let token = { type: TokenTypes.EOF }
    const ch = _scnr.currentChar()
    switch (ch) {
      case TokenChars.BraceLeft:
        _scnr.next()
        token = getToken(TokenTypes.BraceLeft, TokenChars.BraceLeft)
        break
      case TokenChars.BraceRight:
        _scnr.next()
        token = getToken(TokenTypes.BraceRight, TokenChars.BraceRight)
        break
      default:
        if (isTextStart()) {
          token = getToken(TokenTypes.Text, readText())
        } else if (isNamedIdentifier()) {
          token = getToken(TokenTypes.Named, readNamedIdentifier())
        } else if (isListIdentifier()) {
          token = getToken(TokenTypes.List, readListIdentifier())
        }
        break
    }
    return token
  }

  const nextToken = (): Token => {
    _lastStartLoc = _startLoc
    _lastEndLoc = _endLoc
    _startLoc = currentPosition()

    if (!_scnr.currentChar()) {
      return getToken(TokenTypes.EOF)
    }

    return readToken()
  }

  return Object.freeze({
    nextToken,
    currentPosition
  })
}

export function parse (source: string): Token[] {
  const tokens = [] as Token[]
  const tokenizer = createTokenizer(source)
  let token: Token | null = null
  do {
    token = tokenizer.nextToken()
    tokens.push(token)
  } while (token.type !== TokenTypes.EOF)
  return tokens
}
