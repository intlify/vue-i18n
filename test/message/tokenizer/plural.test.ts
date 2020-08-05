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

test('include modulo', () => {
  const tokenizer = createTokenizer(
    'no apples %| one apple % |  too much apples  '
  )
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: 'no apples %',
    loc: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 1, column: 12, offset: 11 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Pipe,
    value: '|',
    loc: {
      start: { line: 1, column: 12, offset: 11 },
      end: { line: 1, column: 14, offset: 13 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: 'one apple %',
    loc: {
      start: { line: 1, column: 14, offset: 13 },
      end: { line: 1, column: 25, offset: 24 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Pipe,
    value: '|',
    loc: {
      start: { line: 1, column: 25, offset: 24 },
      end: { line: 1, column: 29, offset: 28 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: 'too much apples  ',
    loc: {
      start: { line: 1, column: 29, offset: 28 },
      end: { line: 1, column: 46, offset: 45 }
    }
  })
})

test('complex', () => {
  const tokenizer = createTokenizer(
    `@.lower:{'no apples'} | {1} apple | {count}　apples` // eslint-disable-line no-irregular-whitespace
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
    type: TokenTypes.BraceLeft,
    value: '{',
    loc: {
      start: { line: 1, column: 9, offset: 8 },
      end: { line: 1, column: 10, offset: 9 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Literal,
    value: 'no apples',
    loc: {
      start: { line: 1, column: 10, offset: 9 },
      end: { line: 1, column: 21, offset: 20 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceRight,
    value: '}',
    loc: {
      start: { line: 1, column: 21, offset: 20 },
      end: { line: 1, column: 22, offset: 21 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Pipe,
    value: '|',
    loc: {
      start: { line: 1, column: 22, offset: 21 },
      end: { line: 1, column: 25, offset: 24 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceLeft,
    value: '{',
    loc: {
      start: { line: 1, column: 25, offset: 24 },
      end: { line: 1, column: 26, offset: 25 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.List,
    value: '1',
    loc: {
      start: { line: 1, column: 26, offset: 25 },
      end: { line: 1, column: 27, offset: 26 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceRight,
    value: '}',
    loc: {
      start: { line: 1, column: 27, offset: 26 },
      end: { line: 1, column: 28, offset: 27 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: ' apple',
    loc: {
      start: { line: 1, column: 28, offset: 27 },
      end: { line: 1, column: 34, offset: 33 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Pipe,
    value: '|',
    loc: {
      start: { line: 1, column: 34, offset: 33 },
      end: { line: 1, column: 37, offset: 36 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceLeft,
    value: '{',
    loc: {
      start: { line: 1, column: 37, offset: 36 },
      end: { line: 1, column: 38, offset: 37 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Named,
    value: 'count',
    loc: {
      start: { line: 1, column: 38, offset: 37 },
      end: { line: 1, column: 43, offset: 42 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceRight,
    value: '}',
    loc: {
      start: { line: 1, column: 43, offset: 42 },
      end: { line: 1, column: 44, offset: 43 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: '　apples',
    loc: {
      start: { line: 1, column: 44, offset: 43 },
      end: { line: 1, column: 51, offset: 50 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.EOF,
    loc: {
      start: { line: 1, column: 51, offset: 50 },
      end: { line: 1, column: 51, offset: 50 }
    }
  })
})
