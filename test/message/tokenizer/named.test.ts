import { format } from '../../../src/utils'
import { TokenizeOptions } from '../../../src/message/options'
import {
  CompileErrorCodes,
  CompileError,
  errorMessages
} from '../../../src/message/errors'
import {
  createTokenizer,
  TokenTypes,
  ERROR_DOMAIN,
  parse
} from '../../../src/message/tokenizer'

test('basic', () => {
  const tokenizer = createTokenizer('hi {name} !')
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
    type: TokenTypes.Named,
    value: 'name',
    loc: {
      start: { line: 1, column: 5, offset: 4 },
      end: { line: 1, column: 9, offset: 8 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceRight,
    value: '}',
    loc: {
      start: { line: 1, column: 9, offset: 8 },
      end: { line: 1, column: 10, offset: 9 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: ' !',
    loc: {
      start: { line: 1, column: 10, offset: 9 },
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

test('multiple', () => {
  const tokenizer = createTokenizer('{last} {middle}　{first}')
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceLeft,
    value: '{',
    loc: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 1, column: 2, offset: 1 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Named,
    value: 'last',
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
    type: TokenTypes.Text,
    value: ' ',
    loc: {
      start: { line: 1, column: 7, offset: 6 },
      end: { line: 1, column: 8, offset: 7 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceLeft,
    value: '{',
    loc: {
      start: { line: 1, column: 8, offset: 7 },
      end: { line: 1, column: 9, offset: 8 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Named,
    value: 'middle',
    loc: {
      start: { line: 1, column: 9, offset: 8 },
      end: { line: 1, column: 15, offset: 14 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceRight,
    value: '}',
    loc: {
      start: { line: 1, column: 15, offset: 14 },
      end: { line: 1, column: 16, offset: 15 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: '　',
    loc: {
      start: { line: 1, column: 16, offset: 15 },
      end: { line: 1, column: 17, offset: 16 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceLeft,
    value: '{',
    loc: {
      start: { line: 1, column: 17, offset: 16 },
      end: { line: 1, column: 18, offset: 17 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Named,
    value: 'first',
    loc: {
      start: { line: 1, column: 18, offset: 17 },
      end: { line: 1, column: 23, offset: 22 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceRight,
    value: '}',
    loc: {
      start: { line: 1, column: 23, offset: 22 },
      end: { line: 1, column: 24, offset: 23 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.EOF,
    loc: {
      start: { line: 1, column: 24, offset: 23 },
      end: { line: 1, column: 24, offset: 23 }
    }
  })
})

test('space', () => {
  const tokenizer = createTokenizer('hi {  name } !')
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
    type: TokenTypes.Named,
    value: 'name',
    loc: {
      start: { line: 1, column: 7, offset: 6 },
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
    type: TokenTypes.Text,
    value: ' !',
    loc: {
      start: { line: 1, column: 13, offset: 12 },
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

test('new line', () => {
  const tokenizer = createTokenizer('{last}\n{middle}\r\n{first}')
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceLeft,
    value: '{',
    loc: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 1, column: 2, offset: 1 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Named,
    value: 'last',
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
    type: TokenTypes.Text,
    value: '\n',
    loc: {
      start: { line: 1, column: 7, offset: 6 },
      end: { line: 2, column: 1, offset: 7 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceLeft,
    value: '{',
    loc: {
      start: { line: 2, column: 1, offset: 7 },
      end: { line: 2, column: 2, offset: 8 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Named,
    value: 'middle',
    loc: {
      start: { line: 2, column: 2, offset: 8 },
      end: { line: 2, column: 8, offset: 14 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceRight,
    value: '}',
    loc: {
      start: { line: 2, column: 8, offset: 14 },
      end: { line: 2, column: 9, offset: 15 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: '\n',
    loc: {
      start: { line: 2, column: 9, offset: 15 },
      end: { line: 3, column: 1, offset: 17 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceLeft,
    value: '{',
    loc: {
      start: { line: 3, column: 1, offset: 17 },
      end: { line: 3, column: 2, offset: 18 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Named,
    value: 'first',
    loc: {
      start: { line: 3, column: 2, offset: 18 },
      end: { line: 3, column: 7, offset: 23 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceRight,
    value: '}',
    loc: {
      start: { line: 3, column: 7, offset: 23 },
      end: { line: 3, column: 8, offset: 24 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.EOF,
    loc: {
      start: { line: 3, column: 8, offset: 24 },
      end: { line: 3, column: 8, offset: 24 }
    }
  })
})

describe('modulo cases', () => {
  test('basic named: hi %{name} !', () => {
    const tokenizer = createTokenizer('hi %{name} !')
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Text,
      value: 'hi ',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 4, offset: 3 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Modulo,
      value: '%',
      loc: {
        start: { line: 1, column: 4, offset: 3 },
        end: { line: 1, column: 5, offset: 4 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceLeft,
      value: '{',
      loc: {
        start: { line: 1, column: 5, offset: 4 },
        end: { line: 1, column: 6, offset: 5 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Named,
      value: 'name',
      loc: {
        start: { line: 1, column: 6, offset: 5 },
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
      type: TokenTypes.Text,
      value: ' !',
      loc: {
        start: { line: 1, column: 11, offset: 10 },
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

  test('not modulo named: hi % {name} !', () => {
    const tokenizer = createTokenizer('hi % {name} !')
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Text,
      value: 'hi % ',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 6, offset: 5 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.BraceLeft,
      value: '{',
      loc: {
        start: { line: 1, column: 6, offset: 5 },
        end: { line: 1, column: 7, offset: 6 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Named,
      value: 'name',
      loc: {
        start: { line: 1, column: 7, offset: 6 },
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
      type: TokenTypes.Text,
      value: ' !',
      loc: {
        start: { line: 1, column: 12, offset: 11 },
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

  test('other placeholder sytnax: hi %s !', () => {
    const tokenizer = createTokenizer('hi %s !')
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Text,
      value: 'hi %s !',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 8, offset: 7 }
      }
    })
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.EOF,
      loc: {
        start: { line: 1, column: 8, offset: 7 },
        end: { line: 1, column: 8, offset: 7 }
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

  test('empty placeholder', () => {
    parse(`hi, {} !`, options)
    expect(errors).toEqual([
      {
        code: CompileErrorCodes.EMPTY_PLACEHOLDER,
        domain: ERROR_DOMAIN,
        message: errorMessages[CompileErrorCodes.EMPTY_PLACEHOLDER],
        location: {
          start: {
            line: 1,
            offset: 5,
            column: 6
          },
          end: {
            line: 1,
            offset: 5,
            column: 6
          }
        }
      }
    ] as CompileError[])
  })

  test('nest placeholder', () => {
    parse(`hi, {{ kazupon`, options)
    expect(errors).toEqual([
      {
        code: CompileErrorCodes.NOT_ALLOW_NEST_PLACEHOLDER,
        domain: ERROR_DOMAIN,
        message: errorMessages[CompileErrorCodes.NOT_ALLOW_NEST_PLACEHOLDER],
        location: {
          start: {
            line: 1,
            offset: 5,
            column: 6
          },
          end: {
            line: 1,
            offset: 5,
            column: 6
          }
        }
      },
      {
        code: CompileErrorCodes.UNTERMINATED_CLOSING_BRACE,
        domain: ERROR_DOMAIN,
        message: errorMessages[CompileErrorCodes.UNTERMINATED_CLOSING_BRACE],
        location: {
          start: {
            line: 1,
            offset: 7,
            column: 8
          },
          end: {
            line: 1,
            offset: 14,
            column: 15
          }
        }
      }
    ] as CompileError[])
  })

  test('close brace only', () => {
    parse(`hi, :-} !`, options)
    expect(errors).toEqual([
      {
        code: CompileErrorCodes.UNBALANCED_CLOSING_BRACE,
        domain: ERROR_DOMAIN,
        message: errorMessages[CompileErrorCodes.UNBALANCED_CLOSING_BRACE],
        location: {
          start: {
            line: 1,
            offset: 6,
            column: 7
          },
          end: {
            line: 1,
            offset: 6,
            column: 7
          }
        }
      }
    ] as CompileError[])
  })

  test('not close brace at sentence', () => {
    parse(`hi { name !`, options)
    expect(errors).toEqual([
      {
        code: CompileErrorCodes.UNTERMINATED_CLOSING_BRACE,
        domain: ERROR_DOMAIN,
        message: errorMessages[CompileErrorCodes.UNTERMINATED_CLOSING_BRACE],
        location: {
          start: {
            line: 1,
            offset: 10,
            column: 11
          },
          end: {
            line: 1,
            offset: 10,
            column: 11
          }
        }
      }
    ] as CompileError[])
  })

  test('not close brace at EOF', () => {
    parse(`hi {name`, options)
    expect(errors).toEqual([
      {
        code: CompileErrorCodes.UNTERMINATED_CLOSING_BRACE,
        domain: ERROR_DOMAIN,
        message: errorMessages[CompileErrorCodes.UNTERMINATED_CLOSING_BRACE],
        location: {
          start: {
            line: 1,
            offset: 4,
            column: 5
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

  test('not close brace in plural message', () => {
    parse(`hi {  | hello {name} !`, options)
    expect(errors).toEqual([
      {
        code: CompileErrorCodes.UNTERMINATED_CLOSING_BRACE,
        domain: ERROR_DOMAIN,
        message: errorMessages[CompileErrorCodes.UNTERMINATED_CLOSING_BRACE],
        location: {
          start: {
            line: 1,
            offset: 6,
            column: 7
          },
          end: {
            line: 1,
            offset: 6,
            column: 7
          }
        }
      }
    ] as CompileError[])
  })

  test('not close brace with linked', () => {
    parse(`hi { @:name !`, options)
    expect(errors).toEqual([
      {
        code: CompileErrorCodes.UNTERMINATED_CLOSING_BRACE,
        domain: ERROR_DOMAIN,
        message: errorMessages[CompileErrorCodes.UNTERMINATED_CLOSING_BRACE],
        location: {
          start: {
            line: 1,
            offset: 5,
            column: 6
          },
          end: {
            line: 1,
            offset: 5,
            column: 6
          }
        }
      }
    ] as CompileError[])
  })
  ;[`$`, `-`, `_`].forEach(ch => {
    test(`invalid '${ch}' in placeholder`, () => {
      parse(`hi {${ch}} !`, options)
      expect(errors).toEqual([
        {
          code: CompileErrorCodes.INVALID_TOKEN_IN_PLACEHOLDER,
          domain: ERROR_DOMAIN,
          message: format(
            errorMessages[CompileErrorCodes.INVALID_TOKEN_IN_PLACEHOLDER],
            ch
          ),
          location: {
            start: {
              line: 1,
              offset: 4,
              column: 5
            },
            end: {
              line: 1,
              offset: 5,
              column: 6
            }
          }
        }
      ] as CompileError[])
    })
  })
})
