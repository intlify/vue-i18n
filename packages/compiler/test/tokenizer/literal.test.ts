import { TokenizeOptions } from '../../src/options'
import { CompileErrorCodes, CompileError } from '../../src/errors'
import {
  createTokenizer,
  TokenTypes,
  parse,
  ERROR_DOMAIN as ERROR_DOMAIN_TOKENIZE
} from '../../src/tokenizer'

describe('string', () => {
  test(`ascii: 'kazuya kawaguchi'`, () => {
    const tokenizer = createTokenizer(`hi { 'kazuya kawaguchi' }`)
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Text,
      value: 'hi ',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 4, offset: 3 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceLeft,
      value: '{',
      loc: {
        start: { line: 1, column: 4, offset: 3 },
        end: { line: 1, column: 5, offset: 4 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Literal,
      value: 'kazuya kawaguchi',
      loc: {
        start: { line: 1, column: 6, offset: 5 },
        end: { line: 1, column: 24, offset: 23 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceRight,
      value: '}',
      loc: {
        start: { line: 1, column: 25, offset: 24 },
        end: { line: 1, column: 26, offset: 25 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.EOF,
      loc: {
        start: { line: 1, column: 26, offset: 25 },
        end: { line: 1, column: 26, offset: 25 }
      }
    })
  })

  test(`multi bytes: 'かずぽん'`, () => {
    const tokenizer = createTokenizer(`こんにちは、{ 'かずぽん' }`)
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Text,
      value: 'こんにちは、',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 7, offset: 6 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceLeft,
      value: '{',
      loc: {
        start: { line: 1, column: 7, offset: 6 },
        end: { line: 1, column: 8, offset: 7 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Literal,
      value: 'かずぽん',
      loc: {
        start: { line: 1, column: 9, offset: 8 },
        end: { line: 1, column: 15, offset: 14 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceRight,
      value: '}',
      loc: {
        start: { line: 1, column: 16, offset: 15 },
        end: { line: 1, column: 17, offset: 16 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.EOF,
      loc: {
        start: { line: 1, column: 17, offset: 16 },
        end: { line: 1, column: 17, offset: 16 }
      }
    })
  })

  test(`emoji: '😺'`, () => {
    const tokenizer = createTokenizer(`hi { '😺' }`)
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Text,
      value: 'hi ',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 4, offset: 3 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceLeft,
      value: '{',
      loc: {
        start: { line: 1, column: 4, offset: 3 },
        end: { line: 1, column: 5, offset: 4 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Literal,
      value: '😺',
      loc: {
        start: { line: 1, column: 6, offset: 5 },
        end: { line: 1, column: 10, offset: 9 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceRight,
      value: '}',
      loc: {
        start: { line: 1, column: 11, offset: 10 },
        end: { line: 1, column: 12, offset: 11 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.EOF,
      loc: {
        start: { line: 1, column: 12, offset: 11 },
        end: { line: 1, column: 12, offset: 11 }
      }
    })
  })
})

describe('unicode', () => {
  test(`4 digits: '\\u0041'`, () => {
    const tokenizer = createTokenizer(`{ '\\u0041' }`) // { '\u0041' }
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceLeft,
      value: '{',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 2, offset: 1 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Literal,
      value: '\\u0041',
      loc: {
        start: { line: 1, column: 3, offset: 2 },
        end: { line: 1, column: 11, offset: 10 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceRight,
      value: '}',
      loc: {
        start: { line: 1, column: 12, offset: 11 },
        end: { line: 1, column: 13, offset: 12 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.EOF,
      loc: {
        start: { line: 1, column: 13, offset: 12 },
        end: { line: 1, column: 13, offset: 12 }
      }
    })
  })

  test(`6 digits: '\\U01F602'`, () => {
    const tokenizer = createTokenizer(`{ '\\U01F602' }`) // { '\U01F602' }
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceLeft,
      value: '{',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 2, offset: 1 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Literal,
      value: '\\U01F602',
      loc: {
        start: { line: 1, column: 3, offset: 2 },
        end: { line: 1, column: 13, offset: 12 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceRight,
      value: '}',
      loc: {
        start: { line: 1, column: 14, offset: 13 },
        end: { line: 1, column: 15, offset: 14 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.EOF,
      loc: {
        start: { line: 1, column: 15, offset: 14 },
        end: { line: 1, column: 15, offset: 14 }
      }
    })
  })
})

describe('special chracters', () => {
  test(`'{'`, () => {
    const tokenizer = createTokenizer(`open blace: {'{'}`)
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Text,
      value: 'open blace: ',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 13, offset: 12 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceLeft,
      value: '{',
      loc: {
        start: { line: 1, column: 13, offset: 12 },
        end: { line: 1, column: 14, offset: 13 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Literal,
      value: '{',
      loc: {
        start: { line: 1, column: 14, offset: 13 },
        end: { line: 1, column: 17, offset: 16 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceRight,
      value: '}',
      loc: {
        start: { line: 1, column: 17, offset: 16 },
        end: { line: 1, column: 18, offset: 17 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.EOF,
      loc: {
        start: { line: 1, column: 18, offset: 17 },
        end: { line: 1, column: 18, offset: 17 }
      }
    })
  })

  test(`'}'`, () => {
    const tokenizer = createTokenizer(`end blace: { '}' }`)
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Text,
      value: 'end blace: ',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 12, offset: 11 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceLeft,
      value: '{',
      loc: {
        start: { line: 1, column: 12, offset: 11 },
        end: { line: 1, column: 13, offset: 12 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Literal,
      value: '}',
      loc: {
        start: { line: 1, column: 14, offset: 13 },
        end: { line: 1, column: 17, offset: 16 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceRight,
      value: '}',
      loc: {
        start: { line: 1, column: 18, offset: 17 },
        end: { line: 1, column: 19, offset: 18 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.EOF,
      loc: {
        start: { line: 1, column: 19, offset: 18 },
        end: { line: 1, column: 19, offset: 18 }
      }
    })
  })

  test(`'|'`, () => {
    const tokenizer = createTokenizer(`{ '|' } = pipe`)
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceLeft,
      value: '{',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 2, offset: 1 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Literal,
      value: '|',
      loc: {
        start: { line: 1, column: 3, offset: 2 },
        end: { line: 1, column: 6, offset: 5 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceRight,
      value: '}',
      loc: {
        start: { line: 1, column: 7, offset: 6 },
        end: { line: 1, column: 8, offset: 7 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Text,
      value: ' = pipe',
      loc: {
        start: { line: 1, column: 8, offset: 7 },
        end: { line: 1, column: 15, offset: 14 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.EOF,
      loc: {
        start: { line: 1, column: 15, offset: 14 },
        end: { line: 1, column: 15, offset: 14 }
      }
    })
  })

  test(`'@'`, () => {
    const tokenizer = createTokenizer(`foo{'@'}bar.com`)
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Text,
      value: 'foo',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 4, offset: 3 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceLeft,
      value: '{',
      loc: {
        start: { line: 1, column: 4, offset: 3 },
        end: { line: 1, column: 5, offset: 4 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Literal,
      value: '@',
      loc: {
        start: { line: 1, column: 5, offset: 4 },
        end: { line: 1, column: 8, offset: 7 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceRight,
      value: '}',
      loc: {
        start: { line: 1, column: 8, offset: 7 },
        end: { line: 1, column: 9, offset: 8 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Text,
      value: 'bar.com',
      loc: {
        start: { line: 1, column: 9, offset: 8 },
        end: { line: 1, column: 16, offset: 15 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.EOF,
      loc: {
        start: { line: 1, column: 16, offset: 15 },
        end: { line: 1, column: 16, offset: 15 }
      }
    })
  })

  test(`'$'`, () => {
    const tokenizer = createTokenizer(`{'$query'}`)
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceLeft,
      value: '{',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 2, offset: 1 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Literal,
      value: '$query',
      loc: {
        start: { line: 1, column: 2, offset: 1 },
        end: { line: 1, column: 10, offset: 9 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceRight,
      value: '}',
      loc: {
        start: { line: 1, column: 10, offset: 9 },
        end: { line: 1, column: 11, offset: 10 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.EOF,
      loc: {
        start: { line: 1, column: 11, offset: 10 },
        end: { line: 1, column: 11, offset: 10 }
      }
    })
  })

  test(`'!#%^&*()-_+=[]:;?.<>"\``, () => {
    const tokenizer = createTokenizer("{'!#%^&*()-_+=[]:;?.<>\"`'}")
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceLeft,
      value: '{',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 2, offset: 1 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Literal,
      value: '!#%^&*()-_+=[]:;?.<>"`',
      loc: {
        start: { line: 1, column: 2, offset: 1 },
        end: { line: 1, column: 26, offset: 25 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceRight,
      value: '}',
      loc: {
        start: { line: 1, column: 26, offset: 25 },
        end: { line: 1, column: 27, offset: 26 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.EOF,
      loc: {
        start: { line: 1, column: 27, offset: 26 },
        end: { line: 1, column: 27, offset: 26 }
      }
    })
  })
})

describe('escapes', () => {
  test(`backslash quote: '\\''`, () => {
    const tokenizer = createTokenizer(`{'\\''}`) // {'\''}
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceLeft,
      value: '{',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 2, offset: 1 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Literal,
      value: `\\\'`,
      loc: {
        start: { line: 1, column: 2, offset: 1 },
        end: { line: 1, column: 6, offset: 5 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceRight,
      value: '}',
      loc: {
        start: { line: 1, column: 6, offset: 5 },
        end: { line: 1, column: 7, offset: 6 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.EOF,
      loc: {
        start: { line: 1, column: 7, offset: 6 },
        end: { line: 1, column: 7, offset: 6 }
      }
    })
  })

  test(`backslash backslash: '\\\\'`, () => {
    const tokenizer = createTokenizer(`{'\\\\'}`) // {'\\''}
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceLeft,
      value: '{',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 2, offset: 1 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Literal,
      value: '\\\\',
      loc: {
        start: { line: 1, column: 2, offset: 1 },
        end: { line: 1, column: 6, offset: 5 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceRight,
      value: '}',
      loc: {
        start: { line: 1, column: 6, offset: 5 },
        end: { line: 1, column: 7, offset: 6 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.EOF,
      loc: {
        start: { line: 1, column: 7, offset: 6 },
        end: { line: 1, column: 7, offset: 6 }
      }
    })
  })

  test(`unicode 4 digits: '\\\\u0041'`, () => {
    const tokenizer = createTokenizer(`{'\\\\u0041'}`) // {'\\u0041'}
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceLeft,
      value: '{',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 2, offset: 1 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Literal,
      value: '\\\\u0041',
      loc: {
        start: { line: 1, column: 2, offset: 1 },
        end: { line: 1, column: 11, offset: 10 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceRight,
      value: '}',
      loc: {
        start: { line: 1, column: 11, offset: 10 },
        end: { line: 1, column: 12, offset: 11 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.EOF,
      loc: {
        start: { line: 1, column: 12, offset: 11 },
        end: { line: 1, column: 12, offset: 11 }
      }
    })
  })

  test(`unicode 6 digits: '\\\\U01F602'`, () => {
    const tokenizer = createTokenizer(`{'\\\\U01F602'}`) // {'\\U01F602'}
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceLeft,
      value: '{',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 2, offset: 1 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Literal,
      value: '\\\\U01F602',
      loc: {
        start: { line: 1, column: 2, offset: 1 },
        end: { line: 1, column: 13, offset: 12 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceRight,
      value: '}',
      loc: {
        start: { line: 1, column: 13, offset: 12 },
        end: { line: 1, column: 14, offset: 13 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.EOF,
      loc: {
        start: { line: 1, column: 14, offset: 13 },
        end: { line: 1, column: 14, offset: 13 }
      }
    })
  })
})

describe('errors', () => {
  let errors: CompileError[], options: TokenizeOptions
  beforeEach(() => {
    errors = []
    options = {
      onError: err => {
        errors.push({ ...err, message: err.message })
      }
    } as TokenizeOptions
  })

  test(`not closed single quote: hi { 'foo }`, () => {
    parse(`hi { 'foo }`, options)
    expect(errors).toEqual([
      {
        code: CompileErrorCodes.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER,
        domain: ERROR_DOMAIN_TOKENIZE,
        message: `Unterminated single quote in placeholder`,
        location: {
          start: {
            line: 1,
            offset: 5,
            column: 6
          },
          end: {
            line: 1,
            offset: 11,
            column: 12
          }
        }
      }
    ] as CompileError[])
  })

  test(`mismatched quote: hi { '\\\\'' }`, () => {
    parse(`hi { '\\\\'' }`, options) // { '\\'' }
    // TODO:
    expect(errors).toHaveLength(2)
  })

  test(`unknown escape: hi { '\\x41' }`, () => {
    parse(`hi { '\\x41' }`, options)
    expect(errors).toEqual([
      {
        code: CompileErrorCodes.UNKNOWN_ESCAPE_SEQUENCE,
        domain: ERROR_DOMAIN_TOKENIZE,
        message: `Unknown escape sequence: \\x`,
        location: {
          start: {
            line: 1,
            offset: 5,
            column: 6
          },
          end: {
            line: 1,
            offset: 7,
            column: 8
          }
        }
      }
    ] as CompileError[])
  })

  test(`invalid unicode escape: hi { '\\uwxyz' }`, () => {
    parse(`hi { '\\uwxyz' }`, options)
    expect(errors).toEqual([
      {
        code: CompileErrorCodes.INVALID_UNICODE_ESCAPE_SEQUENCE,
        domain: ERROR_DOMAIN_TOKENIZE,
        message: `Invalid unicode escape sequence: \\uw`,
        location: {
          start: {
            line: 1,
            offset: 5,
            column: 6
          },
          end: {
            line: 1,
            offset: 8,
            column: 9
          }
        }
      }
    ] as CompileError[])
  })

  test(`multiline: hi { 'foo\\n' }`, () => {
    parse(`hi { 'foo\n' }`, options)
    expect(errors).toEqual([
      {
        code: CompileErrorCodes.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER,
        domain: ERROR_DOMAIN_TOKENIZE,
        message: `Unterminated single quote in placeholder`,
        location: {
          start: {
            line: 1,
            offset: 5,
            column: 6
          },
          end: {
            line: 1,
            offset: 9,
            column: 10
          }
        }
      }
    ] as CompileError[])
  })
})

describe('edge cases', () => {
  test(`too few hex digits after: '\\u41'`, () => {
    const tokenizer = createTokenizer(`{ '\\u41' }`) // { '\u41' }
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceLeft,
      value: '{',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 2, offset: 1 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Literal,
      value: '\\u41',
      loc: {
        start: { line: 1, column: 3, offset: 2 },
        end: { line: 1, column: 9, offset: 8 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceRight,
      value: '}',
      loc: {
        start: { line: 1, column: 10, offset: 9 },
        end: { line: 1, column: 11, offset: 10 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.EOF,
      loc: {
        start: { line: 1, column: 11, offset: 10 },
        end: { line: 1, column: 11, offset: 10 }
      }
    })
  })

  test(`too few hex digits after: '\\U1F60200'`, () => {
    const tokenizer = createTokenizer(`{ '\\U01F60200' }`) // { '\U01F60200' }
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceLeft,
      value: '{',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 2, offset: 1 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Literal,
      value: '\\U01F60200',
      loc: {
        start: { line: 1, column: 3, offset: 2 },
        end: { line: 1, column: 15, offset: 14 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceRight,
      value: '}',
      loc: {
        start: { line: 1, column: 16, offset: 15 },
        end: { line: 1, column: 17, offset: 16 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.EOF,
      loc: {
        start: { line: 1, column: 17, offset: 16 },
        end: { line: 1, column: 17, offset: 16 }
      }
    })
  })
})
