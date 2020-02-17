import { createTokenizer, TokenTypes } from '../../../src/message/tokenizer'

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
      start: { line: 1, column: 5, offset: 4 },
      end: { line: 1, column: 12, offset: 11 }
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

test('with modulo', () => {
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
