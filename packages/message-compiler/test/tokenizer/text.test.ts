import { createTokenizer, TokenTypes } from '../../src/tokenizer'

test('basic', () => {
  const tokenizer = createTokenizer('hello world')
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: 'hello world',
    loc: {
      start: { line: 1, column: 1, offset: 0 },
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

test('multi lines', () => {
  const tokenizer = createTokenizer('hello\nworld')
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: 'hello\nworld',
    loc: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 2, column: 6, offset: 11 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.EOF,
    loc: {
      start: { line: 2, column: 6, offset: 11 },
      end: { line: 2, column: 6, offset: 11 }
    }
  })
})

test('empty', () => {
  const tokenizer = createTokenizer('')
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.EOF,
    loc: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 1, column: 1, offset: 0 }
    }
  })
})

test('modulo', () => {
  const tokenizer = createTokenizer('% foo')
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: '% foo',
    loc: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 1, column: 6, offset: 5 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.EOF,
    loc: {
      start: { line: 1, column: 6, offset: 5 },
      end: { line: 1, column: 6, offset: 5 }
    }
  })
})

test('double modulo', () => {
  const tokenizer = createTokenizer('%% foo')
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: '%% foo',
    loc: {
      start: { line: 1, column: 1, offset: 0 },
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

test('modulo only', () => {
  const tokenizer = createTokenizer('%')
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: '%',
    loc: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 1, column: 2, offset: 1 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.EOF,
    loc: {
      start: { line: 1, column: 2, offset: 1 },
      end: { line: 1, column: 2, offset: 1 }
    }
  })
})

test('spaces', () => {
  const tokenizer = createTokenizer(' hello world ')
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: ' hello world ',
    loc: {
      start: { line: 1, column: 1, offset: 0 },
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

test('&nbsp;', () => {
  // https://github.com/kazupon/vue-i18n/issues/318
  const tokenizer = createTokenizer('&nbsp;')
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: '&nbsp;',
    loc: {
      start: { line: 1, column: 1, offset: 0 },
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

test('backslash followed by non-special char', () => {
  const tokenizer = createTokenizer('Value with \\ a backslash')
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: 'Value with \\ a backslash',
    loc: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 1, column: 25, offset: 24 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.EOF,
    loc: {
      start: { line: 1, column: 25, offset: 24 },
      end: { line: 1, column: 25, offset: 24 }
    }
  })
})

test('double backslash escape', () => {
  // Two consecutive backslashes form an escape sequence
  const tokenizer = createTokenizer('Value with \\\\ a backslash')
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: 'Value with \\\\ a backslash',
    loc: {
      start: { line: 1, column: 1, offset: 0 },
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

test('unicode', () => {
  const tokenizer = createTokenizer('\u0041')
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: 'A',
    loc: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 1, column: 2, offset: 1 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.EOF,
    loc: {
      start: { line: 1, column: 2, offset: 1 },
      end: { line: 1, column: 2, offset: 1 }
    }
  })
})

test('unicode with backslash', () => {
  // \\u0041 in source is the literal string \u0041 (not unicode escape)
  const tokenizer = createTokenizer('\\u0041')
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: '\\u0041',
    loc: {
      start: { line: 1, column: 1, offset: 0 },
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

describe('escape sequences', () => {
  test('escaped @', () => {
    const tokenizer = createTokenizer('foo\\@bar.com')
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Text,
      value: 'foo\\@bar.com',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
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

  test('escaped {', () => {
    const tokenizer = createTokenizer('hello\\{world')
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Text,
      value: 'hello\\{world',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
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

  test('escaped }', () => {
    const tokenizer = createTokenizer('hello\\}world')
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Text,
      value: 'hello\\}world',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
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

  test('escaped |', () => {
    const tokenizer = createTokenizer('apples\\|oranges')
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Text,
      value: 'apples\\|oranges',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
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

  test('escaped backslash', () => {
    const tokenizer = createTokenizer('path\\\\file')
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Text,
      value: 'path\\\\file',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
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

  test('escaped @ does not trigger linked message', () => {
    // Without escape, @ would trigger LinkedAlias token
    const tokenizer = createTokenizer('foo\\@bar')
    const token = tokenizer.nextToken()
    expect(token.type).toEqual(TokenTypes.Text)
    expect(token.value).toEqual('foo\\@bar')
    expect(tokenizer.nextToken().type).toEqual(TokenTypes.EOF)
  })

  test('escaped | does not trigger plural', () => {
    // Without escape, | would trigger Pipe token
    const tokenizer = createTokenizer('apples \\| oranges')
    const token = tokenizer.nextToken()
    expect(token.type).toEqual(TokenTypes.Text)
    expect(token.value).toEqual('apples \\| oranges')
    expect(tokenizer.nextToken().type).toEqual(TokenTypes.EOF)
  })

  test('escaped { does not trigger placeholder', () => {
    // Without escape, { would trigger BraceLeft token
    const tokenizer = createTokenizer('hello \\{name\\}')
    const token = tokenizer.nextToken()
    expect(token.type).toEqual(TokenTypes.Text)
    expect(token.value).toEqual('hello \\{name\\}')
    expect(tokenizer.nextToken().type).toEqual(TokenTypes.EOF)
  })

  test('escape with placeholder', () => {
    // Mix of escape sequences and actual placeholders
    const tokenizer = createTokenizer('\\@{name}')
    const t1 = tokenizer.nextToken()
    expect(t1.type).toEqual(TokenTypes.Text)
    expect(t1.value).toEqual('\\@')
    const t2 = tokenizer.nextToken()
    expect(t2.type).toEqual(TokenTypes.BraceLeft)
    const t3 = tokenizer.nextToken()
    expect(t3.type).toEqual(TokenTypes.Named)
    expect(t3.value).toEqual('name')
    const t4 = tokenizer.nextToken()
    expect(t4.type).toEqual(TokenTypes.BraceRight)
    expect(tokenizer.nextToken().type).toEqual(TokenTypes.EOF)
  })

  test('backslash at end of input', () => {
    const tokenizer = createTokenizer('hello\\')
    expect(tokenizer.nextToken()).toEqual({
      type: TokenTypes.Text,
      value: 'hello\\',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
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
})
