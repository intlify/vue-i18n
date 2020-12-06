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

test.todo(`backslash: Value with \ a backslash`)
test.todo(`double backslash: Value with \\ a backslash`)
test.todo(`unicode: \u0041`)
test.todo(`unicode with backslash: \\u0041`)
