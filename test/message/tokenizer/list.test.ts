import { createTokenizer, TokenTypes } from '../../../src/message/tokenizer'

test('basic', () => {
  const tokenizer = createTokenizer('hi {0} !')
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
    type: TokenTypes.List,
    value: 0,
    loc: {
      start: { line: 1, column: 5, offset: 4 },
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
    value: ' !',
    loc: {
      start: { line: 1, column: 7, offset: 6 },
      end: { line: 1, column: 9, offset: 8 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.EOF,
    loc: {
      start: { line: 1, column: 9, offset: 8 },
      end: { line: 1, column: 9, offset: 8 }
    }
  })
})

test('multiple', () => {
  const tokenizer = createTokenizer('{0} {1}　{2}')
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceLeft,
    value: '{',
    loc: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 1, column: 2, offset: 1 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.List,
    value: 0,
    loc: {
      start: { line: 1, column: 2, offset: 1 },
      end: { line: 1, column: 3, offset: 2 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceRight,
    value: '}',
    loc: {
      start: { line: 1, column: 3, offset: 2 },
      end: { line: 1, column: 4, offset: 3 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: ' ',
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
    type: TokenTypes.List,
    value: 1,
    loc: {
      start: { line: 1, column: 6, offset: 5 },
      end: { line: 1, column: 7, offset: 6 }
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
    value: '　',
    loc: {
      start: { line: 1, column: 8, offset: 7 },
      end: { line: 1, column: 9, offset: 8 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceLeft,
    value: '{',
    loc: {
      start: { line: 1, column: 9, offset: 8 },
      end: { line: 1, column: 10, offset: 9 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.List,
    value: 2,
    loc: {
      start: { line: 1, column: 10, offset: 9 },
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

test('space', () => {
  const tokenizer = createTokenizer('hi {  -1 } !')
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
    type: TokenTypes.List,
    value: -1,
    loc: {
      start: { line: 1, column: 5, offset: 4 },
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

test('new line', () => {
  const tokenizer = createTokenizer('{0}\n{1}\r\n{2}')
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceLeft,
    value: '{',
    loc: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 1, column: 2, offset: 1 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.List,
    value: 0,
    loc: {
      start: { line: 1, column: 2, offset: 1 },
      end: { line: 1, column: 3, offset: 2 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceRight,
    value: '}',
    loc: {
      start: { line: 1, column: 3, offset: 2 },
      end: { line: 1, column: 4, offset: 3 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: '\n',
    loc: {
      start: { line: 1, column: 4, offset: 3 },
      end: { line: 2, column: 1, offset: 4 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceLeft,
    value: '{',
    loc: {
      start: { line: 2, column: 1, offset: 4 },
      end: { line: 2, column: 2, offset: 5 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.List,
    value: 1,
    loc: {
      start: { line: 2, column: 2, offset: 5 },
      end: { line: 2, column: 3, offset: 6 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceRight,
    value: '}',
    loc: {
      start: { line: 2, column: 3, offset: 6 },
      end: { line: 2, column: 4, offset: 7 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: '\n',
    loc: {
      start: { line: 2, column: 4, offset: 7 },
      end: { line: 3, column: 1, offset: 9 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceLeft,
    value: '{',
    loc: {
      start: { line: 3, column: 1, offset: 9 },
      end: { line: 3, column: 2, offset: 10 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.List,
    value: 2,
    loc: {
      start: { line: 3, column: 2, offset: 10 },
      end: { line: 3, column: 3, offset: 11 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceRight,
    value: '}',
    loc: {
      start: { line: 3, column: 3, offset: 11 },
      end: { line: 3, column: 4, offset: 12 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.EOF,
    loc: {
      start: { line: 3, column: 4, offset: 12 },
      end: { line: 3, column: 4, offset: 12 }
    }
  })
})
