import { createScanner, Scanner } from './scanner'
import { SourceLocation, createLocation, createPosition } from './location'

export const enum TokenTypes {
  Text, // 0
  Pipe,
  BraceL,
  BraceR,
  Modulo,
  Named, // 5
  List,
  Linked,
  EOF
}

const enum TokenChars {
  Pipe = '|',
  BraceL = '{',
  BraceR = '}',
  Modulo = '%',
  LinkedFirst = '@',
  LinkedLast = ':',
  EOL = '\n'
}

const EOF = undefined

export type Token = {
  type: TokenTypes
  value: string
  loc?: SourceLocation
}

type Tokenizer = Readonly<{
  parse: (source: string) => Token[]
}>

export function createTokenizer (): Tokenizer {
  function getBraceToken (scnr: Scanner, type: TokenTypes): Token {
    const start = createPosition(scnr.line(), scnr.column(), scnr.index())
    const value = scnr.next()
    return {
      type,
      value,
      loc: createLocation(
        start,
        createPosition(scnr.line(), scnr.column(), scnr.index())
      )
    }
  }

  function getTextToken (scnr: Scanner): Token | null {
    const start = createPosition(scnr.line(), scnr.column(), scnr.index())
    const createToken = (value: string): Token => ({
      type: TokenTypes.Text,
      value,
      loc: createLocation(
        start,
        createPosition(scnr.line(), scnr.column(), scnr.index())
      )
    })

    let buf = ''
    let ch = ''
    while ((ch = scnr.currentChar())) {
      if ((ch === TokenChars.BraceL ||
        ch === TokenChars.Pipe ||
        ch === TokenChars.LinkedFirst)) {
        if (buf.length > 0) {
          return createToken(buf)
        } else {
          return null
        }
      }

      if (ch === EOF) {
        return createToken(buf)
      }

      buf += ch
      scnr.next()
    }

    return createToken(buf)
  }

  function parse (source: string): Token[] {
    const tokens = [] as Token[]
    const scnr = createScanner(source)

    let ch: string | undefined = ''
    loop: while ((ch = scnr.currentChar())) { // eslint-disable-line no-labels
      let token: Token | null = null
      switch (ch) {
        case TokenChars.BraceL:
          // tokens.push(getBraceToken(scnr, TokenTypes.BraceL))
          break
        case TokenChars.BraceR:
          // tokens.push(getBraceToken(scnr, TokenTypes.BraceR))
          break
        case TokenChars.Pipe:
          break
        case TokenChars.LinkedFirst:
          break
        case TokenChars.Modulo:
          break
        case TokenChars.EOL:
          break
        default: // Text
          token = getTextToken(scnr)
          token && tokens.push(token)
          break
      }
    }

    tokens.push({
      type: TokenTypes.EOF,
      value: '',
      loc: createLocation(
        createPosition(scnr.line(), scnr.column(), scnr.index()),
        createPosition(scnr.line(), scnr.column(), scnr.index())
      )
    })

    return tokens
  }

  return Object.freeze({
    parse
  })
}
