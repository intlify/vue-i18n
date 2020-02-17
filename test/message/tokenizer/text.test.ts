import { createTokenizer, TokenTypes } from '../../../src/message/tokenizer'

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
