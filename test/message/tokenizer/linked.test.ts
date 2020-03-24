import { createTokenizer, TokenTypes } from '../../../src/message/tokenizer'

test('linked key', () => {
  const tokenizer = createTokenizer('hi @:name !')
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: 'hi ',
    loc: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 1, column: 4, offset: 3 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.LinkedAlias,
    value: '@',
    loc: {
      start: { line: 1, column: 4, offset: 3 },
      end: { line: 1, column: 5, offset: 4 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.LinkedDelimiter,
    value: ':',
    loc: {
      start: { line: 1, column: 5, offset: 4 },
      end: { line: 1, column: 6, offset: 5 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.LinkedKey,
    value: 'name',
    loc: {
      start: { line: 1, column: 6, offset: 5 },
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

test('linked key with parent', () => {
  const tokenizer = createTokenizer('hi @:(hello world) !')
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: 'hi ',
    loc: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 1, column: 4, offset: 3 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.LinkedAlias,
    value: '@',
    loc: {
      start: { line: 1, column: 4, offset: 3 },
      end: { line: 1, column: 5, offset: 4 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.LinkedDelimiter,
    value: ':',
    loc: {
      start: { line: 1, column: 5, offset: 4 },
      end: { line: 1, column: 6, offset: 5 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.ParenLeft,
    value: '(',
    loc: {
      start: { line: 1, column: 6, offset: 5 },
      end: { line: 1, column: 7, offset: 6 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.LinkedKey,
    value: 'hello world',
    loc: {
      start: { line: 1, column: 7, offset: 6 },
      end: { line: 1, column: 18, offset: 17 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.ParenRight,
    value: ')',
    loc: {
      start: { line: 1, column: 18, offset: 17 },
      end: { line: 1, column: 19, offset: 18 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: ' !',
    loc: {
      start: { line: 1, column: 19, offset: 18 },
      end: { line: 1, column: 21, offset: 20 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.EOF,
    loc: {
      start: { line: 1, column: 21, offset: 20 },
      end: { line: 1, column: 21, offset: 20 }
    }
  })
})

test('linked refer with name', () => {
  const tokenizer = createTokenizer('hi @:{name}\n !')
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: 'hi ',
    loc: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 1, column: 4, offset: 3 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.LinkedAlias,
    value: '@',
    loc: {
      start: { line: 1, column: 4, offset: 3 },
      end: { line: 1, column: 5, offset: 4 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.LinkedDelimiter,
    value: ':',
    loc: {
      start: { line: 1, column: 5, offset: 4 },
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
    value: '\n !',
    loc: {
      start: { line: 1, column: 12, offset: 11 },
      end: { line: 2, column: 3, offset: 14 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.EOF,
    loc: {
      start: { line: 2, column: 3, offset: 14 },
      end: { line: 2, column: 3, offset: 14 }
    }
  })
})

test('linked modifier', () => {
  const tokenizer = createTokenizer('hi @.upper:name !')
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: 'hi ',
    loc: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 1, column: 4, offset: 3 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.LinkedAlias,
    value: '@',
    loc: {
      start: { line: 1, column: 4, offset: 3 },
      end: { line: 1, column: 5, offset: 4 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.LinkedDot,
    value: '.',
    loc: {
      start: { line: 1, column: 5, offset: 4 },
      end: { line: 1, column: 6, offset: 5 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.LinkedModifier,
    value: 'upper',
    loc: {
      start: { line: 1, column: 6, offset: 5 },
      end: { line: 1, column: 11, offset: 10 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.LinkedDelimiter,
    value: ':',
    loc: {
      start: { line: 1, column: 11, offset: 10 },
      end: { line: 1, column: 12, offset: 11 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.LinkedKey,
    value: 'name',
    loc: {
      start: { line: 1, column: 12, offset: 11 },
      end: { line: 1, column: 16, offset: 15 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: ' !',
    loc: {
      start: { line: 1, column: 16, offset: 15 },
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

test('dot in refer key', () => {
  const tokenizer = createTokenizer('hi @:foo.bar')
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: 'hi ',
    loc: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 1, column: 4, offset: 3 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.LinkedAlias,
    value: '@',
    loc: {
      start: { line: 1, column: 4, offset: 3 },
      end: { line: 1, column: 5, offset: 4 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.LinkedDelimiter,
    value: ':',
    loc: {
      start: { line: 1, column: 5, offset: 4 },
      end: { line: 1, column: 6, offset: 5 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.LinkedKey,
    value: 'foo.bar',
    loc: {
      start: { line: 1, column: 6, offset: 5 },
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

test('multiple', () => {
  const tokenizer = createTokenizer('hi @:{name} @:{0}!')
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.Text,
    value: 'hi ',
    loc: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 1, column: 4, offset: 3 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.LinkedAlias,
    value: '@',
    loc: {
      start: { line: 1, column: 4, offset: 3 },
      end: { line: 1, column: 5, offset: 4 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.LinkedDelimiter,
    value: ':',
    loc: {
      start: { line: 1, column: 5, offset: 4 },
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
    value: ' ',
    loc: {
      start: { line: 1, column: 12, offset: 11 },
      end: { line: 1, column: 13, offset: 12 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.LinkedAlias,
    value: '@',
    loc: {
      start: { line: 1, column: 13, offset: 12 },
      end: { line: 1, column: 14, offset: 13 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.LinkedDelimiter,
    value: ':',
    loc: {
      start: { line: 1, column: 14, offset: 13 },
      end: { line: 1, column: 15, offset: 14 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.BraceLeft,
    value: '{',
    loc: {
      start: { line: 1, column: 15, offset: 14 },
      end: { line: 1, column: 16, offset: 15 }
    }
  })
  expect(tokenizer.nextToken()).toEqual({
    type: TokenTypes.List,
    value: 0,
    loc: {
      start: { line: 1, column: 16, offset: 15 },
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
    type: TokenTypes.Text,
    value: '!',
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
