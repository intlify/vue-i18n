import { createTokenizer, TokenTypes } from '../../../src/message/tokenizer'

test('basic', () => {
  const tokenizer = createTokenizer(
    'no apples | one apple  |  too much apples  '
  )
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: 'no apples',
    loc: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 1, column: 10, offset: 9 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Pipe,
    value: '|',
    loc: {
      start: { line: 1, column: 10, offset: 9 },
      end: { line: 1, column: 13, offset: 12 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: 'one apple',
    loc: {
      start: { line: 1, column: 13, offset: 12 },
      end: { line: 1, column: 22, offset: 21 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Pipe,
    value: '|',
    loc: {
      start: { line: 1, column: 22, offset: 21 },
      end: { line: 1, column: 27, offset: 26 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: 'too much apples  ',
    loc: {
      start: { line: 1, column: 27, offset: 26 },
      end: { line: 1, column: 44, offset: 43 }
    }
  })
})

test('multi lines', () => {
  const tokenizer = createTokenizer(
    'no apples |\n one apple  |\n  too much apples  '
  )
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: 'no apples',
    loc: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 1, column: 10, offset: 9 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Pipe,
    value: '|',
    loc: {
      start: { line: 1, column: 10, offset: 9 },
      end: { line: 2, column: 2, offset: 13 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: 'one apple',
    loc: {
      start: { line: 2, column: 2, offset: 13 },
      end: { line: 2, column: 11, offset: 22 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Pipe,
    value: '|',
    loc: {
      start: { line: 2, column: 11, offset: 22 },
      end: { line: 3, column: 3, offset: 28 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: 'too much apples  ',
    loc: {
      start: { line: 3, column: 3, offset: 28 },
      end: { line: 3, column: 20, offset: 45 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.EOF,
    loc: {
      start: { line: 3, column: 20, offset: 45 },
      end: { line: 3, column: 20, offset: 45 }
    }
  })
})

test('complex', () => {
  const tokenizer = createTokenizer(
    '@.lower:(no apples) | {1} apple | {count}　apples'
  )
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.LinkedAlias,
    value: '@',
    loc: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 1, column: 2, offset: 1 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.LinkedDot,
    value: '.',
    loc: {
      start: { line: 1, column: 2, offset: 1 },
      end: { line: 1, column: 3, offset: 2 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.LinkedModifier,
    value: 'lower',
    loc: {
      start: { line: 1, column: 3, offset: 2 },
      end: { line: 1, column: 8, offset: 7 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.LinkedDelimiter,
    value: ':',
    loc: {
      start: { line: 1, column: 8, offset: 7 },
      end: { line: 1, column: 9, offset: 8 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.ParenLeft,
    value: '(',
    loc: {
      start: { line: 1, column: 9, offset: 8 },
      end: { line: 1, column: 10, offset: 9 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.LinkedKey,
    value: 'no apples',
    loc: {
      start: { line: 1, column: 10, offset: 9 },
      end: { line: 1, column: 19, offset: 18 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.ParenRight,
    value: ')',
    loc: {
      start: { line: 1, column: 19, offset: 18 },
      end: { line: 1, column: 20, offset: 19 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Pipe,
    value: '|',
    loc: {
      start: { line: 1, column: 20, offset: 19 },
      end: { line: 1, column: 23, offset: 22 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceLeft,
    value: '{',
    loc: {
      start: { line: 1, column: 23, offset: 22 },
      end: { line: 1, column: 24, offset: 23 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.List,
    value: '1',
    loc: {
      start: { line: 1, column: 24, offset: 23 },
      end: { line: 1, column: 25, offset: 24 }
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
    type: TokenTypes.Text,
    value: ' apple',
    loc: {
      start: { line: 1, column: 26, offset: 25 },
      end: { line: 1, column: 32, offset: 31 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Pipe,
    value: '|',
    loc: {
      start: { line: 1, column: 32, offset: 31 },
      end: { line: 1, column: 35, offset: 34 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceLeft,
    value: '{',
    loc: {
      start: { line: 1, column: 35, offset: 34 },
      end: { line: 1, column: 36, offset: 35 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Named,
    value: 'count',
    loc: {
      start: { line: 1, column: 36, offset: 35 },
      end: { line: 1, column: 41, offset: 40 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceRight,
    value: '}',
    loc: {
      start: { line: 1, column: 41, offset: 40 },
      end: { line: 1, column: 42, offset: 41 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: '　apples',
    loc: {
      start: { line: 1, column: 42, offset: 41 },
      end: { line: 1, column: 49, offset: 48 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.EOF,
    loc: {
      start: { line: 1, column: 49, offset: 48 },
      end: { line: 1, column: 49, offset: 48 }
    }
  })
})
